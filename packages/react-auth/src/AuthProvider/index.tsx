"use client";

import {
  FC,
  type JSX,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AuthNClient,
  APIResponse,
  ClientConfig,
} from "@pangeacyber/vanilla-js";

import { toUrlEncoded, generateBase58 } from "../shared/utils";
import {
  getStorageAPI,
  getSessionData,
  getSessionToken,
  getSessionTokenValues,
  getUserFromResponse,
  hasAuthParams,
  saveSessionData,
  setTokenCookies,
  removeTokenCookies,
  isTokenExpiring,
  getTokenFromCookie,
  SESSION_DATA_KEY,
  DEFAULT_COOKIE_OPTIONS,
} from "~/src/shared/session";

import {
  AuthConfig,
  AuthOptions,
  AuthUser,
  AppState,
  CookieOptions,
  SessionData,
  VerifyResponse,
} from "~/src/types";

import { useValidateToken, useRefresh } from "../shared/hooks";

/** AuthProvider component props */
export interface AuthProviderProps {
  /** The URL for the AuthN hosted page */
  loginUrl: string;

  /** The client config for the AuthN API. See AuthConfig in types.ts the full definition. */
  config: AuthConfig;

  /**
   * An optional callback to invoke afer a user has successfully logged in.
   * @param {AppState} appState The current authentication state
   */
  onLogin?: (appState: AppState) => void;

  /**
   * The options used when setting a cookie for auth
   * Defaults to `{ useCookie: false }`
   */
  cookieOptions?: CookieOptions;

  /**
   * When passed in, AuthProvider will use this value as redirect URI when going through the login/logout flow
   *
   * @defaultValue `window.location.origin`
   * @example "https://my.domain.com"
   */
  redirectUri?: string;

  /**
   * When passed in, AuthProvider will append this pathname to the redirect URI when going through the login/logout flow
   * @example "/docs/""
   */
  redirectPathname?: string;

  /**
   * When set to true users will be redirected to the hosted page on logout.
   *
   * @defaultValue false
   */
  redirectOnLogout?: boolean;

  /**
   * When set to true, AuthProvider will validate the state value on login to ensure
   * that it matches the stored value. This ensures that the authentication flow did
   * not start outside your application.
   *
   * @defaultValue true
   */
  useStrictStateCheck?: boolean;

  /**
   * When set to true, an email addresses or social provider name can be passed as a url parameter.
   * The hosted login page will then attempt to use the provided value as the primary auth method.
   *
   * @defaultValue false
   */
  passAuthMethod?: boolean;

  children: JSX.Element;
}

export interface AuthContextType {
  /** Indicates if the provider is loading */
  loading: boolean;

  /** Indicates if the session is authenticated */
  authenticated: boolean;

  /** Set to the last error message, if any */
  error: string;

  /** The user data object */
  user: AuthUser | undefined;

  /** The client object used to make API calls */
  client: AuthNClient;

  /** A method to start the login flow */
  login: () => void;

  /** A method to log out a session */
  logout: () => void;

  /** Returns the active token */
  getToken: () => string | undefined;

  /** Refresh the current active token and update user data */
  refresh: (authenticated?: boolean | undefined) => Promise<void>;
}

const STATE_DATA_KEY = "state";
const LAST_PATH_KEY = "last-path";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/**
 * Wrapping your application in `AuthProvider` configures the SDK and state for the application nested inside
 */
export const AuthProvider: FC<AuthProviderProps> = ({
  loginUrl,
  config,
  onLogin,
  cookieOptions = { useCookie: false },
  redirectUri,
  redirectPathname,
  redirectOnLogout = false,
  useStrictStateCheck = true,
  passAuthMethod = false,
  children,
}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  /**
   * Track initialization state, to handle react 18 strict dev mode, running mount effects twice
   * https://legacy.reactjs.org/docs/strict-mode.html#ensuring-reusable-state
   */
  const initState = useRef("unmounted");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<AuthUser>();

  const client = useMemo(() => {
    const clientConfig: ClientConfig = {
      domain: config.domain,
      clientToken: config.clientToken,
      callbackUri: config.callbackUri,
      usePathApi: config.usePathApi,
    };
    return new AuthNClient(clientConfig);
  }, [config]);

  /** For local development, use port 4000 for API and 4001 for hosted UI */
  const slashRe = /\/$/;
  const loginURL = `${loginUrl.replace(slashRe, "")}/authorize`;
  const logoutURL = `${loginUrl.replace(slashRe, "")}/logout`;

  const options: AuthOptions = {
    useJwt: config.useJwt,
    sessionKey: config.sessionKey || SESSION_DATA_KEY,
    ...DEFAULT_COOKIE_OPTIONS,
    ...cookieOptions,
  };

  const validateCallback = useCallback((result: VerifyResponse) => {
    if (result.user) {
      const sessionData = getSessionData(options);

      setAuthenticated(true);
      setUser(result.user);

      if (onLogin) {
        const appState = {
          userData: sessionData.user,
          returnPath: window.location.pathname,
        };
        onLogin(appState);
      }
    } else {
      setError(result.error || "Validation failed.");
    }

    setLoading(false);
  }, []);

  const refreshCallback = useCallback((result: VerifyResponse) => {
    if (result.user) {
      setUser(result.user);
      setAuthenticated(true);
    } else {
      logout();
    }
    setLoading(false);
  }, []);

  const loadingCallback = useCallback((state: boolean) => {
    setLoading(state);
  }, []);

  const validate = useValidateToken(client, options, validateCallback);
  const { refresh, startTokenWatch, stopTokenWatch } = useRefresh(
    client,
    options,
    refreshCallback,
    loadingCallback
  );

  const forceRefresh = async (authenticated: boolean | undefined) => {
    // Allow application to force a token refresh
    // Give application ability to mark authentication state, no effect if undefined
    // Used if application receives 401 errors before auto-refresh occurs, and needs
    // to mark authenticated as false to prevent all calls failing with 401
    if (authenticated !== undefined) {
      setAuthenticated(authenticated);
    }
    return refresh().catch((_e) => {
      logout();
    });
  };

  useEffect(() => {
    const [token, expire] = getSessionTokenValues(options);

    if (hasAuthParams()) {
      initState.current = "exchange";
      // if code and secret params are set, exchange code for a token
      exchange();
    } else if (token) {
      // if token is expiring or expired, try refreshing
      if (expire && isTokenExpiring(expire)) {
        initState.current = "refresh";
        refresh();
      } else {
        initState.current = "restore";
        const data: SessionData = getSessionData(options);
        if (!!data.user) {
          // if token has not expired, validate that it's still good
          // Leave loading as true to allow user to still wait for a validated token
          setAuthenticated(true);
          setUser(data.user);
        }

        validate(token);
      }

      startTokenWatch();
    } else if (initState.current === "unmounted") {
      // show unauthenticated state
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, []);

  const exchange = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const storageAPI = getStorageAPI(options.useCookie);
    const savedState = storageAPI.getItem(STATE_DATA_KEY);

    const state = urlParams.get("state");
    const code = urlParams.get("code");

    // remove state and code params from the URL
    urlParams.delete("state");
    urlParams.delete("code");
    const newSearch = urlParams.toString();
    const newPath = newSearch
      ? `${window.location.pathname}?${newSearch}`
      : window.location.pathname;
    history.pushState({}, document.title, newPath);

    if (!state || !code) {
      const msg = "Missing required parameters";
      setError(msg);
      setLoading(false);
    } else if (state !== savedState && useStrictStateCheck) {
      const msg = "Invalid session state";
      setError(msg);
      setLoading(false);
    } else {
      const { success, response } = await client.userinfo(code);

      if (success) {
        const token = response.result?.active_token?.token;

        if (token) {
          // if using an opaque token or has a valid JWT
          if (!config?.useJwt || (config?.useJwt && (await validate(token)))) {
            processLogin(response);
          }
        } else {
          const msg = "Missing Token";
          setError(msg);
        }
      } else {
        setError(response.summary);
      }
      storageAPI.removeItem(STATE_DATA_KEY);
      setLoading(false);
    }
  };

  const login = () => {
    const location = window.location;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const stateCode = generateBase58(32);
    const storageAPI = getStorageAPI(options.useCookie);
    storageAPI.setItem(STATE_DATA_KEY, stateCode);
    storageAPI.setItem(LAST_PATH_KEY, `${location.pathname}${location.search}`);

    let localRedirectUri = redirectUri || location.origin;
    if (typeof redirectPathname === "string") {
      localRedirectUri += redirectPathname;
    }

    const query = new URLSearchParams("");
    query.append("redirect_uri", localRedirectUri);
    query.append("state", stateCode);

    // pass email/social param to login page
    if (passAuthMethod) {
      if (urlParams.has("email")) {
        const emailIn = urlParams.get("email") || "";
        if (
          emailIn.length < 255 &&
          emailIn.match(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm)
        ) {
          query.append("email", emailIn);
        }
      } else if (urlParams.has("social")) {
        const socialIn = urlParams.get("social") || "";
        if (socialIn.length < 32 && socialIn.match(/^[a-z_]*$/)) {
          query.append("social", socialIn);
        }
      }
    }

    // pass `pm` (product marketing) param
    if (urlParams.has("pm")) {
      const pmParam = urlParams.get("pm") || "";
      query.append("pm", pmParam);
    }

    const queryParams = query.toString();
    const redirectTo = loginURL;
    const url = queryParams ? `${redirectTo}?${queryParams}` : redirectTo;

    window.location.replace(url);
  };

  const logout = useCallback(async () => {
    const stateCode = generateBase58(32);

    // redirect to the hosted page
    if (redirectOnLogout) {
      let localRedirectUri = redirectUri || location.origin;

      if (typeof redirectPathname === "string") {
        localRedirectUri += redirectPathname;
      }

      const query = {
        localRedirectUri,
        state: stateCode,
      };

      const url = `${logoutURL}?${toUrlEncoded(query)}`;

      setLoggedOut();
      window.location.replace(url);
    }
    // call the logout endpoint
    else {
      const userToken = getSessionToken(options);

      if (userToken) {
        const { success, response } = await client.logout(userToken);

        if (success) {
          setLoggedOut();
        } else if (
          response?.status === "ExpiredToken" ||
          response?.status === "InvalidToken"
        ) {
          setLoggedOut();
        } else {
          setError(response.summary);
        }
      } else {
        setLoggedOut();
      }
    }
  }, []);

  const getToken = useCallback((): string | undefined => {
    return getSessionToken(options);
  }, []);

  const setLoggedOut = () => {
    if (options.useCookie) {
      removeTokenCookies(options);
    }

    stopTokenWatch();

    const storageAPI = getStorageAPI(options.useCookie);
    storageAPI.removeItem(SESSION_DATA_KEY);

    setError("");
    setUser(undefined);
    setAuthenticated(false);
  };

  const processLogin = (response: APIResponse) => {
    const user: AuthUser = getUserFromResponse(response);
    const sessionData = getSessionData(options);
    sessionData.user = user;
    saveSessionData(sessionData, options);

    const storageAPI = getStorageAPI(options.useCookie);
    const returnURL = storageAPI.getItem(LAST_PATH_KEY) || "/";

    const appState = {
      userData: user,
      returnPath: returnURL,
      authState: storageAPI.getItem(STATE_DATA_KEY),
    };

    storageAPI.removeItem(LAST_PATH_KEY);

    if (options.useCookie) {
      setTokenCookies(user, options);
    }

    setError("");
    setUser(user);
    setAuthenticated(true);

    startTokenWatch();

    if (onLogin) {
      onLogin(appState);
    }
  };

  const memoData = useMemo(
    () => ({
      authenticated,
      loading,
      error,
      user,
      client,
      login,
      logout,
      getToken,
      refresh: forceRefresh,
    }),
    [authenticated, loading, error, user, client, login, logout, getToken]
  );

  return (
    <AuthContext.Provider value={memoData}>
      <>{children}</>
    </AuthContext.Provider>
  );
};

/**
 * Use the `useAuth` hook in your components to access authentication state.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Convenience method, and for backwards compatibility. Returns the active token.
 * @returns string
 */
export { getTokenFromCookie };
