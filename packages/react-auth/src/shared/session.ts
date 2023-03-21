import {
  APIResponse,
  AuthUser,
  CookieOptions,
  ProviderOptions,
  SessionData,
} from "@src/types";
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
  cookieMaxAge: 60 * 60 * 24 * 2, // 48 Hours, in seconds
  cookieName: TOKEN_COOKIE_NAME,
  refreshCookieName: REFRESH_COOKIE_NAME,
};

const BASE_COOKIE_FLAGS = "; path=/";

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;

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

export const saveSessionData = (
  data: SessionData,
  options: ProviderOptions
) => {
  const storageAPI = getStorageAPI(options.useCookie);
  const dataString = JSON.stringify(data);
  storageAPI.setItem(options.sessionKey, dataString);
};

export const getSessionData = (options: ProviderOptions): SessionData => {
  const storageAPI = getStorageAPI(options.useCookie);
  const data = storageAPI.getItem(options.sessionKey);
  const sessionJSON = data ? JSON.parse(data) : {};

  return sessionJSON;
};

export const getSessionToken = (options: ProviderOptions) => {
  if (options.useCookie) {
    return getTokenFromCookie(options.cookieName as string);
  }

  const data = getSessionData(options);
  return data?.user?.active_token?.token;
};

export const getRefreshToken = (options: ProviderOptions) => {
  if (options.useCookie) {
    return getTokenFromCookie(options.refreshCookieName as string);
  }

  const data = getSessionData(options);
  return data?.user?.refresh_token?.token;
};

/*
  Backwards compatibility support for fetching the token by name
*/
export const getTokenFromCookie = (name: string, raw = false): string => {
  const cookies = getCookies();
  const cookie = cookies[name];

  // return the full value if `raw` is true
  if (raw) {
    return cookie;
  }

  // token cookie should contain the value and expiration timestamp separated by a comma
  if (cookie) {
    const parts = cookie.split(",");
    return parts[0];
  } else {
    return "";
  }
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
  const email = activeToken.email;
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

/*
  Token refresh functions
*/

// Get the expire value of the session token, from cookie or storage
export const getTokenExpire = (options: ProviderOptions) => {
  if (options.useCookie) {
    const fullTokenData = getTokenFromCookie(
      options.cookieName as string,
      true
    );

    // return empty string if no cookie was found
    if (!fullTokenData) return "";
    const parts = fullTokenData.split(",");
    return parts.length > 1 ? parts[1] : "";
  } else {
    const sessionData: SessionData = getSessionData(options);
    const user: AuthUser | undefined = sessionData.user;
    return user?.refresh_token?.expire;
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
  options: ProviderOptions
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

export const setCookie = (
  key: string,
  value = "",
  options: ProviderOptions
) => {
  const { cookieMaxAge } = options;

  let cookie = `${key}=${value}${BASE_COOKIE_FLAGS}; max-age=${cookieMaxAge}`;

  cookie = maybeAddSecureFlag(cookie, options);

  document.cookie = cookie;
};

export const removeCookie = (key: string, options: ProviderOptions) => {
  const epoch = new Date(0);

  let cookie = `${key}=${BASE_COOKIE_FLAGS}; expires=${epoch.toUTCString()}; max-age=0`;

  cookie = maybeAddSecureFlag(cookie, options);

  document.cookie = cookie;
};

export const setTokenCookies = (
  userData: AuthUser,
  options: ProviderOptions
) => {
  const userToken: string = userData.active_token.token;
  const refreshToken: string = userData.refresh_token.token;
  const userExpire: string = userData.active_token.expire;
  const refreshExpire: string = userData.refresh_token.expire;

  const userCookieValue = `${userToken},${userExpire}`;
  const refreshCookieValue = `${refreshToken},${refreshExpire}`;

  setCookie(options.cookieName as string, userCookieValue, options);
  setCookie(options.refreshCookieName as string, refreshCookieValue, options);
};

export const removeTokenCookies = (options: ProviderOptions) => {
  removeCookie(options.cookieName as string, options);
  removeCookie(options.refreshCookieName as string, options);
};
