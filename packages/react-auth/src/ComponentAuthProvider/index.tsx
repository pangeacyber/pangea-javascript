import {
  FC,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";

import AuthNClient from "@src/AuthNClient";
import {
  getStorageAPI,
  getSessionData,
  getUserFromResponse,
  getSessionToken,
  getRefreshToken,
  hasAuthParams,
  saveSessionData,
  setTokenCookies,
  removeTokenCookies,
  startTokenWatch,
  DEFAULT_COOKIE_OPTIONS,
  SESSION_DATA_KEY,
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
  const [timer, setTimer] = useState<number>();

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
    const storageAPI = getStorageAPI(useCookie);
    const token = getSessionToken(options);

    // save callback params if set
    if (hasAuthParams()) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const state = urlParams.get("state") || "";
      const code = urlParams.get("code") || "";

      setCbParams({ state, code });
    }

    if (token) {
      validate(token);
    } else {
      setLoading(false);
    }

    // clear the timer on unmount, if it's set
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const validate = async (token: string) => {
    const refreshToken = getRefreshToken(options);

    const { success, response } = refreshToken
      ? await client.refresh(token, refreshToken)
      : await client.validate(token);

    if (success) {
      const user: AuthUser = getUserFromResponse(response);
      const sessionData = getSessionData(options);
      sessionData.user = user;

      saveSessionData(sessionData, options);
      setUser(sessionData.user);
      setAuthenticated(true);

      if (useCookie) {
        setTokenCookies(user, options);
      }

      const timerId = startTokenWatch(refresh, options);
      if (timerId) {
        setTimer(timerId);
      }
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
    const userToken = user?.active_token.token;

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

  const refresh = async (useCookie: boolean) => {
    const sessionData = getSessionData(options);
    const activeToken = sessionData.user?.active_token?.token || "";
    const refreshToken = sessionData.user?.refresh_token?.token || "";
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
    } else {
      setLoggedOut();
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

    const timerId = startTokenWatch(refresh, options);
    if (timerId) {
      setTimer(timerId);
    }
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
