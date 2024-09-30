import { REFRESH_CHECK_INTERVAL, REFRESH_CHECK_THRESHOLD } from "../constants";

const CODE_RE = /[?&]code=[^&]+/;
const STATE_RE = /[?&]state=[^&]+/;

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const generateBase58 = (length: number) => {
  let result = "";
  const setLength = BASE58_ALPHABET.length;
  for (let i = 0; i < length; i++) {
    result += BASE58_ALPHABET.charAt(Math.floor(Math.random() * setLength));
  }

  return result;
};

/**
 * Check if the given search parameters have a state or code parameter
 *
 * @param searchParams A string representation of query or search params
 * @returns boolean
 */
export const hasAuthParams = (searchParams = window.location.search): boolean =>
  CODE_RE.test(searchParams) && STATE_RE.test(searchParams);

export const isLocalhost = (hostname: string): boolean => {
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return true;
  }

  return false;
};

export const diffInSeconds = (dt1: Date, dt2: Date) => {
  const diff = (dt1.getTime() - dt2.getTime()) / 1000;
  return Math.round(diff);
};

export const isTokenExpiring = (expireTime: string) => {
  const expiresAt = new Date(expireTime);
  const timeDiff = diffInSeconds(expiresAt, new Date());
  const threshold = REFRESH_CHECK_INTERVAL + REFRESH_CHECK_THRESHOLD;

  return timeDiff < threshold;
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isJwt = (token: string) => {
  // is a better check needed?
  return token.length > 36;
};
