import { AuthOptions, CookieOptions, SessionData } from "../types";
import { diffInSeconds, isLocalhost } from "./helpers";

import {
  EXPIRES_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  REFRESH_CHECK_INTERVAL,
  REFRESH_CHECK_THRESHOLD,
  TOKEN_COOKIE_NAME,
} from "../constants";

interface CookieData {
  [key: string]: string;
}

export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  useCookie: false,
  cookieMaxAge: 60 * 60 * 24 * 2, // 48 Hours, in seconds
  tokenCookieName: TOKEN_COOKIE_NAME,
  refreshCookieName: REFRESH_COOKIE_NAME,
  expiresCookieName: EXPIRES_COOKIE_NAME,
};

const BASE_COOKIE_FLAGS = "; path=/";

/*
 * Cookie helper functions
 */

export const addSecureFlag = (cookie: string, options: AuthOptions): string => {
  const { cookieDomain } = options;

  // Add additional flags if no localhost
  if (!isLocalhost(window.location.hostname)) {
    cookie += "; Secure";

    // Include cookieDomain if defined
    if (cookieDomain !== undefined) {
      cookie += `; domain=${cookieDomain}`;
    }
  }

  return cookie;
};

export const getCookies = (): CookieData => {
  const cookies = document.cookie
    .split(";")
    .map((str) => str.trim())
    .reduce((cookieObj: CookieData, curr) => {
      const [name, value] = curr.split("=");

      if (name !== "") {
        cookieObj[name] = value;
      }

      return cookieObj;
    }, {});

  return cookies;
};

export const setCookie = (key: string, value = "", options: AuthOptions) => {
  const { cookieMaxAge } = options;

  let cookie = `${key}=${value}${BASE_COOKIE_FLAGS}; max-age=${cookieMaxAge}`;

  cookie = addSecureFlag(cookie, options);

  document.cookie = cookie;
};

export const removeCookie = (key: string, options: AuthOptions) => {
  const epoch = new Date(0);

  let cookie = `${key}=${BASE_COOKIE_FLAGS}; expires=${epoch.toUTCString()}; max-age=0`;

  cookie = addSecureFlag(cookie, options);

  document.cookie = cookie;
};

/**
 * Get the token from a cookie
 *
 * @param {string} name Name of the cookie to look in
 * @returns {string} The token if it is found, an empty string if it is not found
 */
export const getTokenFromCookie = (name: string): string => {
  const cookies = getCookies();
  const cookie = cookies[name];

  // token cookie should contain the value and expiration timestamp separated by a comma
  if (cookie) {
    const [token] = cookie.split(",");
    return token || "";
  } else {
    return "";
  }
};

/*
 * Session helper functions
 */

export function getStorageAPI(useSessionStorage: boolean = true): Storage {
  return useSessionStorage ? window.sessionStorage : window.localStorage;
}

export const saveSessionData = (data: SessionData, options: AuthOptions) => {
  const storageAPI = getStorageAPI(options?.useCookie);
  const dataString = JSON.stringify(data);
  storageAPI.setItem(options.sessionKey, dataString);
};

export const getSessionData = (options: AuthOptions): SessionData => {
  const storageAPI = getStorageAPI(options.useCookie);
  const data = storageAPI.getItem(options.sessionKey);
  const sessionJSON = data ? JSON.parse(data) : {};

  return sessionJSON;
};

export const getSessionToken = (options: AuthOptions) => {
  if (options.useCookie) {
    return getTokenFromCookie(options.tokenCookieName as string);
  }

  const data = getSessionData(options);
  return data?.access_token;
};

export const getRefreshToken = (options: AuthOptions) => {
  if (options.useCookie) {
    return getTokenFromCookie(options.refreshCookieName as string);
  } else {
    const data = getSessionData(options);
    return data?.refresh_token;
  }
};

export const getAllTokens = (options: AuthOptions) => {
  const sessionToken = getSessionToken(options) || "";
  const refreshToken = getRefreshToken(options) || "";

  return { sessionToken, refreshToken };
};

export const getSessionTokenValues = (options: AuthOptions) => {
  if (options.useCookie) {
    return getTokenCookieFields(options.tokenCookieName as string);
  }

  const data: any = getSessionData(options);
  return [
    data?.user?.active_token?.token || "",
    data?.user?.active_token?.expire || "",
  ];
};

export const getTokenCookieFields = (name: string) => {
  const cookies = getCookies();
  const cookie = cookies[name] || "";
  const [token, expire] = cookie.split(",");

  return [token || "", expire || ""];
};

export const getTokenExpire = (options: AuthOptions) => {
  if (options.useCookie) {
    const [_, expire] = getTokenCookieFields(options.tokenCookieName as string);
    return expire;
  } else {
    const sessionData: SessionData = getSessionData(options);
    const user: any | undefined = sessionData.user; // TODO: Fix type
    return user?.active_token?.expire || "";
  }
};

export const isTokenExpiring = (expireTime: string) => {
  const refreshExpires = new Date(expireTime);
  const timeDiff = diffInSeconds(refreshExpires, new Date());
  const threshold = REFRESH_CHECK_INTERVAL + REFRESH_CHECK_THRESHOLD;

  return timeDiff < threshold;
};

export const setTokenCookies = (data: SessionData, options: AuthOptions) => {
  const accessToken: string = data.access_token || "";
  const refreshToken: string = data.refresh_token || "";
  const expiresIn: number = data.expires_in || 0;

  setCookie(options.tokenCookieName as string, accessToken, options);
  setCookie(options.refreshCookieName as string, refreshToken, options);
  setCookie(options.expiresCookieName as string, expiresIn.toString(), options);
};

export const removeTokenCookies = (options: AuthOptions) => {
  removeCookie(options.tokenCookieName as string, options);
  removeCookie(options.refreshCookieName as string, options);
  removeCookie(options.expiresCookieName as string, options);
};
