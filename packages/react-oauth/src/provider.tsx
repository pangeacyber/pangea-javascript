"use client";

import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { OAuthClient } from "@pangeacyber/oauth-js";
import {
  AuthState,
  AuthUser,
  ClientConfig,
  CookieOptions,
  StateData,
} from "@pangeacyber/oauth-js";

export interface AuthProviderProps {
  config: ClientConfig;
  cookieOptions?: CookieOptions;
  children: JSX.Element;
}

export interface AuthContextType {
  loading: boolean;
  authenticated: boolean;
  authState: AuthState;
  user: AuthUser | undefined;
  error: string;
  login: () => Promise<void> | undefined;
  logout: () => Promise<void> | undefined;
  refresh: (forceRefresh?: boolean) => Promise<void> | undefined;
  getToken: () => Promise<string | undefined> | undefined;
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: FC<AuthProviderProps> = ({
  config,
  cookieOptions = { useCookie: false },
  children,
}) => {
  const [client, setClient] = useState<OAuthClient>();
  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [authState, setAuthState] = useState<AuthState>("INIT");
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<AuthUser>();

  const mountedRef = useRef(false);

  const handleStateChange = useCallback(
    (data: StateData) => {
      setAuthState(data.state);
      setAuthenticated(
        data.state === "AUTHENTICATED" || data.state === "REFRESH"
      );
      setLoading(data.state === "LOADING" || data.state === "INIT");
      setUser(data.user);
      setError(data.error);

      // call state change handler defined in config
      if (config.onStateChange) {
        config.onStateChange(data);
      }
    },
    [client]
  );

  const login = useCallback(() => {
    return client?.login();
  }, [client]);

  const logout = useCallback(() => {
    return client?.logout();
  }, [client]);

  const refresh = useCallback(
    async (forceRefresh: boolean = false) => {
      return client?.refresh(forceRefresh);
    },
    [client]
  );

  const getToken = useCallback(async () => {
    return client?.getToken();
  }, [client]);

  useEffect(() => {
    if (client && client.authState === "INIT") {
      client.init();
    }
  }, [client]);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      const _config: ClientConfig = {
        ...config,
        onStateChange: handleStateChange,
      };
      const _client = new OAuthClient(_config, cookieOptions);
      setClient(_client);
    }
  }, []);

  const memoData = useMemo(
    () => ({
      authenticated,
      loading,
      authState,
      user,
      error,
      login,
      logout,
      refresh,
      getToken,
    }),
    [
      authenticated,
      loading,
      authState,
      user,
      error,
      login,
      logout,
      refresh,
      getToken,
    ]
  );

  return (
    <AuthContext.Provider value={memoData}>
      <>{children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
