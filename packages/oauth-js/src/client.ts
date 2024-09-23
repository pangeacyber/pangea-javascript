import Lock from "./vendor/browser-tabs-lock";
import { AuthOptions, ClientConfig, CookieOptions } from "./types";
import { generateBase58, hasAuthParams } from "./utils/helpers";
import { buildAuthorizeUrl } from "./utils/urls";
import {
  DEFAULT_COOKIE_OPTIONS,
  getRefreshToken,
  getSessionData,
  getSessionToken,
  getSessionTokenValues,
  getStorageAPI,
  getTokenExpire,
  isTokenExpiring,
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
import { createPkceChallenge } from "./utils";

export type AuthState =
  | "INIT"
  | "UPDATING"
  | "AUTHENTICATED"
  | "NOAUTH"
  | "ERROR";

export class OAuthClient {
  config: ClientConfig;
  options: AuthOptions;
  authState: AuthState; // current state of authentication
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

    this.config = {
      ...config,
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

    const tokenExpire = getTokenExpire(this.options);

    if (hasAuthParams()) {
      await this.exchange();
    } else if (!!tokenExpire) {
      // has a token and token will expire soon, do refresh
      if (isTokenExpiring(tokenExpire)) {
        try {
          await this.refresh();
          this.startTokenWatch();
        } catch {}
      } else {
        // has a validate token
        // TODO: call introspect to validate for opaque tokens
        this.authState = "AUTHENTICATED";
      }
    } else {
      this.authState = "NOAUTH";
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

    const port = ["80", "443"].includes(window.location.port)
      ? ""
      : `:${window.location.port}`;

    const url = buildAuthorizeUrl(this.config.domain, {
      clientId: this.config.clientId,
      redirectUri:
        this.config.callbackUri ||
        `${window.location.protocol}//${window.location.hostname}${port}`,
      state: stateCode,
      challenge: challenge,
      challengeMethod: "S256",
      responseType: "code_challenge",
    });

    window.location.assign(url);
  }

  async logout() {
    const response = await this.post("token/revoke", {
      token: getRefreshToken(this.options),
      token_type_hint: "refresh_token",
    });

    if (response.ok) {
      this.authState = "INIT";
    } else {
      this.authState = "ERROR";
    }
    removeTokenCookies(this.options);
    this.storage.removeItem(STATE_DATA_KEY);
  }

  async refresh() {
    const initialState = this.authState;
    const lock = new Lock();

    try {
      this.authState = "UPDATING";

      if (await lock.acquireLock(REFRESH_LOCK_KEY)) {
        const refreshToken = getRefreshToken(this.options);
        const response = await this.post("token", {
          client_id: this.config.clientId,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
          redirect_uri: this.config.callbackUri || window.location.hostname,
          scope: "", // TODO: include requested scopes
        });

        this.processResponse(response);
      } else {
        console.warn("Could not aquire refresh lock.");
      }
    } catch (error: any) {
      console.log(error);
      if (initialState !== "INIT") {
        // refresh expected to fail in initial state
      } else {
        this.authState = "ERROR";
      }
    } finally {
      await lock.releaseLock(REFRESH_LOCK_KEY);
    }
  }

  async introspect() {
    const token = getSessionToken(this.options);
    const response = await this.post("token/introspect", {
      client_id: this.config.clientId,
      token_type_hint: "access_token",
      token,
    });

    return await response.json();
  }

  async getToken() {
    if (this.shouldTokenRefresh()) {
      try {
        await this.refresh();
      } catch (err) {}
    }

    const accessToken = getSessionToken(this.options);

    if (!accessToken) {
      // throw error
      this.authState = "ERROR";
    }

    return accessToken;
  }

  private checkTokenLife() {
    const tokenExpire = getTokenExpire(this.options);

    if (tokenExpire && isTokenExpiring(tokenExpire)) {
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

  private processResponse(data: any) {
    // TODO: fix data type
    console.log("RESPONSE", data);

    const user: any = {}; // getUserFromResponse(response); // TODO: fix user data
    const sessionData = getSessionData(this.options);
    sessionData.user = user;
    saveSessionData(sessionData, this.options);

    const storageAPI = getStorageAPI(this.options.useCookie);
    const returnURL = storageAPI.getItem(LAST_PATH_KEY) || "/";

    const appState = {
      userData: user,
      returnPath: returnURL,
      authState: storageAPI.getItem(STATE_DATA_KEY),
    };

    storageAPI.removeItem(LAST_PATH_KEY);

    if (this.options.useCookie) {
      setTokenCookies(user, this.options);
    }

    this.startTokenWatch();

    if (this.config.onLogin) {
      this.config.onLogin(appState);
    }
  }

  private async exchange() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const savedState = this.storage.getItem(STATE_DATA_KEY);
    const codeVerifier = this.storage.getItem(VERIFIER_DATA_KEY);

    const state = urlParams.get("state");
    const code = urlParams.get("code");

    this.authState = "UPDATING";

    if (!state || !code) {
      const msg = "Missing required parameters";
      this.authState = "ERROR";
    } else if (state !== savedState || savedState === "") {
      const msg = "Invalid session state";
      this.authState = "ERROR";
    } else {
      try {
        const response = await this.post("token", {
          client_id: this.config.clientId,
          grant_type: "authorization_code",
          code_verifier: codeVerifier,
          code,
        });

        if (response.ok) {
          this.authState = "AUTHENTICATED";
          this.startTokenWatch();
          this.processResponse(response);
        }
      } catch (err) {
        this.authState = "ERROR";
      }
    }
  }

  private shouldTokenRefresh() {
    switch (this.authState) {
      case "INIT":
      case "UPDATING":
        return true;
      case "ERROR":
        return false;
      case "AUTHENTICATED":
        const [token, expireTime] = getSessionTokenValues(this.options);

        if (!token) {
          return true;
        }

        return isTokenExpiring(expireTime);
    }
  }

  getUrl(endpoint: string): string {
    const protocol = this.config.domain.match(/^local\.?host(:\d{2,5})?$/)
      ? "http"
      : "https";

    return `${protocol}://${this.config.domain}/${API_VERSION}/${endpoint}`;
  }

  getHeaders(): any {
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    return headers;
  }

  private async post(endpoint: string, payload: any) {
    return fetch(this.getUrl(endpoint), {
      method: "POST",
      body: JSON.stringify(payload),
      ...this.getHeaders(),
    });
  }
}
