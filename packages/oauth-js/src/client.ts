import Lock from "./vendor/browser-tabs-lock";
import type {
  AuthOptions,
  AuthState,
  AuthUser,
  ClientConfig,
  CookieOptions,
  SessionData,
  TokenResponse,
} from "./types";
import { generateBase58, hasAuthParams, isJwt } from "./utils/helpers";
import { buildAuthorizeUrl } from "./utils/urls";
import {
  DEFAULT_COOKIE_OPTIONS,
  getAccessToken,
  getRefreshToken,
  getSessionData,
  getStorageAPI,
  getTokenExpire,
  removeTokenCookies,
  saveSessionData,
  setTokenCookies,
} from "./utils/session";
import {
  API_VERSION,
  LAST_PATH_KEY,
  REFRESH_LOCK_KEY,
  REFRESH_CHECK_INTERVAL,
  STATE_DATA_KEY,
  SESSION_DATA_KEY,
  VERIFIER_DATA_KEY,
} from "./constants";
import { createPkceChallenge, isTokenExpiring } from "./utils";
import { verifyJwt } from "./utils/jwt";

export class OAuthClient {
  config: ClientConfig;
  options: AuthOptions;
  authState: AuthState; // current state of authentication
  user: AuthUser | undefined;
  error: string; // the last error message

  private storage: Storage;
  private timer: number | null;

  constructor(config: ClientConfig, options?: CookieOptions) {
    if (!config.clientId) throw new Error("A clientId is required");
    if (!config.domain) throw new Error("A domain is required");

    this.authState = "INIT";
    this.error = "";
    this.storage = getStorageAPI(!!options?.useCookie);
    this.timer = null;

    // handle non-standard ports for local development
    const port = ["80", "443"].includes(window.location.port)
      ? ""
      : `:${window.location.port}`;

    this.config = {
      ...config,
      callbackUri:
        config.callbackUri ||
        `${window.location.protocol}//${window.location.hostname}${port}`,
    };
    this.options = {
      sessionKey: config.sessionKey || SESSION_DATA_KEY,
      ...DEFAULT_COOKIE_OPTIONS,
      ...options,
    };
  }

  async init() {
    if (this.authState !== "INIT") {
      return;
    }
    this.setState("LOADING");

    const accessToken = getAccessToken(this.options);
    const tokenExpire = getTokenExpire(this.options);

    if (hasAuthParams()) {
      await this.exchangeCodeForToken();
    } else if (accessToken && tokenExpire) {
      // has a token and token will expire soon, do refresh
      if (isTokenExpiring(tokenExpire)) {
        try {
          await this.refresh();
        } catch {}
      } else {
        this.validateToken(accessToken);
      }
    } else {
      this.setState("NOAUTH");
    }
  }

  async login() {
    const { verifier, challenge } = await createPkceChallenge();

    const stateCode = generateBase58(32);
    this.storage.setItem(STATE_DATA_KEY, stateCode);
    this.storage.setItem(VERIFIER_DATA_KEY, verifier);
    this.storage.setItem(
      LAST_PATH_KEY,
      `${location.pathname}${location.search}`
    );

    const url = buildAuthorizeUrl(this.config.domain, {
      clientId: this.config.clientId,
      redirectUri: this.config.callbackUri || "",
      state: stateCode,
      challenge: challenge,
      challengeMethod: "S256",
      responseType: "code",
      scope: this.config.scope,
    });

    window.location.assign(url);
  }

  async logout() {
    try {
      // TODO: the logout endpoint doesn't work correctly yet
      const response = await this.get("logout", {
        state: generateBase58(32),
        redirect_uri: this.config.callbackUri,
      });

      if (response.ok) {
        this.user = undefined;
        this.setState("NOAUTH");
      } else {
        this.setError(
          `logout error: ${response.status} - ${response.statusText}`
        );
      }

      this.clearData();
    } catch (error) {
      console.warn(error);
      this.setError("logout failed");
    }
  }

  async refresh(force = false) {
    const initialState = this.authState;
    const lock = new Lock();

    try {
      if (await lock.acquireLock(REFRESH_LOCK_KEY)) {
        if (this.shouldTokenRefresh() || force) {
          this.setState("REFRESH");

          const stateData = getSessionData(this.options);
          const refreshToken = getRefreshToken(this.options);

          const response = await this.post("token", {
            client_id: this.config.clientId,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
            scope: stateData.scope || this.config.scope || "",
          });

          if (response.ok) {
            const data = (await response.json()) as TokenResponse;
            this.processTokenResponse(data);
          } else {
            this.setState("NOAUTH");
            this.user = undefined;
            this.clearData();
            this.stopTokenWatch();
          }
        }
      } else {
        console.warn("Could not aquire refresh lock.");
      }
    } catch (error: any) {
      if (initialState === "INIT") {
        // refresh expected to fail in initial state
      } else {
        console.warn(error);
        this.setError(error.toString());
      }
    } finally {
      await lock.releaseLock(REFRESH_LOCK_KEY);
    }
  }

  async introspect(accessToken: string) {
    const response = await this.post("token/introspect", {
      client_id: this.config.clientId,
      token_type_hint: "access_token",
      token: accessToken,
    });

    return response;
  }

  async getToken(): Promise<string> {
    if (this.shouldTokenRefresh()) {
      try {
        await this.refresh();
      } catch (err) {}
    }

    const accessToken = getAccessToken(this.options);
    if (!accessToken) {
      // throw error
      this.setError("no access token available");
    }

    return accessToken || "";
  }

  getUser(): AuthUser | undefined {
    const sessionData = getSessionData(this.options);
    return sessionData.user;
  }

  // internal methods

  private setError(message: string) {
    this.user = undefined;
    this.error = message;
    this.setState("ERROR");
  }

  private clearData() {
    removeTokenCookies(this.options);
    this.storage.removeItem(STATE_DATA_KEY);
  }

  private async validateToken(accessToken: string) {
    // parse JWT
    if (isJwt(accessToken)) {
      const result = await verifyJwt(accessToken, this.config.domain);

      if (!!result.error) {
        this.setError(result.error);
      } else {
        this.user = result.user;
        // this.setState("AUTHENTICATED");
        this.authState = "AUTHENTICATED";
        this.startTokenWatch();
      }
    } else {
      // opaque token, call introspect to get user defails
      const response = await this.introspect(accessToken);

      if (response.ok) {
        const data = await response.json();
        this.user = {
          id: data.sub,
          username: data.username,
          email: data.email,
          profile: {
            ...(data["pangea.profile"] || {}),
          },
          intelligence: {
            ...(data["pangea.intelligence"] || {}),
          },
        };
        this.setState("AUTHENTICATED");
        this.startTokenWatch();
      } else {
        this.setError(`${response.status}: ${response.statusText}`);
      }
    }
  }

  private setState(state: AuthState) {
    this.authState = state;
    if (this.config.onStateChange) {
      this.config.onStateChange({
        state: this.authState,
        user: this.user,
        error: this.error,
      });
    }
  }

  private checkTokenLife() {
    const tokenExpire = getTokenExpire(this.options);

    if (tokenExpire && this.beforeRefresh() && isTokenExpiring(tokenExpire)) {
      this.refresh();
    }
  }

  private startTokenWatch() {
    const intervalTime = REFRESH_CHECK_INTERVAL * 1000;

    this.stopTokenWatch();

    this.timer = window.setInterval(() => {
      this.checkTokenLife();
    }, intervalTime);
  }

  private stopTokenWatch() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private beforeRefresh() {
    return !document.hidden;
  }

  private async processTokenResponse(data: TokenResponse) {
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + data.expires_in * 1000
    ).toString();

    // call validate token
    await this.validateToken(data.access_token || "");

    const sessionData: SessionData = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      scope: data.scope,
      id_token: data.id_token,
      expires_at: expiresAt,
      user: this.user,
    };

    saveSessionData(sessionData, this.options);

    this.storage.removeItem(LAST_PATH_KEY);

    if (this.options.useCookie) {
      setTokenCookies(sessionData, this.options);
    }
  }

  private async exchangeCodeForToken() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const savedState = this.storage.getItem(STATE_DATA_KEY);
    const codeVerifier = this.storage.getItem(VERIFIER_DATA_KEY);

    const state = urlParams.get("state");
    const code = urlParams.get("code");

    if (!state || !code) {
      this.setError("Missing required parameters");
    } else if (state !== savedState || savedState === "") {
      this.setError("Invalid session state");
    } else {
      try {
        const response = await this.post("token", {
          client_id: this.config.clientId,
          redirect_uri: this.config.callbackUri,
          grant_type: "authorization_code",
          code_verifier: codeVerifier,
          code,
        });

        if (response.ok) {
          const data = (await response.json()) as TokenResponse;
          this.setState("AUTHENTICATED");
          this.startTokenWatch();
          this.processTokenResponse(data);

          this.storage.removeItem(STATE_DATA_KEY);
          this.storage.removeItem(VERIFIER_DATA_KEY);

          // remove state and code params from the URL
          urlParams.delete("state");
          urlParams.delete("code");
          const newSearch = urlParams.toString();
          const cleanUrl = newSearch
            ? `${window.location.pathname}?${newSearch}`
            : window.location.pathname;

          window.history.replaceState({}, "", cleanUrl);

          const returnURL = this.storage.getItem(LAST_PATH_KEY) || "/";

          const appState = {
            userData: this.user,
            returnPath: returnURL,
            authState: this.storage.getItem(STATE_DATA_KEY),
          };

          if (this.config.onLogin) {
            this.config.onLogin(appState);
          }
        }
      } catch (err) {
        this.setState("ERROR");
      }
    }
  }

  private shouldTokenRefresh(): boolean {
    switch (this.authState) {
      case "INIT":
        return true;
      case "REFRESH":
      case "ERROR":
        return false;
      case "LOADING":
      case "AUTHENTICATED":
        const accessToken = getAccessToken(this.options);
        const tokenExpire = getTokenExpire(this.options);

        if (!accessToken) {
          return true;
        }

        return isTokenExpiring(tokenExpire);
      default:
        return false;
    }
  }

  private getUrl(endpoint: string): string {
    const protocol = this.config.domain.match(/^local\.?host(:\d{2,5})?$/)
      ? "http"
      : "https";

    return `${protocol}://${this.config.domain}/${API_VERSION}/${endpoint}`;
  }

  getHeaders(): any {
    const accessToken = getAccessToken(this.options);
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    return headers;
  }

  private async get(endpoint: string, params?: any) {
    const url = this.getUrl(endpoint);
    const query = new URLSearchParams(params);
    return fetch(`${url}${!query ? "" : "?" + query}`, {
      ...this.getHeaders(),
    });
  }

  private async post(endpoint: string, payload: any) {
    const data = new URLSearchParams(payload);

    return fetch(this.getUrl(endpoint), {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }
}
