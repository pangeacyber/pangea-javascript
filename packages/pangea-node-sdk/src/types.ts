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
  LOCAL = "local",
  PRODUCTION = "production",
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

  export interface User {
    profile: Profile;
    identity: string;
    email: string;
    scopes: Scopes;
  }

  export interface UserListResult {
    users: User[];
  }

  export interface UserProfileUpdateRequest {
    profile: Profile;
    identity?: string;
    email?: string | null;
    require_mfa?: boolean | null;
    mfa_value?: string;
    mfa_provider?: MFAProvider;
  }

  export interface PasswordRequirements {
    password_chars_min: number;
    password_chars_max: number;
    password_lower_min: number;
    password_upper_min: number;
    password_punct_min: number;
  }

  export enum TokenType {
    USER = "user",
    SERVICE = "service",
    CLIENT = "client",
    SESSION = "session",
  }

  export interface Token {
    id: string;
    type: TokenType;
    life: number;
    expire: string;
    identity: string;
    email: string;
    scopes: Scopes;
    profile: Profile;
    created_at: string;
  }

  export interface SessionInfoCreds {
    refresh_token: Token;
    active_token?: Token;
  }

  export namespace Flow {
    export enum Step {
      START = "start",
      VERIFY_CAPTCHA = "verify/captcha",
      SIGNUP = "signup",
      VERIFY_EMAIL = "verify/email",
      VERIFY_PASSWORD = "verify/password",
      VERIFY_SOCIAL = "verify/social",
      ENROLL_MFA_START = "enroll/mfa/start",
      ENROLL_MFA_COMPLETE = "enroll/mfa/complete",
      VERIFY_MFA_START = "verify/mfa/start",
      VERIFY_MFA_COMPLETE = "verify/mfa/complete",
      COMPLETE = "complete",
    }

    export interface Response {
      flow_id: string;
      next_step: Step;
      error?: string;
      complete?: object;
      enroll_mfa_start?: {
        mfa_providers: MFAProvider[];
      };
      enroll_mfa_complete?: {
        totp_secret?: {
          qr_image: string;
          secret: string;
        };
      };
      signup?: {
        social_signup?: {
          redirect_uri: object;
        };
        password_signup?: PasswordRequirements;
      };
      verify_captcha?: {
        site_key: string;
      };
      verify_email?: object;
      verify_mfa_start?: {
        mfa_providers: MFAProvider[];
      };
      verify_mfa_complete?: object;
      verify_password?: PasswordRequirements;
      verify_social?: {
        redirect_uri: object;
      };
    }

    export namespace Enroll {
      export namespace MFA {
        export namespace Start {
          export interface Request extends RequiredParams, OptionalParams {}

          export interface RequiredParams {
            flow_id: string;
            mfa_provider: MFAProvider;
          }

          export interface OptionalParams {
            phone?: string;
          }
        }

        export namespace Complete {
          export interface Request extends RequiredParams, OptionalParams {}

          export interface RequiredParams {
            flow_id: string;
            code: string;
          }

          export interface OptionalParams {
            cancel?: boolean;
          }
        }
      }
    }

    export namespace Verify {
      export namespace Captcha {
        export interface Request {
          flow_id: string;
          code: string;
        }
      }

      export namespace Email {
        export interface Request {
          flow_id: string;
          cb_state: string;
          cb_code: string;
        }
      }

      export namespace Password {
        export interface Request {
          flow_id: string;
          password: string;
        }
      }

      export namespace Social {
        export interface Request {
          flow_id: string;
          cb_state: string;
          cb_code: string;
        }
      }

      export namespace MFA {
        export namespace Start {
          export interface Request {
            flow_id: string;
            mfa_provider: MFAProvider;
          }
        }

        export namespace Complete {
          export interface Request extends RequiredParams, OptionalParams {}

          export interface RequiredParams {
            flow_id: string;
            code: string;
          }

          export interface OptionalParams {
            cancel?: boolean;
          }
        }
      }
    }

    export namespace Complete {
      export interface Response {
        refresh_token: Token;
        active_token?: Token;
      }
    }

    export namespace Start {
      export interface Request extends OptionalParams {
        cb_uri: string;
      }

      export interface OptionalParams {
        email?: string;
        flow_types?: FlowType[];
      }
    }

    export namespace Signup {
      export namespace Password {
        export interface Request {
          flow_id: string;
          password: string;
          first_name: string;
          last_name: string;
        }
      }

      export namespace Social {
        export interface Request {
          flow_id: string;
          cb_state: string;
          cb_code: string;
        }
      }
    }
  }

  export namespace Client {
    export namespace Session {
      export namespace Invalidate {
        export interface Request {
          token: string;
          session_id: string;
        }
      }

      export namespace List {
        export interface Request extends OptionalParams {
          token: string;
        }

        export interface OptionalParams {
          filter?: any;
          last?: string;
          order?: string;
          order_by?: string;
          size?: number;
        }
      }

      export namespace Refresh {
        export interface Request extends OptionalParams {
          refresh_token: string;
        }

        export interface OptionalParams {
          user_token?: string;
        }

        export interface Response {
          refresh_token: Token;
          active_token?: Token;
        }
      }
    }
  }

  export namespace Session {
    export interface Item {
      id: string;
      type: TokenType;
      life: number;
      expire: string;
      identity: string;
      profile: Profile;
      created_at: string;
      scopes?: Scopes;
      active_token?: Token;
    }

    export namespace List {
      export interface Request {
        filter?: any;
        last?: string;
        order?: string;
        order_by?: string;
        size?: number;
      }

      export interface Response {
        sessions: Item[];
        last?: string;
      }
    }
  }

  export namespace User {
    export namespace Create {
      export interface Request extends RequiredParams, OptionalParams {}

      export interface RequiredParams {
        email: string;
        authenticator: string;
      }

      export interface OptionalParams {
        id_provider?: IDProvider;
        verified?: boolean;
        require_mfa?: boolean;
        profile?: Profile;
        scopes?: Scopes;
      }

      export interface Response {
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
    }

    export namespace Delete {
      export interface Request {
        email: string;
      }
    }

    export namespace Invite {
      export interface Item {
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

      export interface Request extends RequiredParams, OptionalParams {}

      export interface RequiredParams {
        inviter: string;
        email: string;
        callback: string;
        state: string;
      }

      export interface OptionalParams {
        invite_org?: string;
        require_mfa?: boolean;
      }

      export interface Response extends Item {}

      export namespace List {
        export type Response = Invite.Item[];
      }

      export namespace Delete {
        export interface Request {
          id: string;
        }
      }
    }

    export namespace List {
      export interface Request {
        scopes: Scopes;
        glob_scopes: Scopes;
      }

      export interface Response {
        invites: Invite.Item[];
      }
    }

    export namespace Login {
      export namespace Password {
        export interface Request extends RequiredParams, OptionalParams {}

        export interface RequiredParams {
          email: string;
          password: string;
        }

        export interface OptionalParams {
          extra_profile?: Profile;
        }
      }

      export namespace Social {
        export interface Request extends RequiredParams, OptionalParams {}

        export interface RequiredParams {
          provider: MFAProvider;
          email: string;
          social_id: string;
        }

        export interface OptionalParams {
          extra_profile?: Profile;
        }
      }
    }

    export namespace MFA {
      export namespace Delete {
        export interface Request {
          user_id: string;
          mfa_provider: MFAProvider;
        }
      }

      export namespace Enroll {
        export interface Request {
          user_id: string;
          mfa_provider: MFAProvider;
          code: string;
        }
      }

      export namespace Start {
        export interface Request extends RequiredParams, OptionalParams {}

        export interface RequiredParams {
          user_id: string;
          mfa_provider: MFAProvider;
        }

        export interface OptionalParams {
          enroll?: boolean;
          phone?: string;
        }

        export interface Response {
          totp_secret?: {
            qr_image: string;
            secret: string;
          };
        }
      }

      export namespace Verify {
        export interface Request {
          user_id: string;
          mfa_provider: string;
          code: string;
        }
      }
    }

    export namespace Profile {
      export interface Item {
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

      export namespace Get {
        export interface EmailRequest {
          email: string | null;
        }

        export interface IdentityRequest {
          identity: string | null;
        }
      }

      export namespace Update {
        export interface EmailRequest {
          email: string | null;
          profile: Profile;
        }

        export interface IdentityRequest {
          identity: string | null;
          profile: Profile;
        }
      }
    }

    export namespace Update {
      export interface EmailRequest extends OptionalParams {
        email: string | null;
      }

      export interface IdentityRequest extends OptionalParams {
        identity: string | null;
      }

      export interface OptionalParams {
        authenticator?: string | null;
        disabled?: boolean | null;
        require_mfa?: boolean | null;
      }

      export interface Response {
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
    }

    export namespace Verify {
      export interface Request {
        id_provider: IDProvider;
        email: string;
        authenticator: string;
      }

      export interface Response {
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
  }
}
