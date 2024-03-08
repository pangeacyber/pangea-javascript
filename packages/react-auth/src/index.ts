export { AuthProvider, useAuth, getTokenFromCookie } from "./AuthProvider";
export {
  ComponentAuthProvider,
  useComponentAuth,
} from "./ComponentAuthProvider";

export { AuthNClient } from "./AuthNClient";

export {
  AuthFlowProvider,
  AuthNFlowClient,
  type AuthNFlowOptions,
  type FlowStorage,
  type FlowStep,
  type FlowState,
  type FlowStart,
  type FlowSignupPassword,
  type FlowVerifyPassword,
  type FlowVerifyCallback,
  type FlowVerifyCaptcha,
  type FlowMfaStart,
  type FlowMfaComplete,
  useAuthFlow,
} from "./AuthNFlow";

export { hasAuthParams } from "./shared/session";
export { encode58, toUrlEncoded } from "./shared/utils";

export type {
  APIResponse,
  AppState,
  AuthConfig,
  AuthUser,
  CallbackParams,
  ClientResponse,
  Profile,
  Token,
} from "~/src/types";

export type { CookieOptions } from "~/src/shared/types";
