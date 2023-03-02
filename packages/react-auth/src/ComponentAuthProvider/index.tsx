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
  getToken,
  hasAuthParams,
  processValidateResponse,
  saveSessionData,
  setCookie,
  removeCookie,
  startTokenWatch,
  DEFAULT_COOKIE_OPTIONS,
} from "@src/shared/session";
import {
  APIResponse,
  AuthConfig,
  AuthUser,
  CallbackParams,
  CookieOptions,
  SessionData,
} from "@src/types";

export interface ComponentAuthContextType {
  authenticated: boolean;
  loading: boolean;
  error: APIResponse | undefined;
  user?: AuthUser;
  cbParams?: CallbackParams;
  client: AuthNClient;
  logout: () => void;
  setFlowComplete: (data: any) => void;
}

export interface ComponentAuthProviderProps {
  config: AuthConfig;
  useCookie?: boolean;
  cookieOptions?: CookieOptions;
  children: ReactNode;
}

const AuthContext = createContext<ComponentAuthContextType>(
  {} as ComponentAuthContextType
);

export const ComponentAuthProvider: FC<ComponentAuthProviderProps> = ({
  config,
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

  const combinedCookieOptions: CookieOptions = {
    ...DEFAULT_COOKIE_OPTIONS,
    ...cookieOptions,
  };

  // load data from local storage, and params from URL
  useEffect(() => {
    const storageAPI = getStorageAPI(useCookie);
    const token = useCookie
      ? getToken(combinedCookieOptions.cookieName as string)
      : getToken(combinedCookieOptions.cookieName as string, storageAPI);

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
  }, []);

  const validate = async (token: string) => {
    const { success, response } = await client.validate(token);

    if (success) {
      const sessionData: SessionData = processValidateResponse(
        response,
        token,
        useCookie
      );
      setUser(sessionData.user);
      setAuthenticated(true);

      const timerId = startTokenWatch(refresh, useCookie);
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

  const refresh = async (useCookie: boolean) => {
    const storageAPI = getStorageAPI(useCookie);
    const sessionData = getSessionData(storageAPI);
    const activeToken = sessionData.user?.active_token?.token || "";
    const refreshToken = sessionData.user?.refresh_token?.token || "";
    const { success, response } = await client.refresh(
      activeToken,
      refreshToken
    );

    if (success) {
      const user: AuthUser = getUserFromResponse(response);
      sessionData.user = user;
      saveSessionData(storageAPI, sessionData);
    } else {
      setLoggedOut();
    }
  };

  const setLoggedOut = () => {
    if (useCookie) {
      removeCookie(
        combinedCookieOptions.cookieName as string,
        combinedCookieOptions
      );
    }

    setError(undefined);
    setUser(undefined);
    setAuthenticated(false);
  };

  const setFlowComplete = useCallback((response: APIResponse) => {
    const user: AuthUser = getUserFromResponse(response);
    const storageAPI = getStorageAPI(useCookie);
    const sessionData = getSessionData(storageAPI);
    sessionData.user = user;
    saveSessionData(storageAPI, sessionData);

    if (useCookie) {
      setCookie(
        combinedCookieOptions.cookieName as string,
        response.result?.active_token?.token,
        combinedCookieOptions
      );
    }

    setError(undefined);
    setUser(user);
    setAuthenticated(true);

    const timerId = startTokenWatch(refresh, useCookie);
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
