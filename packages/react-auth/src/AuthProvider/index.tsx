import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AuthNClient from "@src/AuthNClient";
import { toUrlEncoded, generateBase58 } from "../shared/utils";
import {
  getStorageAPI,
  getSessionData,
  getUserFromResponse,
  getToken,
  setCookie,
  removeCookie,
  SESSION_DATA_KEY,
  DEFAULT_COOKIE_OPTIONS,
} from "@src/shared/session";
import { AuthUser, AppState, AuthNConfig, CookieOptions } from "../types";

export interface AuthContextType {
  loading: boolean;
  authenticated: boolean;
  error: string;
  user: AuthUser | undefined;
  client: AuthNClient;
  login: () => void;
  logout: (redirect?: boolean) => void;
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
   *  token: string
   * }
   *
   * The client config for the authn API
   */
  config: AuthNConfig;

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

  /**
   * useStrictStateCheck: optional boolean
   *
   * When set to true AuthProvider will only accept state values generated by your application.
   *
   * Not allowing authentication flows starting from outside your application.
   *
   * Default is false
   */
  useStrictStateCheck?: boolean;

  children: ReactNode;
}

// const SESSION_DATA_KEY = "pangea-authn";
const STATE_DATA_KEY = "state";
const LAST_PATH_KEY = "last-path";

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;

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

  const client = useMemo(() => {
    return new AuthNClient(config);
  }, [config]);

  // For local development, use port 4000 for API and 4001 for hosted UI
  const slashRe = /\/$/;
  const loginURL = `${loginUrl.replace(slashRe, "")}/authorize`;
  const signupURL = `${loginUrl.replace(slashRe, "")}/signup`;
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

  const validate = async (token: string) => {
    const { success, response } = await client.validate(token);

    if (success) {
      const userData = getUserFromResponse(response);
      setUser(userData);
      setAuthenticated(true);
    } else {
      setError(response.summary);
    }

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
  };

  const exchange = async () => {
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
      const { success, response } = await client.userinfo(code);

      if (success) {
        if (response.result?.active_token?.token) {
          processLogin(response.result);
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

  const logout = async (redirect: boolean = true) => {
    const stateCode = generateBase58(32);

    if (useCookie) {
      removeCookie(
        combinedCookieOptions.cookieName as string,
        combinedCookieOptions
      );
    }

    const storageAPI = getStorageAPI(useCookie);
    storageAPI.removeItem(SESSION_DATA_KEY);

    // redirect to the hosted page
    if (redirect) {
      let redirectUri = location.origin;

      if (typeof redirectPathname === "string") {
        redirectUri += redirectPathname;
      }

      const query = {
        redirectUri,
        state: stateCode,
      };
      const url = `${logoutURL}?${toUrlEncoded(query)}`;

      setAuthenticated(false);
      window.location.replace(url);
    }
    // call the logout endpoint
    else {
      const userToken = user?.active_token.token;

      if (userToken) {
        const { success, response } = await client.logout(userToken);

        if (success) {
          setLoggedOut();
        } else {
          setError(response.summary);
        }
      } else {
        setLoggedOut();
      }
    }
  };

  const setLoggedOut = () => {
    setError("");
    setUser(undefined);
    setAuthenticated(false);
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
        data.active_token?.token,
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
      client,
      login,
      logout,
    }),
    [authenticated, loading, error, user, client, login, logout]
  );

  return (
    <AuthContext.Provider value={memoData}>
      <>{children}</>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// export getToken for convienence and backwards compat
export { getToken };
