import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import { toUrlEncoded, generateBase58 } from "./utils";
import { AuthUser, AppState, ClientConfig } from "../types";

export interface AuthContextType {
  loading: boolean;
  authenticated: boolean;
  error: string;
  user: AuthUser | undefined;
  login: () => void;
  logout: (redirect?: boolean) => void;
}

export interface CookieOptions {
  /**
   * cookieMaxAge: optional number, default is 48 hours (in seconds)
   *
   * This sets the max-age on the cookie (in seconds). Will only be used
   * if useCookie is true.
   */
  cookieMaxAge?: number;

  /**
   * cookieName: The name to be used when setting/getting the cookie
   *
   * Defaults to "pangea-authn" if not set
   */
  cookieName?: string;

  /**
   * cookieDomain: The domain to set on the cookie
   */
  cookieDomain?: string;
}

export interface AuthProviderProps {
  /**
   * loginUrl: string
   *
   * The url for the authn hosted UI
   */
  loginUrl: string;

  /**
   * config: {
   *  domain: string
   *  clientToken: string
   * }
   *
   * The client config for the authn API
   */
  config: ClientConfig;

  /**
   * onLogin: (appState: AppState) => void
   *
   * Optional callback, called when successfully
   * logging in
   */
  onLogin?: (appState: AppState) => void;

  /**
   * useCookie: optional boolean
   *
   * Option for using a cookie to keep the auth token around.
   * Default is false.
   *
   * When useCookie is false, we will use localStorage instead of
   * storageAPI to keep the auth token around.
   */
  useCookie?: boolean;

  /**
   * cookieOptions: optional options used when setting a cookie for auth
   */
  cookieOptions?: CookieOptions;

  /**
   * redirectPathname: optional string
   *
   * When passed in, <AuthProvider /> will append this pathname to the
   * redirect URI when going through the login/logout flow
   *
   * @example
   * redirectPathname="/docs/"
   */
  redirectPathname?: string;

  children: any;

  /**
   * useStrictStateCheck: optional boolean
   *
   * When set to true AuthProvider will only accept state values generate by your application.
   *
   * Not allowing authentication flows starting from outside your application.
   *
   * Default is false
   */
  useStrictStateCheck?: boolean;
}

const SESSION_DATA_KEY = "pangea-authn";
const STATE_DATA_KEY = "state";
const LAST_PATH_KEY = "last-path";

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;

const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  cookieMaxAge: 60 * 60 * 24 * 2, // 48 Hours, in seconds
  cookieName: SESSION_DATA_KEY,
};

export const hasAuthParams = (searchParams = window.location.search): boolean =>
  CODE_RE.test(searchParams) && STATE_RE.test(searchParams);

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: FC<AuthProviderProps> = ({
  loginUrl,
  config,
  onLogin,
  useCookie = false,
  cookieOptions = {},
  redirectPathname,
  children,
  useStrictStateCheck = false,
}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<AuthUser>();

  // For local development, use port 4000 for API and 4001 for hosted UI
  const slashRe = /\/$/;
  const checkURL = `${config.domain.replace(
    slashRe,
    ""
  )}/v1/client/token/check`;
  const loginURL = `${loginUrl.replace(slashRe, "")}/authorize`;
  const signupURL = `${loginUrl.replace(slashRe, "")}/signup`;
  const infoURL = `${config.domain.replace(slashRe, "")}/v1/client/userinfo`;
  const logoutURL = `${loginUrl.replace(slashRe, "")}/logout`;

  const combinedCookieOptions: CookieOptions = {
    ...DEFAULT_COOKIE_OPTIONS,
    ...cookieOptions,
  };

  useEffect(() => {
    const storageAPI = getStorageAPI(useCookie);
    const token = useCookie
      ? getToken(combinedCookieOptions.cookieName as string)
      : getToken(combinedCookieOptions.cookieName as string, storageAPI);

    if (hasAuthParams()) {
      // if code and secret params are set, exchange code for a token
      exchange();
    } else if (token) {
      // if token exists, check if it's valid
      validate(token);
    } else {
      // show unauthenticated state
      setLoading(false);
    }
  }, []);

  const clientHeaders = () => {
    return {
      Authorization: `Bearer ${config.clientToken}`,
    };
  };

  const validate = (token: string) => {
    axios
      .post(checkURL, { token }, { headers: clientHeaders() })
      .then((resp: any) => {
        /**
         * Only set authenticated to true if we return a successful status
         *
         * It's entirely possible to get a status back: "InvalidToken"
         * when that happens we want to throw an error and stop
         * the login flow
         */
        if (resp.data.status === "Success") {
          setUser({ ...resp.data.result, token });
          setAuthenticated(true);
        } else {
          throw resp.data?.status;
        }
      })
      .catch((error: any) => {
        let msg = "Token validation error";
        setError(msg);
      })
      .finally(() => {
        if (onLogin) {
          const storageAPI = getStorageAPI(useCookie);
          const sessionData = getSessionData(storageAPI);

          const appState = {
            userData: sessionData,
            returnPath: window.location.pathname,
          };
          onLogin(appState);
        }
        setLoading(false);
      });
  };

  const exchange = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const storageAPI = getStorageAPI(useCookie);
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
      axios
        .post(infoURL, { code: code }, { headers: clientHeaders() })
        .then((resp: any) => {
          const result = resp?.data?.result;
          if (result?.active_token?.token) {
            processLogin(result);
          } else {
            const msg = "Missing Token";
            setError(msg);
          }
        })
        .catch((error: any) => {
          const data = error?.response?.data;
          const status = error?.response?.status || "Error";

          if (data) {
            const msg = `${status} ${data.status}: ${data.summary}`;
            setError(msg);
          } else {
            const msg = `${status}: ${error}`;
            setError(msg);
          }
        })
        .finally(() => {
          storageAPI.removeItem(STATE_DATA_KEY);
          setLoading(false);
        });
    }
  };

  const login = () => {
    const location = window.location;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const stateCode = generateBase58(32);
    const storageAPI = getStorageAPI(useCookie);
    storageAPI.setItem(STATE_DATA_KEY, stateCode);
    storageAPI.setItem(LAST_PATH_KEY, `${location.pathname}${location.search}`);

    let redirectUri = location.origin;
    if (typeof redirectPathname === "string") {
      redirectUri += redirectPathname;
    }

    const query = new URLSearchParams("");
    query.append("redirect_uri", redirectUri);
    query.append("state", stateCode);

    const queryParams = query.toString();
    const redirectTo = urlParams.get("signup") ? signupURL : loginURL;
    const url = queryParams ? `${redirectTo}?${queryParams}` : redirectTo;

    window.location.replace(url);
  };

  const logout = (redirect: boolean = true) => {
    const stateCode = generateBase58(32);

    let redirectUri = location.origin;
    if (typeof redirectPathname === "string") {
      redirectUri += redirectPathname;
    }

    const query = {
      redirectUri,
      state: stateCode,
    };
    const url = `${logoutURL}?${toUrlEncoded(query)}`;

    if (useCookie) {
      removeCookie(
        combinedCookieOptions.cookieName as string,
        combinedCookieOptions
      );
    }

    const storageAPI = getStorageAPI(useCookie);
    storageAPI.removeItem(SESSION_DATA_KEY);

    setAuthenticated(false);

    if (redirect) {
      window.location.replace(url);
    }
  };

  const processLogin = (data: AuthUser) => {
    const storageAPI = getStorageAPI(useCookie);
    const returnURL = storageAPI.getItem(LAST_PATH_KEY) || "/";

    const appState = {
      userData: data,
      returnPath: returnURL,
      authState: storageAPI.getItem(STATE_DATA_KEY),
    };

    storageAPI.removeItem(LAST_PATH_KEY);
    storageAPI.setItem(SESSION_DATA_KEY, JSON.stringify(data));

    if (useCookie) {
      setCookie(
        combinedCookieOptions.cookieName as string,
        data?.token,
        combinedCookieOptions
      );
    }

    setUser(data);
    setAuthenticated(true);

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
      login,
      logout,
    }),
    [authenticated, loading, error, user, login, logout]
  );

  return (
    <AuthContext.Provider value={memoData}>
      <>{children}</>
    </AuthContext.Provider>
  );
};

export const getToken = (cookieName: string, storageAPI?: Storage) => {
  if (storageAPI === undefined) {
    const cookies = getCookies();

    return cookies[cookieName];
  }

  const data = getSessionData(storageAPI);
  return data?.token;
};

export const getSessionData = (storageAPI = localStorage) => {
  const data = storageAPI.getItem(SESSION_DATA_KEY);
  const session_json = data ? JSON.parse(data) : {};

  return session_json;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

type CookieObj = {
  [key: string]: string;
};

function getCookies(): CookieObj {
  const cookies = document.cookie
    .split(";")
    .map((str) => str.trim())
    .reduce((cookieObj: CookieObj, curr) => {
      const [cookieName, cookieValue] = curr.split("=");

      if (cookieName !== "") {
        cookieObj[cookieName] = cookieValue;
      }

      return cookieObj;
    }, {});

  return cookies;
}

const BASE_COOKIE_FLAGS = "; path=/";

function setCookie(
  key: string,
  value: string = "",
  cookieOptions: CookieOptions
) {
  const { cookieMaxAge } = cookieOptions;

  let cookie = `${key}=${value}${BASE_COOKIE_FLAGS}; max-age=${cookieMaxAge}`;

  cookie = maybeAddSecureFlag(cookie, cookieOptions);

  document.cookie = cookie;
}

function removeCookie(key: string, cookieOptions: CookieOptions) {
  const epoch = new Date(0);

  let cookie = `${key}=${BASE_COOKIE_FLAGS}; expires=${epoch.toUTCString()}; max-age=0`;

  cookie = maybeAddSecureFlag(cookie, cookieOptions);

  document.cookie = cookie;
}

function maybeAddSecureFlag(
  cookie: string,
  cookieOptions: CookieOptions
): string {
  const { cookieDomain } = cookieOptions;

  // Check the location.hostname
  // if we're not at localhost, then add the Secure flag
  // and also set the domain
  if (!isLocalhost(window.location.hostname)) {
    cookie += "; Secure";

    // If we include a cookieDomain, then make sure to set it
    // on the cookie
    if (cookieDomain !== undefined) {
      cookie += `; domain=${cookieDomain}`;
    }
  }

  return cookie;
}

function getStorageAPI(isUsingCookies: boolean): Storage {
  // Depending on if we're using cookies or not, we want to use a different storage Web API
  // When we use a cookie, use session storage
  // When we do not use a cookie, use local storage <--- default
  return isUsingCookies ? window.sessionStorage : window.localStorage;
}

/**
 * isLocalhost - helper function to determine if a hostname is localhost
 * @param hostname {string}
 * @returns {boolean}
 * @example
 * isLocalhost("pangea.cloud");
 * // false
 *
 * isLocalhost("127.0.0.1");
 * // true
 */
function isLocalhost(hostname: string): boolean {
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return true;
  }

  return false;
}
