import { Signer } from "utils/signer";

/**
 * PangeaConfig options
 */
export interface ConfigOptions {
  domain?: string;
  environment?: ConfigEnv;
  requestRetries?: number;
  requestTimeout?: number;
  queuedRetryEnabled?: boolean;
  aqueuedRetries?: number;
}

export enum ConfigEnv {
  "local" = "local",
  "production" = "production",
}

/**
 * Secure Audit interface definitions
 */
export namespace Audit {
  export interface LogOptions {
    verbose?: boolean;
    signMode?: SignOptions;
    signer?: Signer;
    skipEventVerification?: boolean;
    verify?: boolean;
  }

  export interface LogData {
    event: Audit.Event;
    verbose?: boolean;
    signature?: string;
    public_key?: string;
    prev_root?: string;
  }

  export enum SignOptions {
    Unsign,
    Local,
  }

  export interface Event {
    message: Object | string;
    actor?: string;
    action?: string;
    new?: Object | string;
    old?: Object | string;
    status?: string;
    target?: string;
    source?: string;
    timestamp?: Date | string;
  }

  export interface EventEnvelope {
    event: Event;
    signature?: string;
    public_key?: string;
    received_at: string;
  }

  export interface AuditRecord {
    envelope: Audit.EventEnvelope;
    hash: string;
    membership_proof?: string;
    published?: boolean;
    leaf_index?: string;
    consistency_verification?: string;
    membership_verification?: string;
    signature_verification?: string;
  }

  export interface Root {
    url?: string;
    published_at?: string;
    size: number;
    root_hash: string;
    consistency_proof: string[];
    tree_name: string;
  }

  export interface LogResponse {
    hash: string;
    envelope: Audit.EventEnvelope;
    unpublished_root?: string;
    membership_proof?: string;
    consistency_proof?: string[];
    consistency_verification?: string;
    membership_verification?: string;
    signature_verification?: string;
  }

  export interface SearchOptions {
    verifyConsistency?: boolean;
    skipEventVerification?: boolean;
  }

  export interface SearchResponse {
    id: string;
    expires_at: string;
    count: number;
    events: Audit.AuditRecord[];
    root?: Root;
    unpublished_root?: Root;
  }

  export interface SearchRestriction {
    actor?: Array<string>;
    action?: Array<string>;
    source?: Array<string>;
    status?: Array<string>;
    target?: Array<string>;
  }

  export interface SearchParamsOptions {
    limit?: number;
    max_results?: number;
    start?: string;
    end?: string;
    order?: string;
    order_by?: string;
    search_restriction?: Audit.SearchRestriction;
    verbose?: boolean;
  }

  export interface SearchParams extends SearchParamsOptions {
    query: string;
  }

  export interface RootParams {
    tree_size?: number;
  }

  export interface ResultResponse {
    events: AuditRecord[];
    count: number;
    root?: Root;
  }

  export interface RootRequest {
    tree_size?: number;
  }

  export interface RootResponse extends Root {
    data: Root;
  }
}

export namespace Redact {
  export interface BaseResponse {
    redacted_text: string;
    count: number;
  }

  export interface StructuredResponse {
    redacted_data: object;
    count: number;
  }

  export interface Options {
    debug?: boolean;
    rules?: string[];
  }

  export interface TextOptions extends Options {}
  export interface StructuredOptions extends Options {
    jsonp?: string[];
    format?: string;
  }

  export interface TextParams extends TextOptions {
    text: string;
  }

  export interface StructuredParams extends StructuredOptions {
    data: Object;
  }
}

export namespace Embargo {
  export interface Sanction {
    list_name: string;
    embargoed_country_name: string;
    embargoed_country_iso_code: string;
    issuing_country: string;
    annotations: object;
  }

  export interface CheckResponse {
    sanctions: Sanction[];
  }
}

/**
 * Intel services interface definitions
 */
export namespace Intel {
  export interface Options {
    verbose?: boolean;
    raw?: boolean;
    provider?: string;
  }

  export interface Response {
    data: {
      category: string[];
      score: number;
      verdict: string;
    };
  }

  export interface ReputationResult extends Response {}

  export namespace File {
    export interface Options extends Intel.Options {}
    export interface Params {
      hash: string;
      hash_type: string;
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationResult extends Intel.ReputationResult {}
    export interface ReputationParams extends Params, ReputationOptions {}
  }

  export namespace Domain {
    export interface Options extends Intel.Options {}
    export interface Params {
      domain: string;
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationResult extends Intel.ReputationResult {}
    export interface ReputationParams extends Params, ReputationOptions {}
  }

  export namespace URL {
    export interface Options extends Intel.Options {}
    export interface Params {
      url: string;
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationResult extends Intel.ReputationResult {}
    export interface ReputationParams extends Params, ReputationOptions {}
  }

  export namespace IP {
    export interface Options extends Intel.Options {}
    export interface Params {
      ip: string;
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationResult extends Intel.ReputationResult {}
    export interface ReputationParams extends Params, ReputationOptions {}
  }

  export interface FileParams extends Intel.Options {
    hash: string;
    hash_type: string;
  }

  export interface IPParams extends Intel.Options {
    ip: string;
  }

  export interface URLParams extends Intel.Options {
    url: string;
  }

  export interface DomainParams extends Intel.Options {
    domain: string;
  }
}

export namespace AuthN {
  export interface PasswordUpdateRequest {
    email: string;
    old_secret: string;
    new_secret: string;
  }

  export enum IDProvider {
    FACEBOOK = "facebook",
    GITHUB = "github",
    GOOGLE = "google",
    MICROSOFT_ONLINE = "microsoftonline",
    PASSWORD = "password",
  }

  export type Scopes = string[];
  export interface Profile {
    [key: string]: any;
  }

  export enum MFAProvider {
    TOTP = "totp",
    EMAIL_OTP = "email_otp",
    SMS_OTP = "sms_otp",
  }

  export enum FlowType {
    SIGNIN = "signin",
    SIGNUP = "signup",
  }

  export interface UserCreateRequest {
    email: string;
    authenticator: string;
    id_provider?: IDProvider;
    verified?: boolean;
    require_mfa?: boolean;
    profile?: Profile;
    scopes?: Scopes;
  }

  export interface UserCreateResult {
    identity: string;
    email: string;
    profile: Profile;
    id_provider: string;
    require_mfa: boolean;
    verified: boolean;
    last_login_at: string;
    disable?: boolean;
    mfa_provider?: MFAProvider[];
  }

  export interface UserDeleteRequest {
    email: string;
  }

  export interface UserInviteRequest {
    inviter: string;
    email: string;
    callback: string;
    state: string;
    invite_org?: string;
    require_mfa?: boolean;
  }

  export interface UserInvite {
    id: string;
    inviter: string;
    invite_org: string;
    email: string;
    callback: string;
    state: string;
    require_mfa: boolean;
    created_at: string;
    expire: string;
  }

  export interface UserInviteListResult {
    invites: UserInvite[];
  }

  export interface UserInviteDeleteRequest {
    id: string;
  }

  export interface UserListRequest {
    scopes: Scopes;
    glob_scopes: Scopes;
  }

  export interface User {
    profile: Profile;
    identity: string;
    email: string;
    scopes: Scopes;
  }

  export interface UserListResult {
    users: User[];
  }

  export interface UserLoginRequest {
    email: string;
    secret: string;
    scopes?: Scopes;
  }

  export interface UserLoginResult {
    id: string;
    token: string;
    type: string;
    life: number;
    expire: string;
    identity: string;
    email: string;
    created_at: string;
    scopes?: Scopes;
    profile: Profile;
  }

  export interface UserProfileGetRequest {
    identity?: string;
    email?: string;
  }

  export interface UserProfile {
    identity: string;
    email: string;
    profile: Profile;
    id_provider: string;
    mfa_providers: MFAProvider[];
    require_mfa: boolean;
    verified: boolean;
    last_login_at: string;
    disable?: boolean;
  }

  export interface UserProfileUpdateRequest {
    profile: Profile;
    identity?: string;
    email?: string | null;
    require_mfa?: boolean | null;
    mfa_value?: string;
    mfa_provider?: MFAProvider;
  }

  export interface UserUpdateRequest {
    identity?: string | null;
    email?: string | null;
    authenticator?: string | null;
    disabled?: boolean | null;
    require_mfa?: boolean | null;
  }

  export interface UserUpdateResult {
    identity: string;
    email: string;
    profile: Profile;
    require_mfa: boolean;
    verified: boolean;
    disabled: boolean;
    last_login_at: string;
    id_provider: IDProvider;
    scopes?: Scopes;
    mfa_providers?: MFAProvider[];
  }

  export interface UserInfoResult {
    token: string;
    id: string;
    type: string;
    life: number;
    expire: string;
    identity: string;
    email: string;
    scopes: Scopes;
    profile: Profile;
    created_at: string;
  }

  export interface UserVerifyRequest {
    id_provider: IDProvider;
    email: string;
    authenticator: string;
  }

  export interface UserVerifyResult {
    identity: string;
    email: string;
    profile: Profile;
    scopes: Scopes;
    id_provider: IDProvider;
    require_mfa: boolean;
    verified: boolean;
    disabled: boolean;
    last_login_at: string;
  }
}
