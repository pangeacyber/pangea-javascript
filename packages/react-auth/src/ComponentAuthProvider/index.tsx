import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AuthNClient from "@src/AuthNClient";
import {
  hasAuthParams,
  getSessionData,
  getSessionToken,
  getTokenCookieFields,
  getTokenExpire,
  getUserFromResponse,
  isTokenExpiring,
  removeTokenCookies,
  saveSessionData,
  setTokenCookies,
  DEFAULT_COOKIE_OPTIONS,
  SESSION_DATA_KEY,
} from "@src/shared/session";

import { APIResponse, AuthConfig, AuthUser, CallbackParams } from "@src/types";

import { AuthOptions, CookieOptions, VerifyResponse } from "../shared/types";

import { useValidateToken, useRefresh } from "../shared/hooks";

export interface ComponentAuthProviderProps {
  config: AuthConfig;
  cookieOptions?: CookieOptions;
  children: JSX.Element;
}

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

const AuthContext = createContext<ComponentAuthContextType>(
  {} as ComponentAuthContextType
);

export const ComponentAuthProvider: FC<ComponentAuthProviderProps> = ({
  config,
  cookieOptions = { useCookie: false },
  children,
}) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<APIResponse>();
  const [user, setUser] = useState<AuthUser>();
  const [cbParams, setCbParams] = useState<CallbackParams>();

  const client = useMemo(() => {
    return new AuthNClient(config);
  }, [config]);

  const options: AuthOptions = {
    useJwt: config.useJwt,
    sessionKey: config.sessionKey || SESSION_DATA_KEY,
    ...DEFAULT_COOKIE_OPTIONS,
    ...cookieOptions,
  };

  const validateCallback = useCallback((result: VerifyResponse) => {
    if (result.user) {
      setAuthenticated(true);
    } else {
      setLoggedOut();
    }

    setLoading(false);
  }, []);

  const refreshCallback = useCallback((result: VerifyResponse) => {
    if (result.user) {
      setUser(result.user);
      setAuthenticated(true);
      setLoading(false);
    } else {
      logout();
    }
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

  // load data from local storage, and params from URL
  useEffect(() => {
    const [token, expire] = getTokenCookieFields(options.cookieName as string);

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

    // // event handler to start/stop refresh checker
    // document.addEventListener("visibilitychange", checkVisibility);

    // // clear the timer on unmount, if it's set
    // return () => {
    //   document.removeEventListener("visibilitychange", checkVisibility);
    //   if (intervalId.current) {
    //     clearInterval(intervalId.current);
    //     intervalId.current = null;
    //   }
    // };
  }, []);

  // const checkVisibility = () => {
  //   if (document.hidden) {
  //     if (intervalId.current) {
  //       clearInterval(intervalId.current);
  //       intervalId.current = null;
  //     }
  //   } else {
  //     setLoading(true);
  //     checkTokenLife();
  //     setLoading(false);
  //     startTokenWatch();
  //   }
  // };

  // const validate = async (token: string) => {
  //   if (config?.useJwt) {
  //     if (await validateJwt(token)) {
  //       setAuthenticated(true);
  //     } else {
  //       setLoggedOut();
  //     }
  //   } else {
  //     const { success, response } = await client.validate(token);

  //     if (success) {
  //       setAuthenticated(true);
  //     } else {
  //       if (response.status === "InvalidToken") {
  //         setLoggedOut();
  //       } else {
  //         setError(response);
  //       }
  //     }
  //   }

  //   setLoading(false);
  // };

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

  // const refresh = async () => {
  //   const { sessionToken, refreshToken } = getAllTokens(options);

  //   const { success, response } = await client.refresh(
  //     sessionToken,
  //     refreshToken
  //   );

  //   if (success) {
  //     const sessionData = getSessionData(options);
  //     const user: AuthUser = getUserFromResponse(response);
  //     sessionData.user = user;
  //     saveSessionData(sessionData, options);

  //     if (useCookie) {
  //       setTokenCookies(user, options);
  //     }

  //     setUser(user);
  //     setAuthenticated(true);
  //     setLoading(false);
  //   } else {
  //     logout();
  //   }
  // };

  const setLoggedOut = () => {
    if (options.useCookie) {
      removeTokenCookies(options);
    }

    setError(undefined);
    setUser(undefined);
    setAuthenticated(false);
  };

  // const getPublicKeys = async () => {
  //   const { success, response } = await client.jwks();

  //   if (success) {
  //     if (response.result?.keys && response.result.keys.length > 0) {
  //       JWKS.current = { keys: [...response.result.keys] };
  //     } else {
  //       console.log("Error: empty JWKS response");
  //     }
  //   } else {
  //     console.log("Error: fetch JWKS failed", response);
  //   }
  // };

  // const validateJwt = async (token: string) => {
  //   // TODO: Take claims to validate from configuration
  //   const options = {};

  //   // fetch public keys if not set
  //   if (!JWKS.current?.keys?.length) {
  //     await getPublicKeys();
  //   }

  //   try {
  //     const keySet = jose.createLocalJWKSet(JWKS.current);

  //     const { payload, protectedHeader } = await jose.jwtVerify(
  //       token,
  //       keySet,
  //       options
  //     );
  //     console.log("header", protectedHeader);
  //     console.log("payload", payload);

  //     return true;
  //   } catch (error) {
  //     console.log("ERROR", error);
  //     return false;
  //   }
  // };

  const setFlowComplete = useCallback((response: APIResponse) => {
    const user: AuthUser = getUserFromResponse(response);
    const sessionData = getSessionData(options);
    sessionData.user = user;
    saveSessionData(sessionData, options);

    if (options.useCookie) {
      setTokenCookies(user, options);
    }

    setError(undefined);
    setUser(user);
    setAuthenticated(true);

    startTokenWatch();
  }, []);

  const checkTokenLife = () => {
    const tokenExpire = getTokenExpire(options);
    if (tokenExpire && isTokenExpiring(tokenExpire)) {
      refresh();
    }
  };

  // const startTokenWatch = () => {
  //   const intervalTime = REFRESH_CHECK_INTERVAL * 1000;

  //   if (intervalId.current) {
  //     clearInterval(intervalId.current);
  //     intervalId.current = null;
  //   }

  //   intervalId.current = window.setInterval(() => {
  //     checkTokenLife();
  //   }, intervalTime);
  // };

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
