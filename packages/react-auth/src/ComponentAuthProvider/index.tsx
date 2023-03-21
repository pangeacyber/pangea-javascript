import {
  FC,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AuthNClient from "@src/AuthNClient";
import {
  getSessionData,
  getUserFromResponse,
  getSessionToken,
  getTokenExpire,
  getRefreshToken,
  hasAuthParams,
  saveSessionData,
  setTokenCookies,
  removeTokenCookies,
  isTokenExpiring,
  DEFAULT_COOKIE_OPTIONS,
  SESSION_DATA_KEY,
  REFRESH_CHECK_INTERVAL,
} from "@src/shared/session";
import {
  APIResponse,
  AuthConfig,
  AuthOptions,
  AuthUser,
  CallbackParams,
  CookieOptions,
  ProviderOptions,
} from "@src/types";

export interface ComponentAuthContextType {
  authenticated: boolean;
  loading: boolean;
  error: APIResponse | undefined;
  user?: AuthUser;
  cbParams?: CallbackParams;
  client: AuthNClient;
  logout: () => void;
  getToken: () => string | undefined;
  setFlowComplete: (data: any) => void;
}

export interface ComponentAuthProviderProps {
  config: AuthConfig;
  authOptions?: AuthOptions;
  useCookie?: boolean;
  cookieOptions?: CookieOptions;
  children: ReactNode;
}

const AuthContext = createContext<ComponentAuthContextType>(
  {} as ComponentAuthContextType
);

export const ComponentAuthProvider: FC<ComponentAuthProviderProps> = ({
  config,
  authOptions = {},
  useCookie = false,
  cookieOptions = {},
  children,
}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<APIResponse>();
  const [user, setUser] = useState<AuthUser>();
  const [cbParams, setCbParams] = useState<CallbackParams>();
  const intervalId = useRef<number | null>(null);

  const client = useMemo(() => {
    return new AuthNClient(config);
  }, [config]);

  const options: ProviderOptions = {
    useCookie,
    sessionKey: SESSION_DATA_KEY,
    ...DEFAULT_COOKIE_OPTIONS,
    ...authOptions,
    ...cookieOptions,
  };

  // load data from local storage, and params from URL
  useEffect(() => {
    // TODO: Combine into one function call
    const token = getSessionToken(options);
    const expire = getTokenExpire(options);

    // save callback params if set
    if (hasAuthParams()) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const state = urlParams.get("state") || "";
      const code = urlParams.get("code") || "";

      setCbParams({ state, code });
    }

    if (token) {
      // if token is expiring or expired, try refreshing
      if (expire && isTokenExpiring(expire)) {
        refresh();
      } else {
        // if token has not expired, validate that it's still good
        validate(token);
      }

      startTokenWatch();
    } else {
      setLoading(false);
    }

    // event handler to start/stop refresh checker
    document.addEventListener("visibilitychange", checkVisibility);

    // clear the timer on unmount, if it's set
    return () => {
      document.removeEventListener("visibilitychange", checkVisibility);
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, []);

  const checkVisibility = () => {
    if (document.hidden) {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    } else {
      startTokenWatch();
    }
  };

  const validate = async (token: string) => {
    const { success, response } = await client.validate(token);

    if (success) {
      const sessionData = getSessionData(options);

      setAuthenticated(true);
    } else {
      if (response.status === "InvalidToken") {
        setLoggedOut();
      } else {
        setError(response);
      }
    }
    setLoading(false);
  };

  const logout = useCallback(async () => {
    const userToken = getSessionToken(options);

    if (userToken) {
      const { success, response } = await client.logout(userToken);

      if (success) {
        setLoggedOut();
      } else {
        setError(response);
      }
    } else {
      setLoggedOut();
    }
    // eslint-disable-next-line
  }, [user]);

  const getToken = useCallback((): string | undefined => {
    return getSessionToken(options);
  }, []);

  const refresh = async () => {
    const sessionData = getSessionData(options);
    const activeToken = getSessionToken(options) || "";
    const refreshToken = getRefreshToken(options) || "";

    const { success, response } = await client.refresh(
      activeToken,
      refreshToken
    );

    if (success) {
      const user: AuthUser = getUserFromResponse(response);
      sessionData.user = user;
      saveSessionData(sessionData, options);
      setUser(user);

      if (useCookie) {
        setTokenCookies(user, options);
      }

      setAuthenticated(true);
      setLoading(false);
    } else {
      logout();
    }
  };

  const setLoggedOut = () => {
    if (useCookie) {
      removeTokenCookies(options);
    }

    setError(undefined);
    setUser(undefined);
    setAuthenticated(false);
  };

  const checkTokenLife = () => {
    const tokenExpire = getTokenExpire(options);
    if (tokenExpire && isTokenExpiring(tokenExpire)) {
      refresh();
    }
  };

  const startTokenWatch = () => {
    const intervalTime = REFRESH_CHECK_INTERVAL * 1000;

    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }

    intervalId.current = window.setInterval(() => {
      checkTokenLife();
    }, intervalTime);
  };

  const setFlowComplete = useCallback((response: APIResponse) => {
    const user: AuthUser = getUserFromResponse(response);
    const sessionData = getSessionData(options);
    sessionData.user = user;
    saveSessionData(sessionData, options);

    if (useCookie) {
      setTokenCookies(user, options);
    }

    setError(undefined);
    setUser(user);
    setAuthenticated(true);

    startTokenWatch();
  }, []);

  const memoData = useMemo(
    () => ({
      authenticated,
      loading,
      error,
      user,
      cbParams,
      client,
      logout,
      getToken,
      setFlowComplete,
    }),
    [
      authenticated,
      loading,
      error,
      user,
      cbParams,
      client,
      logout,
      getToken,
      setFlowComplete,
    ]
  );

  return (
    <AuthContext.Provider value={memoData}>
      <>{children}</>
    </AuthContext.Provider>
  );
};

export const useComponentAuth = () => {
  return useContext(AuthContext);
};
