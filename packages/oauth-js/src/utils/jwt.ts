import * as jose from "jose";

import { JWKS_EXPIRE, JWKS_CACHE_KEY } from "../constants";
import { AuthUser, Claims, Intelligence, Profile } from "../types";
import { diffInSeconds } from "./helpers";

export interface VerifyResponse {
  user?: AuthUser;
  error?: string;
}

const fetchJWKS = async (baseUrl: string) => {
  const url = `${baseUrl}/jwks.json`;
  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    if (data?.keys && data.keys.length > 0) {
      return { keys: data.keys };
    } else {
      console.warn("Error: empty JWKS response");
    }
  }
};

const checkKeys = (jwksJSON: any) => {
  if (jwksJSON?.expire) {
    const cacheExpires = new Date(jwksJSON?.expire);
    const timeDiff = diffInSeconds(new Date(), cacheExpires);

    return timeDiff < JWKS_EXPIRE;
  }

  return false;
};

const getJWKS = async (baseUrl: string): Promise<jose.JSONWebKeySet> => {
  const jwksData = localStorage.getItem(JWKS_CACHE_KEY);
  const jwksJSON = JSON.parse(jwksData || "{}");

  if (jwksData && checkKeys(jwksJSON)) {
    return jwksJSON.keySet;
  } else {
    const keySet = await fetchJWKS(baseUrl);
    if (keySet) {
      const cacheData = { expire: Date.now(), keySet: keySet };
      localStorage.setItem(JWKS_CACHE_KEY, JSON.stringify(cacheData));
      return keySet;
    }

    return { keys: [] };
  }
};

export const verifyJwt = async (
  token: string,
  baseUrl: string
): Promise<VerifyResponse> => {
  const result: VerifyResponse = {};

  try {
    const jwks = await getJWKS(baseUrl);

    if (jwks?.keys?.length > 0) {
      const keySet = jose.createLocalJWKSet(jwks);

      const { payload, protectedHeader } = await jose.jwtVerify(token, keySet);

      const profile: Profile = payload["pangea.profile"] as Profile;
      const intel: Intelligence = payload[
        "pangea.intelligence"
      ] as Intelligence;
      const claims: Claims = payload["pangea.claims"] as Claims;
      const user: AuthUser = {
        username: payload.username as string,
        email: payload.email as string,
        profile: {
          ...profile,
        },
        intelligence: {
          ...intel,
        },
        claims: {
          ...claims,
        },
        payload,
        header: protectedHeader,
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
};
