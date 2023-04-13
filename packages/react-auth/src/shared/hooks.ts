import { useCallback, useEffect, useRef } from "react";
import * as jose from "jose";

import { AuthNClient } from "@src/AuthNClient";
import {
  getAllTokens,
  getSessionData,
  getTokenExpire,
  getUserFromResponse,
  isTokenExpiring,
  saveSessionData,
  setTokenCookies,
} from "@src/shared/session";

import { AuthUser } from "@src/types";

import { AuthOptions, VerifyResponse } from "./types";

export const REFRESH_CHECK_INTERVAL = 15; // Frequency of refresh check in seconds
export const REFRESH_CHECK_THRESHOLD = 10;

export const useValidateToken = (
  client: AuthNClient,
  options: AuthOptions,
  validateCallback: (result: VerifyResponse) => void
) => {
  const jwks = useRef<jose.JSONWebKeySet>();

  const getJWKS = useCallback(async () => {
    const { success, response } = await client.jwks();

    if (success) {
      if (response.result?.keys && response.result.keys.length > 0) {
        jwks.current = { keys: response.result.keys };
      } else {
        console.log("Error: empty JWKS response");
      }
    }
  }, []);

  const verifyJwt = useCallback(
    async (token: string): Promise<VerifyResponse> => {
      const result: VerifyResponse = {};

      try {
        if (!jwks.current) {
          await getJWKS();
        }

        if (jwks.current) {
          const sessionData = getSessionData(options);
          const keySet = jose.createLocalJWKSet(jwks.current);

          const { payload, protectedHeader } = await jose.jwtVerify(
            token,
            keySet
          );
          console.log("header", protectedHeader);
          console.log("payload", payload);

          if (sessionData.user) {
            sessionData.user.payload = payload;
            sessionData.user.protectedHeader = protectedHeader;
          }

          result.user = sessionData.user;
        } else {
          result.error = "Missing JSON Web Key Set";
        }
      } catch (error) {
        console.log("Error:", error);
        result.error = "JWT validation failed";
      }

      return result;
    },
    []
  );

  const verifyToken = useCallback(
    async (token: string): Promise<VerifyResponse> => {
      const { success, response } = await client.validate(token);
      const result: VerifyResponse = {};

      if (success) {
        result.user = getUserFromResponse(response);
      } else {
        result.error = response?.result?.summary || "Token verification error";
      }

      return result;
    },
    []
  );

  const validate = useCallback(
    async (token: string): Promise<AuthUser | undefined> => {
      const result = options?.useJwt
        ? await verifyJwt(token)
        : await verifyToken(token);

      validateCallback(result);

      return result?.user;
    },
    []
  );

  return validate;
};

export const useRefresh = (
  client: AuthNClient,
  options: AuthOptions,
  refreshCallback: (result: VerifyResponse) => void,
  loadingCallback: (loading: boolean) => void
) => {
  const intervalId = useRef<number | null>(null);

  useEffect(() => {
    // event handler to start/stop refresh checker
    document.addEventListener("visibilitychange", checkVisibility);

    return () => {
      document.removeEventListener("visibilitychange", checkVisibility);
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, []);

  const checkVisibility = useCallback(() => {
    if (document.hidden) {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    } else {
      loadingCallback(true);
      checkTokenLife();
      loadingCallback(false);
      startTokenWatch();
    }
  }, []);

  const checkTokenLife = useCallback(() => {
    const tokenExpire = getTokenExpire(options);
    if (tokenExpire && isTokenExpiring(tokenExpire)) {
      refresh();
    }
  }, []);

  const stopTokenWatch = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  const startTokenWatch = useCallback(() => {
    const intervalTime = REFRESH_CHECK_INTERVAL * 1000;

    stopTokenWatch();

    intervalId.current = window.setInterval(() => {
      checkTokenLife();
    }, intervalTime);
  }, []);

  const refresh = useCallback(async () => {
    const { sessionToken, refreshToken } = getAllTokens(options);

    const { success, response } = await client.refresh(
      sessionToken,
      refreshToken
    );

    if (success) {
      const sessionData = getSessionData(options);
      const user: AuthUser = getUserFromResponse(response);
      sessionData.user = user;
      saveSessionData(sessionData, options);

      if (options.useCookie) {
        setTokenCookies(user, options);
      }

      refreshCallback({ user });
    } else {
      refreshCallback({ error: "Refresh failed" });
    }
  }, []);

  return { refresh, startTokenWatch, stopTokenWatch };
};
