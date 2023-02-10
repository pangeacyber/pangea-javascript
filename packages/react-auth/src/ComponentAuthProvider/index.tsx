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
import { getUserFromResponse } from "@src/shared/session";
import { APIResponse, AuthNConfig, AuthUser, SessionData } from "@src/types";

export interface ComponentAuthContextType {
  authenticated: boolean;
  loading: boolean;
  error: APIResponse | undefined;
  user?: AuthUser;
  login: () => void;
  logout: () => void;
  config: AuthNConfig;
  setFlowComplete: (data: any) => void;
}

export interface ComponentAuthProps {
  config: AuthNConfig;
  children: ReactNode;
}

const SESSION_NAME = "pangea-session";

const AuthContext = createContext<ComponentAuthContextType>(
  {} as ComponentAuthContextType
);

const ComponentAuthProvider: FC<ComponentAuthProps> = ({
  config,
  children,
}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<APIResponse>();
  const [user, setUser] = useState<AuthUser>();

  const auth = new AuthNClient(config);

  // load data from local storage, and params from URL
  useEffect(() => {
    const sessionData = getSessionData();

    if (sessionData?.user?.active_token?.token) {
      validate(sessionData);
    } else {
      setLoading(false);
    }

    // eslint-disable-next-line
  }, []);

  // update session data on step
  useEffect(() => {
    const sessionData = getSessionData();
    sessionData.user = user;
    saveSessionData(sessionData);

    // eslint-disable-next-line
  }, [user]);

  const getSessionData = (): SessionData => {
    const storedData = localStorage.getItem(SESSION_NAME);

    if (storedData) {
      const session: SessionData = JSON.parse(storedData);
      return session;
    }

    return {};
  };

  const saveSessionData = (data: SessionData) => {
    const dataString = JSON.stringify(data);
    localStorage.setItem(SESSION_NAME, dataString);
  };

  const validate = async (data: SessionData) => {
    const userToken = data.user?.active_token?.token || "";
    const { success, response } = await auth.validate(userToken);

    if (success) {
      setUser(data.user);
      setAuthenticated(true);
    } else {
      setError(response);
    }
    setLoading(false);
  };

  const login = useCallback(async () => {
    // TODO: show AuthFlow
  }, []);

  const logout = useCallback(async () => {
    const { success, response } = await auth.logout(user?.active_token?.token);
    if (success) {
      setError(undefined);
      setUser(undefined);
      setAuthenticated(false);
    } else {
      setError(response);
    }

    // eslint-disable-next-line
  }, [user]);

  const setFlowComplete = useCallback((response: APIResponse) => {
    const user: AuthUser = getUserFromResponse(response);

    setError(undefined);
    setUser(user);
    setAuthenticated(true);
  }, []);

  const memoData = useMemo(
    () => ({
      authenticated,
      loading,
      error,
      user,
      login,
      logout,
      config,
      setFlowComplete,
    }),
    [
      authenticated,
      loading,
      error,
      user,
      login,
      logout,
      config,
      setFlowComplete,
    ]
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

export default ComponentAuthProvider;
