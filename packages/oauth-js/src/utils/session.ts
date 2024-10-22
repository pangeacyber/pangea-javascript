import { AuthOptions, CookieOptions, SessionData } from "../types";
import { isLocalhost } from "./helpers";

import {
  EXPIRES_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
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
export const getCookieValue = (name: string): string => {
  const cookies = getCookies();
  const cookie = cookies[name];

  return cookie || "";
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

export const removeSessionData = (options: AuthOptions): void => {
  const storageAPI = getStorageAPI(options.useCookie);
  storageAPI.removeItem(options.sessionKey);
};

export const getAccessToken = (options: AuthOptions) => {
  if (options.useCookie) {
    return getCookieValue(options.tokenCookieName as string);
  }

  const data = getSessionData(options);
  return data?.access_token;
};

export const getRefreshToken = (options: AuthOptions) => {
  if (options.useCookie) {
    return getCookieValue(options.refreshCookieName as string);
  } else {
    const data = getSessionData(options);
    return data?.refresh_token;
  }
};

export const getTokenExpire = (options: AuthOptions) => {
  if (options.useCookie) {
    return getCookieValue(options.expiresCookieName as string);
  } else {
    const sessionData: SessionData = getSessionData(options);
    return sessionData?.expires_at || "";
  }
};

export const setTokenCookies = (data: SessionData, options: AuthOptions) => {
  const accessToken: string = data.access_token || "";
  const refreshToken: string = data.refresh_token || "";
  const expiresAt: string = data.expires_at || "";

  setCookie(options.tokenCookieName as string, accessToken, options);
  setCookie(options.refreshCookieName as string, refreshToken, options);
  setCookie(options.expiresCookieName as string, expiresAt, options);
};

export const removeTokenCookies = (options: AuthOptions) => {
  removeCookie(options.tokenCookieName as string, options);
  removeCookie(options.refreshCookieName as string, options);
  removeCookie(options.expiresCookieName as string, options);
};
