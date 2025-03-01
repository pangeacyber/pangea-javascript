export const API_VERSION = "v1beta/oauth";

export const REFRESH_LOCK_KEY = "pangea-refresh-lock";
export const STATE_DATA_KEY = "state";
export const LAST_PATH_KEY = "last-path";
export const SESSION_DATA_KEY = "pangea-session";
export const VERIFIER_DATA_KEY = "pangea-code-verifier";

export const TOKEN_COOKIE_NAME = "pangea-token";
export const REFRESH_COOKIE_NAME = "pangea-refresh";
export const EXPIRES_COOKIE_NAME = "pangea-expires";

export const REFRESH_CHECK_INTERVAL = 10; // Frequency of refresh check in seconds
export const REFRESH_CHECK_THRESHOLD = 5;

export const JWKS_CACHE_KEY = "jwks-cache";
export const JWKS_EXPIRE = 60 * 60 * 24; // 24 hours in seconds
