import { APIResponse, AuthUser, SessionData } from "~/src/types";
import { AuthOptions, CookieOptions } from "~/src/shared/types";
import { isLocalhost, diffInSeconds } from "./utils";

type CookieObj = {
  [key: string]: string;
};

export const REFRESH_CHECK_INTERVAL = 15; // Frequency of refresh check in seconds
export const REFRESH_CHECK_THRESHOLD = 10;

export const SESSION_DATA_KEY = "pangea-session";
export const TOKEN_COOKIE_NAME = "pangea-token";
export const REFRESH_COOKIE_NAME = "pangea-refresh";

export const DEFAULT_COOKIE_OPTIONS: CookieOptions = {
  useCookie: false,
  cookieMaxAge: 60 * 60 * 24 * 2, // 48 Hours, in seconds
  cookieName: TOKEN_COOKIE_NAME,
  refreshCookieName: REFRESH_COOKIE_NAME,
};

const BASE_COOKIE_FLAGS = "; path=/";

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;

/**
 * Check if the given search parameters have a state or code parameter
 *
 * @param searchParams A string representation of query or search params
 * @returns boolean
 */
export const hasAuthParams = (searchParams = window.location.search): boolean =>
  CODE_RE.test(searchParams) && STATE_RE.test(searchParams);

/*
  Session storage functions
*/

export function getStorageAPI(isUsingCookies: boolean): Storage {
  // Depending on if we're using cookies or not, we want to use a different storage Web API
  // When we use a cookie, use session storage
  // When we do not use a cookie, use local storage <--- default
  return isUsingCookies ? window.sessionStorage : window.localStorage;
}

export const saveSessionData = (data: SessionData, options: AuthOptions) => {
  const storageAPI = getStorageAPI(options.useCookie);
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
    return getTokenFromCookie(options.cookieName as string);
  }

  const data = getSessionData(options);
  return data?.user?.active_token?.token;
};

export const getRefreshToken = (options: AuthOptions) => {
  if (options.useCookie) {
    return getTokenFromCookie(options.refreshCookieName as string);
  } else {
    const data = getSessionData(options);
    return data?.user?.refresh_token?.token;
  }
};

export const getAllTokens = (options: AuthOptions) => {
  const sessionToken = getSessionToken(options) || "";
  const refreshToken = getRefreshToken(options) || "";

  return { sessionToken, refreshToken };
};

export const getSessionTokenValues = (options: AuthOptions) => {
  if (options.useCookie) {
    return getTokenCookieFields(options.cookieName as string);
  }

  const data: SessionData = getSessionData(options);
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

/*
  Support for fetching a token by name
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
  Token refresh functions
*/

// Get the expire value of the user session token, from cookie or storage
// Check the user token expiration as we need to be able to refresh it
export const getTokenExpire = (options: AuthOptions) => {
  if (options.useCookie) {
    const [_, expire] = getTokenCookieFields(options.cookieName as string);
    return expire;
  } else {
    const sessionData: SessionData = getSessionData(options);
    const user: AuthUser | undefined = sessionData.user;
    return user?.active_token?.expire || "";
  }
};

export const isTokenExpiring = (expireTime: string) => {
  const refreshExpires = new Date(expireTime);
  const timeDiff = diffInSeconds(refreshExpires, new Date());
  const threshold = REFRESH_CHECK_INTERVAL + REFRESH_CHECK_THRESHOLD;

  return timeDiff < threshold;
};

/*
  Cookie functions
*/

export const maybeAddSecureFlag = (
  cookie: string,
  options: AuthOptions
): string => {
  const { cookieDomain } = options;

  // Check the location.hostname
  // if we're not at localhost, then add the Secure flag
  // and also set the domain
  if (!isLocalhost(window.location.hostname)) {
    cookie += "; Secure";

    // If we include a cookieDomain, then make sure to set it
    // on the cookie
    if (cookieDomain !== undefined) {
      cookie += `; domain=${cookieDomain}`;
    }
  }

  return cookie;
};

export const getCookies = (): CookieObj => {
  const cookies = document.cookie
    .split(";")
    .map((str) => str.trim())
    .reduce((cookieObj: CookieObj, curr) => {
      const [cookieName, cookieValue] = curr.split("=");

      if (cookieName !== "") {
        cookieObj[cookieName] = cookieValue;
      }

      return cookieObj;
    }, {});

  return cookies;
};

export const setCookie = (key: string, value = "", options: AuthOptions) => {
  const { cookieMaxAge } = options;

  let cookie = `${key}=${value}${BASE_COOKIE_FLAGS}; max-age=${cookieMaxAge}`;

  cookie = maybeAddSecureFlag(cookie, options);

  document.cookie = cookie;
};

export const removeCookie = (key: string, options: AuthOptions) => {
  const epoch = new Date(0);

  let cookie = `${key}=${BASE_COOKIE_FLAGS}; expires=${epoch.toUTCString()}; max-age=0`;

  cookie = maybeAddSecureFlag(cookie, options);

  document.cookie = cookie;
};

export const setTokenCookies = (userData: AuthUser, options: AuthOptions) => {
  const userToken: string = userData.active_token?.token || "";
  const refreshToken: string = userData.refresh_token?.token || "";
  const userExpire: string = userData.active_token?.expire || "";
  const refreshExpire: string = userData.refresh_token?.expire || "";

  const userCookieValue = `${userToken},${userExpire}`;
  const refreshCookieValue = `${refreshToken},${refreshExpire}`;

  setCookie(options.cookieName as string, userCookieValue, options);
  setCookie(options.refreshCookieName as string, refreshCookieValue, options);
};

export const removeTokenCookies = (options: AuthOptions) => {
  removeCookie(options.cookieName as string, options);
  removeCookie(options.refreshCookieName as string, options);
};

export const getUserFromResponse = (data: APIResponse): AuthUser => {
  // The token/check endpoint returns a different format thean userinfo and flow/complete
  // Data only includes the active_token information in response.result
  // TODO: need a fix for this for cookie sessions and refresh token support
  const activeToken = data.result?.active_token?.token
    ? { ...data.result.active_token }
    : { ...data.result };
  const refreshToken = data.result?.refresh_token?.token
    ? { ...data.result.refresh_token }
    : {};
  const email = activeToken.email as string;
  const profile = { ...activeToken.profile };

  // remove deplicate user data from tokens
  delete activeToken.email;
  delete activeToken.profile;
  delete refreshToken.email;
  delete refreshToken.profile;

  const user: AuthUser = {
    email: email,
    profile: profile,
    active_token: activeToken,
    refresh_token: refreshToken,
  };

  return user;
};
