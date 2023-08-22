import { Signer } from "./utils/signer.js";

/**
 * PangeaConfig options
 */
export interface ConfigOptions {
  domain?: string;
  environment?: ConfigEnv;
  configID?: string;
  insecure?: boolean;
  requestRetries?: number;
  requestTimeout?: number;
  queuedRetryEnabled?: boolean;
  pollResultTimeoutMs?: number;
  queuedRetries?: number;
  customUserAgent?: string;
}

export interface PostOptions {
  pollResultSync?: boolean;
}

export enum ConfigEnv {
  LOCAL = "local",
  PRODUCTION = "production",
}

export interface Dictionary {
  [key: string]: string | boolean | number | Dictionary;
}

/**
 * Secure Audit interface definitions
 */
export namespace Audit {
  export interface LogOptions {
    verbose?: boolean;
    signer?: Signer;
    skipEventVerification?: boolean;
    verify?: boolean;
    publicKeyInfo?: Object; // Key:Value object
  }

  export interface LogData {
    event: Audit.Event;
    verbose?: boolean;
    signature?: string;
    public_key?: string;
    prev_root?: string;
  }

  export interface Event {
    [key: string]: Object | string | boolean | number | Date;
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

  export interface RootResult extends Root {
    data: Root;
  }
}

export namespace Redact {
  export interface TextResult {
    redacted_text?: string;
    count: number;
  }

  export interface StructuredResult {
    redacted_data?: object;
    count: number;
  }

  export interface Options {
    debug?: boolean;
    rules?: string[];
    return_result?: boolean;
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

  export interface CheckResult {
    sanctions: Sanction[];
  }
}

export namespace FileScan {
  export interface ScanRequest {
    verbose?: boolean;
    raw?: boolean;
    provider?: string;
    filepath?: string;
    file?: string;
  }

  export interface Options extends PostOptions {}

  export interface ScanResult {
    parameter?: Dictionary;
    raw_data?: Dictionary;
    data: {
      category: string[];
      score: number;
      verdict: string;
    };
  }
}

/**
 * Intel services interface definitions
 */
export namespace Intel {
  export enum HashType {
    SHA256 = "sha256",
    SHA1 = "sha1",
    MD5 = "md5",
  }

  export interface Options {
    verbose?: boolean;
    raw?: boolean;
    provider?: string;
  }

  export interface ReputationResult extends CommonResult {
    data: {
      category: string[];
      score: number;
      verdict: string;
    };
  }

  export namespace File {
    interface Options extends Intel.Options {}
    interface Params {
      hash: string;
      hash_type: string;
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationResult extends Intel.ReputationResult {}
    export interface ReputationRequest extends Params, ReputationOptions {}
  }

  export namespace Domain {
    interface Options extends Intel.Options {}
    interface Params {
      domain: string;
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationResult extends Intel.ReputationResult {}
    export interface ReputationRequest extends Params, ReputationOptions {}
  }

  export namespace URL {
    interface Options extends Intel.Options {}
    interface Params {
      url: string;
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationResult extends Intel.ReputationResult {}
    export interface ReputationRequest extends Params, ReputationOptions {}
  }

  export namespace IP {
    interface Options extends Intel.Options {}
    interface Params {
      ip: string;
    }

    export interface GeolocateOptions extends Options {}
    export interface GeolocateRequest extends Params, GeolocateOptions {}

    export interface DomainOptions extends Options {}
    export interface DomainRequest extends Params, DomainOptions {}

    export interface VPNOptions extends Options {}
    export interface VPNRequest extends Params, VPNOptions {}

    export interface ProxyOptions extends Options {}
    export interface ProxyRequest extends Params, ProxyOptions {}

    export interface ReputationOptions extends Options {}
    export interface ReputationResult extends Intel.ReputationResult {}
    export interface ReputationParams extends Params, ReputationOptions {}
    export interface GeolocateResult extends CommonResult {
      data: {
        country: string;
        city: string;
        latitude: number;
        longitude: number;
        postal_code: string;
        country_code: string;
      };
    }

    export interface DomainResult extends CommonResult {
      data: {
        domain_found: boolean;
        domain?: string;
      };
    }

    export interface VPNResult extends CommonResult {
      data: {
        is_vpn: boolean;
      };
    }

    export interface ProxyResult extends CommonResult {
      data: {
        is_proxy: boolean;
      };
    }
  }

  export interface CommonResult {
    parameter?: Dictionary;
    raw_data?: Dictionary;
  }

  export namespace User {
    export interface BreachedData {
      found_in_breach: boolean;
      breach_count: number;
    }

    export interface BreachedResult extends Intel.CommonResult {
      data: BreachedData;
    }

    export namespace User {
      export interface BreachedOptions extends Intel.Options {
        start?: string;
        end?: string;
      }

      export interface BreachedEmailRequest extends BreachedOptions {
        email: string;
      }

      export interface BreachedUsernameRequest extends BreachedOptions {
        username: string;
      }

      export interface BreachedIPRequest extends BreachedOptions {
        ip: string;
      }

      export interface BreachedPhoneRequest extends BreachedOptions {
        phone_number: string;
      }

      export interface BreachedResult extends Intel.User.BreachedResult {}

      export type BreachedRequest =
        | BreachedEmailRequest
        | BreachedIPRequest
        | BreachedPhoneRequest
        | BreachedUsernameRequest;
    }

    export namespace Password {
      export interface BreachedOptions extends Intel.Options {}

      export interface BreachedRequest extends BreachedOptions {
        hash_type: string;
        hash_prefix: string;
      }

      export enum PasswordStatus {
        BREACHED,
        UNBREACHED,
        INCONCLUSIVE,
      }
    }
  }
}

/**
 * Vault services interface definitions
 */
export namespace Vault {
  export enum KeyPurpose {
    SIGNING = "signing",
    ENCRYPTION = "encryption",
    JWT = "jwt",
  }

  export enum AsymmetricAlgorithm {
    Ed25519 = "ED25519",
    RSA2048_PKCS1V15_SHA256 = "RSA-PKCS1V15-2048-SHA256",
    RSA2048_OAEP_SHA256 = "RSA-OAEP-2048-SHA256",
    ES256 = "ES256",
    ES384 = "ES384",
    ES512 = "ES512",
    ES256K = "ES256K",
    RSA2048_OAEP_SHA1 = "RSA-OAEP-2048-SHA1",
    RSA2048_OAEP_SHA512 = "RSA-OAEP-2048-SHA512",
    RSA3072_OAEP_SHA1 = "RSA-OAEP-3072-SHA1",
    RSA3072_OAEP_SHA256 = "RSA-OAEP-3072-SHA256",
    RSA3072_OAEP_SHA512 = "RSA-OAEP-3072-SHA512",
    RSA4096_OAEP_SHA1 = "RSA-OAEP-4096-SHA1",
    RSA4096_OAEP_SHA256 = "RSA-OAEP-4096-SHA256",
    RSA4096_OAEP_SHA512 = "RSA-OAEP-4096-SHA512",
    RSA2048_PSS_SHA256 = "RSA-PSS-2048-SHA256",
    RSA3072_PSS_SHA256 = "RSA-PSS-3072-SHA256",
    RSA4096_PSS_SHA256 = "RSA-PSS-4096-SHA256",
    RSA4096_PSS_SHA512 = "RSA-PSS-4096-SHA512",
    RSA = "RSA-PKCS1V15-2048-SHA256", // deprecated, use RSA2048_PKCS1V15_SHA256 instead
  }

  export enum SymmetricAlgorithm {
    HS256 = "HS256",
    HS384 = "HS384",
    HS512 = "HS512",
    AES128_CFB = "AES-CFB-128",
    AES256_CFB = "AES-CFB-256",
    AES256_GCM = "AES-GCM-256",
    AES = "AES-CFB-128", // deprecated, use AES128_CFB instead
  }

  export enum ItemType {
    ASYMMETRIC_KEY = "asymmetric_key",
    SYMMETRIC_KEY = "symmetric_key",
    SECRET = "secret",
    PANGEA_TOKEN = "pangea_token",
  }

  export enum ItemState {
    ENABLED = "ENABLED",
    DISABLED = "disabled",
  }

  export enum ItemVersionState {
    ACTIVE = "active",
    DEACTIVATED = "deactivated",
    SUSPENDED = "suspended",
    COMPROMISED = "compromised",
    DESTROYED = "destroyed",
  }

  export enum ItemOrder {
    ASC = "asc",
    DESC = "desc",
  }

  export enum ItemOrderBy {
    TYPE = "type",
    CREATED_AT = "created_at",
    DESTROYED_AT = "destroyed_at",
    PURPOSE = "purpose",
    EXPIRATION = "expiration",
    LAST_ROTATED = "last_rotated",
    NEXT_ROTATION = "next_rotation",
    NAME = "name",
    FOLDER = "folder",
    VERSION = "version",
  }

  export type Metadata = Object;
  export type Tags = string[];

  // EncodedPublicKey is a PEM public key, with no further encoding (i.e. no base64)
  // It may be used for example in openssh with no further processing
  export type EncodedPublicKey = string;

  // EncodedPrivateKey is a PEM private key, with no further encoding (i.e. no base64).
  // It may be used for example in openssh with no further processing
  export type EncodedPrivateKey = string;

  // EncodedSymmetricKey is a base64 encoded key
  export type EncodedSymmetricKey = string;

  export interface StateChangeOptions {
    version?: number;
    destroy_period?: string;
  }

  export interface StateChangeRequest extends StateChangeOptions {
    id: string;
    state: Vault.ItemVersionState;
  }

  export interface StateChangeResult {
    id: string;
    version: number;
    state: string;
    destroy_at?: string;
  }

  export interface DeleteRequest {
    id: string;
  }

  export interface DeleteResult {
    id: string;
  }

  export interface ItemData {
    type: string;
    id: string;
    item_state?: string;
    current_version?: ItemVersionData;
    name?: string;
    folder?: string;
    metadata?: Metadata;
    tags?: Tags;
    rotation_frequency?: string;
    rotation_state?: string;
    last_rotated?: string;
    next_rotation?: string;
    expiration?: string;
    created_at: string;
    algorithm: string;
    purpose: string;
  }

  export interface ListItemData extends ItemData {
    compromised_versions: ItemVersionData[];
  }

  export interface ListResult {
    items: ListItemData[];
    count: number;
    last?: string;
  }

  export interface ListOptions {
    filter?: Object;
    last?: string;
    size?: number;
    order?: Vault.ItemOrder;
    order_by?: Vault.ItemOrderBy;
  }

  export interface UpdateOptions {
    name?: string;
    folder?: string;
    metadata?: Metadata;
    tags?: Tags;
    rotation_frequency?: string;
    rotation_state?: ItemVersionState;
    rotation_grace_period?: string;
    expiration?: string;
    item_state?: string;
  }

  export interface UpdateRequest extends UpdateOptions {
    id: string;
  }

  export interface UpdateResult {
    id: string;
  }

  export interface GetOptions {
    version?: number | string;
    verbose?: boolean;
    version_state?: ItemVersionState;
  }

  export interface GetRequest extends GetOptions {
    id: string;
  }

  export interface ItemVersionData {
    version: number;
    state: string;
    created_at: string;
    destroy_at?: string;
    public_key?: EncodedPublicKey;
    secret?: string;
  }

  export interface GetResult extends ItemData {
    rotation_grace_period?: string;
    versions: ItemVersionData[];
  }

  export namespace JWT {
    export interface SignRequest {
      id: string;
      payload: string;
    }

    export interface SignResult {
      jws: string;
    }

    export interface VerifyRequest {
      jws: string;
    }

    export interface VerifyResult {
      valid_signature: boolean;
    }
  }

  export namespace JWK {
    export interface Header {
      alg: string;
      kid?: string;
      kty: string;
      use?: string;
    }

    export interface JWKrsa extends Header {
      n: string;
      e: string;
      d?: string;
    }

    export interface JWKec extends Header {
      crv: string;
      d?: string;
      x: string;
      y: string;
    }

    export interface JWK extends Header {}

    export interface GetResult {
      keys: [JWKrsa | JWKec][];
    }

    export interface GetOptions {
      version?: string;
    }

    export interface GetRequest extends GetOptions {
      id: string;
    }
  }

  export namespace Common {
    export interface StoreOptions {
      folder?: string;
      metadata?: Metadata;
      tags?: Tags;
      rotation_frequency?: string;
      rotation_state?: ItemVersionState;
      expiration?: string;
    }

    export interface StoreRequest {
      type: Vault.ItemType;
      name: string;
    }

    export interface StoreResult {
      id: string;
      type: string;
      version: number;
    }

    export interface GenerateRequest {
      type: Vault.ItemType;
      name: string;
    }

    export interface GenerateOptions {
      folder?: string;
      metadata?: Metadata;
      tags?: Tags;
      rotation_frequency?: string;
      rotation_state?: ItemVersionState;
      expiration?: string;
    }

    export interface GenerateResult {
      id: string;
      type: string;
      version: number;
    }

    export interface RotateRequest {
      id: string;
    }

    export interface RotateOptions {
      rotation_state?: ItemVersionState;
    }

    export interface RotateResult {
      id: string;
      version: number;
      type: string;
    }
  }

  export namespace Secret {
    export const Algorithm = {
      BASE32: "base32",
    };

    export interface StoreOptions extends Common.StoreOptions {}

    export interface StoreRequest extends Common.StoreRequest, StoreOptions {
      secret: string;
    }

    export interface StoreResult extends Common.StoreResult {
      secret: string;
    }

    export interface GenerateRequest extends Common.GenerateRequest, Common.GenerateOptions {}

    export interface GenerateResult extends Common.GenerateRequest {
      secret: string;
    }

    export namespace Secret {
      export interface RotateOptions extends Common.RotateOptions {}
      export interface RotateRequest extends Common.RotateRequest, RotateOptions {
        secret?: string;
      }
    }

    export namespace Token {
      export interface RotateRequest extends Common.RotateRequest {
        rotation_grace_period: string;
      }
    }

    export interface RotateResult extends Common.RotateResult {
      secret: string;
    }
  }

  export namespace Key {
    export interface RotateOptions {
      key?: EncodedSymmetricKey;
      public_key?: EncodedPublicKey;
      private_key?: EncodedPrivateKey;
    }

    export interface RotateRequest extends Common.RotateRequest, RotateOptions {}

    export interface RotateResult extends Common.RotateResult {
      algorithm: string;
      purpose: string;
      public_key?: EncodedPublicKey;
    }
  }

  export namespace Asymmetric {
    export interface GenerateOptions extends Common.GenerateOptions {}

    export interface GenerateRequest extends Common.GenerateRequest, GenerateOptions {
      algorithm: Vault.AsymmetricAlgorithm;
      purpose: Vault.KeyPurpose;
    }

    export interface GenerateResult extends Common.GenerateResult {
      algorithm: string;
      purpose: string;
      public_key: EncodedPublicKey;
    }

    export interface StoreOptions extends Common.StoreOptions {}

    export interface StoreRequest extends Common.StoreRequest, StoreOptions {
      private_key: EncodedPrivateKey;
      public_key: EncodedPublicKey;
      algorithm: Vault.AsymmetricAlgorithm;
      purpose: Vault.KeyPurpose;
    }

    export interface StoreResult extends Common.StoreResult {
      public_key: EncodedPublicKey;
      algorithm: string;
      purpose: string;
    }

    export interface SignOptions {
      version?: number;
    }

    export interface SignRequest extends SignOptions {
      id: string;
      message: string;
    }

    export interface SignResult {
      id: string;
      version: number;
      signature: string;
      algorithm: string;
      public_key?: EncodedPublicKey;
    }

    export interface VerifyOptions {
      version?: number;
    }

    export interface VerifyRequest extends VerifyOptions {
      id: string;
      message: string;
      signature: string;
    }

    export interface VerifyResult {
      id: string;
      version: number;
      algorithm: string;
      valid_signature: boolean;
    }
  }

  export namespace Symmetric {
    export interface StoreOptions extends Common.StoreOptions {}

    export interface StoreRequest extends Common.StoreRequest, StoreOptions {
      key: EncodedSymmetricKey;
      algorithm: Vault.SymmetricAlgorithm;
      purpose: Vault.KeyPurpose;
    }

    export interface StoreResult extends Common.StoreResult {
      algorithm?: string;
      purpose?: string;
    }

    export interface GenerateOptions extends Common.GenerateOptions {}

    export interface GenerateRequest extends Common.GenerateRequest, GenerateOptions {
      algorithm: Vault.SymmetricAlgorithm;
      purpose: Vault.KeyPurpose;
    }

    export interface GenerateResult extends Common.GenerateResult {
      algorithm: string;
      purpose: string;
    }

    export interface EncryptOptions {
      version?: number;
      additional_data?: string;
    }

    export interface EncryptRequest extends EncryptOptions {
      id: string;
      plain_text: string;
    }

    export interface EncryptResult {
      id: string;
      version: number;
      algorithm: string;
      cipher_text: string;
    }

    export interface DecryptOptions {
      version?: number;
      additional_data?: string;
    }

    export interface DecryptRequest extends DecryptOptions {
      id: string;
      cipher_text: string;
    }

    export interface DecryptResult {
      id: string;
      version?: number;
      algorithm: string;
      plain_text: string;
    }
  }

  export namespace Folder {
    export interface CreateRequest {
      name: string;
      folder: string;
      metadata?: Metadata;
      tags?: Tags;
    }

    export interface CreateResult {
      id: string;
    }
  }
}

export namespace AuthN {
  export enum IDProvider {
    FACEBOOK = "facebook",
    GITHUB = "github",
    GOOGLE = "google",
    MICROSOFT_ONLINE = "microsoftonline",
    PASSWORD = "password",
  }

  export enum ItemOrder {
    ASC = "asc",
    DESC = "desc",
  }

  export type Scopes = string[];

  export interface Profile {
    [key: string]: string;
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

  export interface UserItem {
    profile: Profile;
    id: string;
    email: string;
    scopes: Scopes;
    id_providers: string[];
    mfa_providers: string[];
    require_mfa: boolean;
    verified: boolean;
    disabled: boolean;
    last_login_at: string;
    created_at: string;
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

  export interface LoginToken {
    token: string;
    id: string;
    identity: string;
    type: TokenType;
    life: number;
    expire: string;
    email: string;
    scopes: Scopes;
    profile: Profile;
    created_at: string;
  }

  export interface SessionToken {
    id: string;
    identity: string;
    type: TokenType;
    life: number;
    expire: string;
    email: string;
    scopes: Scopes;
    profile: Profile;
    created_at: string;
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

    export interface Result {
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

    export namespace Reset {
      export interface PasswordOptions {
        cb_state?: string;
        cb_code?: string;
        cancel?: boolean;
      }

      export interface PasswordRequest extends PasswordOptions {
        flow_id: string;
        password: string;
      }

      export interface PasswordResult extends Flow.Result {}
    }

    export namespace Enroll {
      export namespace MFA {
        export interface StartRequest extends StartOptions {
          flow_id: string;
          mfa_provider: MFAProvider;
        }

        export interface StartOptions {
          phone?: string;
        }

        export interface CompleteRequest extends CompleteOptions {
          flow_id: string;
        }
        export interface CompleteOptions {
          cancel?: boolean;
          code?: string;
        }
      }
    }

    export namespace Verify {
      export interface CaptchaRequest {
        flow_id: string;
        code: string;
      }

      export interface EmailOptions {
        cb_state?: string;
        cb_code?: string;
      }

      export interface EmailRequest extends EmailOptions {
        flow_id: string;
      }

      export interface PasswordOptions {
        password?: string;
        cancel?: boolean;
      }

      export interface PasswordRequest {
        flow_id: string;
      }

      export interface SocialRequest {
        flow_id: string;
        cb_state: string;
        cb_code: string;
      }

      export namespace MFA {
        export interface StartRequest {
          flow_id: string;
          mfa_provider: MFAProvider;
        }

        export interface CompleteOptions {
          cancel?: boolean;
          code?: string;
        }
        export interface CompleteRequest extends CompleteOptions {
          flow_id: string;
        }
      }
    }

    export interface CompleteRequest {
      flow_id: string;
    }

    export interface CompleteResult {
      refresh_token: LoginToken;
      active_token?: LoginToken;
    }

    export interface StartRequest extends StartOptions {}

    export interface StartOptions {
      email?: string;
      flow_types?: FlowType[];
      provider?: AuthN.IDProvider;
      cb_uri?: string;
    }

    export namespace Signup {
      export interface PasswordRequest {
        flow_id: string;
        password: string;
        first_name: string;
        last_name: string;
      }
      export interface SocialRequest {
        flow_id: string;
        cb_state: string;
        cb_code: string;
      }
    }
  }

  export namespace Client {
    export interface UserinfoRequest {
      code: string;
    }

    export interface UserinfoResult {
      refresh_token: LoginToken;
      active_token: LoginToken;
    }

    export interface JWKSResult {
      keys: [Vault.JWK.JWKrsa | Vault.JWK.JWKec][];
    }

    export namespace Token {
      export interface CheckRequest {
        token: string;
      }

      export interface CheckResult extends SessionToken {}
    }

    export namespace Password {
      export interface UpdateRequest {
        token: string;
        old_password: string;
        new_password: string;
      }
    }

    export namespace Session {
      export interface InvalidateRequest {
        token: string;
        session_id: string;
      }

      export interface ListOptions {
        filter?: Object;
        last?: string;
        order?: string;
        order_by?: string;
        size?: number;
      }

      export interface ListRequest extends ListOptions {
        token: string;
      }

      export interface RefreshOptions {
        user_token?: string;
      }

      export interface RefreshRequest extends RefreshOptions {
        refresh_token: string;
      }

      export interface RefreshResult {
        refresh_token: LoginToken;
        active_token?: LoginToken;
      }
    }
  }

  export namespace Session {
    export interface Item {
      id: string;
      type: TokenType;
      life: number;
      expire: string;
      profile: Profile;
      created_at: string;
      scopes?: Scopes;
      active_token?: SessionToken;
    }

    export interface ListRequest {
      filter?: Object;
      last?: string;
      order?: string;
      order_by?: string;
      size?: number;
    }

    export interface ListResult {
      sessions: Item[];
      last?: string;
    }
  }

  export namespace User {
    export interface CreateOptions {
      verified?: boolean;
      require_mfa?: boolean;
      profile?: Profile;
      scopes?: Scopes;
    }

    export interface CreateRequest extends CreateOptions {
      email: string;
      authenticator: string;
      id_provider: IDProvider;
    }

    export interface CreateResult {
      id: string;
      email: string;
      profile: Profile;
      id_providers: string[];
      require_mfa: boolean;
      verified: boolean;
      last_login_at: string;
      disable?: boolean;
      mfa_provider?: MFAProvider[];
    }

    export namespace Delete {
      export interface EmailRequest {
        email: string;
      }

      export interface IDRequest {
        id: string;
      }
    }

    export interface InviteItem {
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

    export interface InviteRequest extends InviteOptions {
      inviter: string;
      email: string;
      callback: string;
      state: string;
    }

    export interface InviteResult extends InviteItem {}

    export interface InviteOptions {
      require_mfa?: boolean;
    }

    export enum ListOrderBy {
      ID = "id",
      CREATED_AT = "created_at",
      LAST_LOGIN_AT = "last_login_at",
      EMAIL = "email",
    }

    export interface ListRequest {
      filter?: Object;
      last?: string;
      order?: AuthN.ItemOrder;
      order_by?: AuthN.User.ListOrderBy;
      size?: number;
      use_new?: boolean; // Temporary field, need to be true
    }

    export interface ListResult {
      users: UserItem[];
      last?: string;
      count: number;
    }

    export namespace Password {
      export interface ResetRequest {
        user_id: string;
        new_password: string;
      }
    }

    export namespace Invite {
      export enum OrderBy {
        ID = "id",
        CREATED_AT = "created_at",
        TYPE = "type",
        EXPIRE = "expire",
        CALLBACK = "callback",
        STATE = "state",
        EMAIL = "email",
        INVITER = "inviter",
        INVITE_ORG = "invite_org",
      }

      export interface DeleteRequest {
        id: string;
      }

      export interface ListRequest {
        filter?: Object;
        last?: string;
        order?: ItemOrder;
        order_by?: OrderBy;
        size?: number;
      }

      export interface ListResult {
        invites: InviteItem[];
      }
    }

    export namespace Login {
      export interface PasswordOptions {
        extra_profile?: Profile;
      }
      export interface PasswordRequest extends PasswordOptions {
        email: string;
        password: string;
      }
      export interface SocialOptions {
        extra_profile?: Profile;
      }
      export interface SocialRequest extends SocialOptions {
        provider: IDProvider;
        email: string;
        social_id: string;
      }

      export interface LoginResult {
        refresh_token: LoginToken;
        active_token?: LoginToken;
      }
    }

    export namespace MFA {
      export interface DeleteRequest {
        user_id: string;
        mfa_provider: MFAProvider;
      }

      export interface EnrollRequest {
        user_id: string;
        mfa_provider: MFAProvider;
        code: string;
      }
      export interface StartRequest extends StartOptions {
        user_id: string;
        mfa_provider: MFAProvider;
      }

      export interface StartOptions {
        enroll?: boolean;
        phone?: string;
      }

      export interface StartResult {
        totp_secret?: {
          qr_image: string;
          secret: string;
        };
      }
      export interface VerifyRequest {
        user_id: string;
        mfa_provider: string;
        code: string;
      }
    }
    export namespace Profile {
      export interface GetResult extends UserItem {}

      export namespace Get {
        export interface EmailRequest {
          email: string;
        }

        export interface IDRequest {
          id: string;
        }
      }

      export namespace Update {
        export interface EmailRequest {
          email: string;
          profile: Profile;
        }

        export interface IDRequest {
          id: string;
          profile: Profile;
        }
      }

      export interface UpdateResult extends UserItem {}
    }

    export namespace Update {
      export interface EmailRequest extends Options {
        email: string;
      }

      export interface IDRequest extends Options {
        id: string;
      }

      export interface Options {
        authenticator?: string;
        disabled?: boolean;
        require_mfa?: boolean;
        verified?: boolean;
      }
    }

    export interface UpdateResult extends UserItem {}

    export interface VerifyRequest {
      id_provider: IDProvider;
      email: string;
      authenticator: string;
    }

    export interface VerifyResult {
      id: string;
      email: string;
      profile: Profile;
      scopes: Scopes;
      id_providers: string[];
      require_mfa: boolean;
      mfa_providers: string[];
      verified: boolean;
      disabled: boolean;
      last_login_at?: string;
    }
  }
}
