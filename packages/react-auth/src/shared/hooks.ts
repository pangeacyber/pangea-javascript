import { useCallback, useEffect, useRef } from "react";
import * as jose from "jose";

import { AuthNClient } from "@pangeacyber/vanilla-js";
import {
  getAllTokens,
  getSessionData,
  getTokenExpire,
  getUserFromResponse,
  isTokenExpiring,
  removeTokenCookies,
  saveSessionData,
  setTokenCookies,
} from "~/src/shared/session";
import { diffInSeconds } from "~/src/shared/utils";
import { AuthOptions, AuthUser, Profile, VerifyResponse } from "~/src/types";

export const REFRESH_CHECK_INTERVAL = 15; // Frequency of refresh check in seconds
export const REFRESH_CHECK_THRESHOLD = 10;
export const JWKS_CACHE_KEY = "jwks-cache";
export const JWKS_EXPIRE = 60 * 60 * 24; // 24 hours in seconds

export const useValidateToken = (
  client: AuthNClient,
  options: AuthOptions,
  validateCallback: (result: VerifyResponse) => void
) => {
  const fetchJWKS = useCallback(async () => {
    const { success, response } = await client.jwks();

    if (success) {
      if (response.result?.keys && response.result.keys.length > 0) {
        return { keys: response.result.keys };
      } else {
        console.warn("Error: empty JWKS response");
      }
    }
  }, []);

  const checkKeys = useCallback((jwksJSON: any) => {
    if (jwksJSON?.expire) {
      const cacheExpires = new Date(jwksJSON?.expire);
      const timeDiff = diffInSeconds(new Date(), cacheExpires);

      return timeDiff < JWKS_EXPIRE;
    }

    return false;
  }, []);

  const getJWKS = useCallback(async (): Promise<jose.JSONWebKeySet> => {
    const jwksData = localStorage.getItem(JWKS_CACHE_KEY);
    const jwksJSON = JSON.parse(jwksData || "{}");

    if (jwksData && checkKeys(jwksJSON)) {
      return jwksJSON.keySet;
    } else {
      const keySet = await fetchJWKS();
      if (keySet) {
        const cacheData = { expire: Date.now(), keySet: keySet };
        localStorage.setItem(JWKS_CACHE_KEY, JSON.stringify(cacheData));
        return keySet;
      }

      return { keys: [] };
    }
  }, []);

  const verifyJwt = useCallback(
    async (token: string): Promise<VerifyResponse> => {
      const result: VerifyResponse = {};

      try {
        const jwks = await getJWKS();

        if (jwks?.keys?.length > 0) {
          const keySet = jose.createLocalJWKSet(jwks);

          const { payload, protectedHeader } = await jose.jwtVerify(
            token,
            keySet
          );

          const profile: Profile = payload.profile as Profile;
          const user: AuthUser = {
            username: payload.username as string,
            email: payload.email as string,
            profile: {
              ...profile,
            },
            header: protectedHeader,
            payload: payload,
          };

          result.user = user;
        } else {
          result.error = "Missing JSON Web Key Set";
        }
      } catch (error) {
        console.warn("Error:", error);
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
        removeTokenCookies(options);
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

      if (result.user) {
        const data = getSessionData(options);

        // add tokens to user data
        if (data) {
          result.user.active_token = data.user?.active_token;
          result.user.refresh_token = data.user?.refresh_token;
        }
      }

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
    // event handlers to start/stop refresh checker
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);

      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, []);

  const onBlur = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  const onFocus = useCallback(() => {
    loadingCallback(true);
    checkTokenLife();
    loadingCallback(false);
    startTokenWatch();
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
      const data = getSessionData(options);
      const user: AuthUser = getUserFromResponse(response);
      data.user = user;
      saveSessionData(data, options);

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
