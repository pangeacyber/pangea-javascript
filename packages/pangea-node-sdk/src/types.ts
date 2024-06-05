import { Signer } from "./utils/signer.js";

/**
 * PangeaConfig options
 */
export interface ConfigOptions {
  /** Pangea API domain. */
  domain?: string;

  /**
   * Pangea environment.
   *
   * This is intended to facilitate SDK development and should not be touched in
   * everyday usage.
   */
  environment?: ConfigEnv;

  /** Config ID for multi-config projects. */
  configID?: string;

  /**
   * Whether or not to perform requests via plain HTTP, as opposed to secure
   * HTTPS.
   */
  insecure?: boolean;

  /** How many times a request should be retried on failure. */
  requestRetries?: number;

  /** Maximum allowed time (in milliseconds) for a request to complete. */
  requestTimeout?: number;

  /** Whether or not queued request retries are enabled. */
  queuedRetryEnabled?: boolean;

  /** Timeout for polling results after a HTTP/202 (in milliseconds). */
  pollResultTimeoutMs?: number;

  /** How many queued request retries there should be on failure. */
  queuedRetries?: number;

  /** User-Agent string to append to the default one. */
  customUserAgent?: string;
}

export interface PostOptions {
  pollResultSync?: boolean;
  files?: FileItems;
}

export enum ConfigEnv {
  LOCAL = "local",
  PRODUCTION = "production",
}

export enum TransferMethod {
  MULTIPART = "multipart",
  POST_URL = "post-url",
  PUT_URL = "put-url",
  SOURCE_URL = "source-url",
  DEST_URL = "dest-url",
}

export interface Dictionary {
  [key: string]: string | boolean | number | Dictionary;
}

export interface FileData {
  file: Buffer | string;
  name: string;
  file_details?: Dictionary;
}

export interface FileUploadParams {
  size: number;
  crc32c: string;
  sha256: string;
}

export interface FileItems {
  [key: string]: FileData;
}

export interface AcceptedResult {
  ttl_mins: number;
  retry_counter: number;
  location: string;
  post_url?: string;
  put_url?: string;
  post_form_data?: Dictionary;
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

  export interface LogEvent {
    event: Audit.Event;
    signature?: string;
    public_key?: string;
  }

  export interface LogRequestCommon {
    verbose?: boolean;
  }

  export interface LogData extends LogEvent, LogRequestCommon {
    event: Audit.Event;
    prev_root?: string;
  }

  export interface LogBulkRequest extends LogRequestCommon {
    events: Audit.LogEvent[];
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
    fpe_context?: string;
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

  export interface LogBulkResponse {
    results: LogResponse[];
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
    return_context?: boolean;
  }

  export interface SearchParams extends SearchParamsOptions {
    query: string;
  }

  export interface RootParams {
    tree_size?: number;
  }

  export interface ResultOptions {
    assert_search_restriction?: Audit.SearchRestriction;
    return_context?: boolean;
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

  export enum DownloadFormat {
    /** JSON. */
    JSON = "json",

    /** CSV. */
    CSV = "csv",
  }

  export interface DownloadRequest {
    /** ID returned by the export API. */
    request_id?: string;

    /** ID returned by the search API. */
    result_id?: string;

    /** Format for the records. */
    format?: DownloadFormat;

    /** Return the context data needed to decrypt secure audit events that have been redacted with format preserving encryption. */
    return_context?: boolean;
  }

  export interface DownloadResult {
    /**
     * URL where search results can be downloaded.
     */
    dest_url: string;
  }

  export interface ExportRequest {
    /** Format for the records. */
    format?: DownloadFormat;

    /** The start of the time range to perform the search on. */
    start?: string;

    /**
     * The end of the time range to perform the search on. If omitted, then all
     * records up to the latest will be searched.
     */
    end?: string;

    /** Name of column to sort the results by. */
    order_by?: string;

    /** Specify the sort order of the response. */
    order?: "asc" | "desc";

    /**
     * Whether or not to include the root hash of the tree and the membership
     * proof for each record.
     */
    verbose?: boolean;
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
    rulesets?: string[];
    return_result?: boolean;
    redaction_method_overrides?: RedactionMethodOverrides;
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

  export enum RedactType {
    MASK = "mask",
    PARTIAL_MASKING = "partial_masking",
    REPLACEMENT = "replacement",
    DETECT_ONLY = "detect_only",
    HASH = "hash",
    FPE = "fpe",
  }

  export enum FPEAlphabet {
    NUMERIC = "numeric",
    ALPHANUMERICLOWER = "alphanumericlower",
    ALPHANUMERIC = "alphanumeric",
  }

  export enum MaskingType {
    MASK = "mask",
    UNMASK = "unmask",
  }

  export interface PartialMasking {
    masking_type?: MaskingType;
    unmasked_from_left?: number;
    unmasked_from_right?: number;
    masked_from_left?: number;
    masked_from_right?: number;
    chars_to_ignore?: string[];
    masking_char?: string[];
  }

  export interface RedactionMethodOverrides {
    redaction_type: RedactType;
    hash?: object;
    fpe_alphabet?: FPEAlphabet;
    partial_masking?: PartialMasking;
    redaction_value?: string;
  }

  export interface UnredactRequest<O = object> {
    redacted_data: O;
    fpe_context?: string;
  }

  export interface UnredactResult<O = object> {
    data: O;
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
    transfer_method?: TransferMethod;
    source_url?: string;
  }

  export interface ScanFileParams {
    size: number;
    crc32c: string;
    sha256: string;
  }

  export interface ScanFullRequest extends ScanRequest, ScanFileParams {}

  export interface Options {
    pollResultSync?: boolean;
  }

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
    SHA512 = "sha512",
    NTLM = "ntlm",
  }

  export interface Options {
    verbose?: boolean;
    raw?: boolean;
    provider?: string;
  }

  export interface ReputationData {
    category: string[];
    score: number;
    verdict: string;
  }

  export interface CommonResult {
    parameter?: Dictionary;
    raw_data?: Dictionary;
  }

  export interface ReputationResult extends CommonResult {
    data: ReputationData;
  }

  export namespace File {
    interface Options extends Intel.Options {}
    interface Params {
      hash?: string;
      hashes?: string[];
      hash_type: string;
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationData extends Intel.ReputationData {}

    export interface ReputationBulkData {
      [key: string]: ReputationData;
    }

    export interface ReputationResult extends Intel.CommonResult {
      data: ReputationData;
    }

    export interface ReputationBulkResult extends Intel.CommonResult {
      data: ReputationBulkData;
    }
    export interface ReputationRequest extends Params, ReputationOptions {}
  }

  export namespace Domain {
    interface Options extends Intel.Options {}
    interface Params {
      domain?: string;
      domains?: string[];
    }

    export interface ReputationOptions extends Options {}

    export interface ReputationData extends Intel.ReputationData {}

    export interface ReputationBulkData {
      [key: string]: ReputationData;
    }

    export interface ReputationResult extends Intel.CommonResult {
      data: ReputationData;
    }

    export interface ReputationBulkResult extends Intel.CommonResult {
      data: ReputationBulkData;
    }

    export interface ReputationRequest extends Params, ReputationOptions {}

    export interface WhoIsOptions extends Options {}
    export interface WhoIsRequest extends Params, WhoIsOptions {}
    export interface WhoIsData {
      domain_name: string;
      domain_availability: string;
      created_date?: string;
      updated_date?: string;
      expires_date?: string;
      host_names?: string[];
      ips?: string[];
      registrar_name?: string;
      contact_email?: string;
      estimated_domain_age?: number;
      registrant_organization?: string;
      registrant_country?: string;
    }

    export interface WhoIsResult extends Intel.CommonResult {
      data: WhoIsData;
    }
  }

  export namespace URL {
    interface Options extends Intel.Options {}
    interface Params {
      url?: string;
      urls?: string[];
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationData extends Intel.ReputationData {}

    export interface ReputationBulkData {
      [key: string]: ReputationData;
    }

    export interface ReputationResult extends Intel.CommonResult {
      data: ReputationData;
    }

    export interface ReputationBulkResult extends Intel.CommonResult {
      data: ReputationBulkData;
    }
    export interface ReputationRequest extends Params, ReputationOptions {}
  }

  export namespace IP {
    interface Options extends Intel.Options {}
    interface Params {
      ip?: string;
      ips?: string[];
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
    export interface ReputationData extends Intel.ReputationData {}

    export interface ReputationBulkData {
      [key: string]: ReputationData;
    }

    export interface ReputationResult extends Intel.CommonResult {
      data: ReputationData;
    }

    export interface ReputationBulkResult extends Intel.CommonResult {
      data: ReputationBulkData;
    }
    export interface ReputationParams extends Params, ReputationOptions {}

    export interface GeolocateData {
      country: string;
      city: string;
      latitude: number;
      longitude: number;
      postal_code: string;
      country_code: string;
    }

    export interface GeolocateResult extends CommonResult {
      data: GeolocateData;
    }

    export interface GeolocateBulkData {
      [key: string]: GeolocateData;
    }

    export interface GeolocateBulkResult extends CommonResult {
      data: GeolocateBulkData;
    }

    export interface DomainData {
      domain_found: boolean;
      domain?: string;
    }

    export interface DomainResult extends CommonResult {
      data: DomainData;
    }

    export interface DomainBulkData {
      [key: string]: DomainData;
    }

    export interface DomainBulkResult extends CommonResult {
      data: DomainBulkData;
    }

    export interface VPNData {
      is_vpn: boolean;
    }

    export interface VPNResult extends CommonResult {
      data: VPNData;
    }

    export interface VPNBulkData {
      [key: string]: VPNData;
    }

    export interface VPNBulkResult extends CommonResult {
      data: VPNBulkData;
    }

    export interface ProxyData {
      is_proxy: boolean;
    }

    export interface ProxyBulkData {
      [key: string]: ProxyData;
    }

    export interface ProxyResult extends CommonResult {
      data: ProxyData;
    }

    export interface ProxyBulkResult extends CommonResult {
      data: ProxyBulkData;
    }
  }

  export namespace User {
    export interface BreachedData {
      found_in_breach: boolean;
      breach_count: number;
    }

    export interface BreachedResult extends Intel.CommonResult {
      data: BreachedData;
    }

    export interface BreachedBulkData {
      [key: string]: BreachedData;
    }

    export interface BreachedBulkResult extends Intel.CommonResult {
      data: BreachedBulkData;
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

      export interface BreachedEmailBulkRequest extends BreachedOptions {
        emails: string[];
      }

      export interface BreachedUsernameBulkRequest extends BreachedOptions {
        usernames: string[];
      }

      export interface BreachedIPBulkRequest extends BreachedOptions {
        ips: string[];
      }

      export interface BreachedPhoneBulkRequest extends BreachedOptions {
        phone_numbers: string[];
      }

      export type BreachedBulkRequest =
        | BreachedEmailBulkRequest
        | BreachedIPBulkRequest
        | BreachedPhoneBulkRequest
        | BreachedUsernameBulkRequest;

      export interface BreachedBulkResult
        extends Intel.User.BreachedBulkResult {}
    }

    export namespace Password {
      export interface BreachedOptions extends Intel.Options {}

      export interface BreachedRequest extends BreachedOptions {
        hash_type: string;
        hash_prefix: string;
      }

      export interface BreachedBulkRequest extends BreachedOptions {
        hash_type: string;
        hash_prefixes: string[];
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

    /** Format-preserving encryption. */
    FPE = "fpe",
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
    Ed25519_DILITHIUM2_BETA = "ED25519-DILITHIUM2-BETA",
    Ed448_DILITHIUM3_BETA = "ED448-DILITHIUM3-BETA",
    SPHINCSPLUS_128F_SHAKE256_SIMPLE_BETA = "SPHINCSPLUS-128F-SHAKE256-SIMPLE-BETA",
    SPHINCSPLUS_128F_SHAKE256_ROBUST_BETA = "SPHINCSPLUS-128F-SHAKE256-ROBUST-BETA",
    SPHINCSPLUS_192F_SHAKE256_SIMPLE_BETA = "SPHINCSPLUS-192F-SHAKE256-SIMPLE-BETA",
    SPHINCSPLUS_192F_SHAKE256_ROBUST_BETA = "SPHINCSPLUS-192F-SHAKE256-ROBUST-BETA",
    SPHINCSPLUS_256F_SHAKE256_SIMPLE_BETA = "SPHINCSPLUS-256F-SHAKE256-SIMPLE-BETA",
    SPHINCSPLUS_256F_SHAKE256_ROBUST_BETA = "SPHINCSPLUS-256F-SHAKE256-ROBUST-BETA",
    SPHINCSPLUS_128F_SHA256_SIMPLE_BETA = "SPHINCSPLUS-128F-SHA256-SIMPLE-BETA",
    SPHINCSPLUS_128F_SHA256_ROBUST_BETA = "SPHINCSPLUS-128F-SHA256-ROBUST-BETA",
    SPHINCSPLUS_192F_SHA256_SIMPLE_BETA = "SPHINCSPLUS-192F-SHA256-SIMPLE-BETA",
    SPHINCSPLUS_192F_SHA256_ROBUST_BETA = "SPHINCSPLUS-192F-SHA256-ROBUST-BETA",
    SPHINCSPLUS_256F_SHA256_SIMPLE_BETA = "SPHINCSPLUS-256F-SHA256-SIMPLE-BETA",
    SPHINCSPLUS_256F_SHA256_ROBUST_BETA = "SPHINCSPLUS-256F-SHA256-ROBUST-BETA",
    FALCON_1024_BETA = "FALCON-1024-BETA",
  }

  export enum SymmetricAlgorithm {
    HS256 = "HS256",
    HS384 = "HS384",
    HS512 = "HS512",
    AES128_CFB = "AES-CFB-128",
    AES256_CFB = "AES-CFB-256",
    AES256_GCM = "AES-GCM-256",
    AES128_CBC = "AES-CBC-128",
    AES256_CBC = "AES-CBC-256",
    AES = "AES-CFB-128", // deprecated, use AES128_CFB instead

    /** 128-bit encryption using the FF3-1 algorithm. Beta feature. */
    AES128_FF3_1 = "AES-FF3-1-128-BETA",

    /** 256-bit encryption using the FF3-1 algorithm. Beta feature. */
    AES256_FF3_1 = "AES-FF3-1-256-BETA",
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
    INHERITED = "inherited",
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

  /** Character sets for format-preserving encryption. */
  export enum TransformAlphabet {
    /** Lowercase alphabet (a-z). */
    ALPHA_LOWER = "alphalower",

    /** Uppercase alphabet (A-Z). */
    ALPHA_UPPER = "alphaupper",

    /** Alphanumeric (a-z, A-Z, 0-9). */
    ALPHANUMERIC = "alphanumeric",

    /** Lowercase alphabet with numbers (a-z, 0-9). */
    ALPHANUMERIC_LOWER = "alphanumericlower",

    /** Uppercase alphabet with numbers (A-Z, 0-9). */
    ALPHANUMERIC_UPPER = "alphanumericupper",

    /** Numeric (0-9). */
    NUMERIC = "numeric",
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

  export interface InheritedSettigs {
    rotation_frequency?: string;
    rotation_state?: string;
    rotation_grace_period?: string;
  }

  export interface GetResult extends ItemData {
    rotation_grace_period?: string;
    versions: ItemVersionData[];
    inherited_settings?: InheritedSettigs;
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

    export interface GenerateRequest
      extends Common.GenerateRequest,
        Common.GenerateOptions {}

    export interface GenerateResult extends Common.GenerateRequest {
      secret: string;
    }

    export namespace Secret {
      export interface RotateOptions extends Common.RotateOptions {}
      export interface RotateRequest
        extends Common.RotateRequest,
          RotateOptions {
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
    export interface RotateOptions extends Common.RotateOptions {
      key?: EncodedSymmetricKey;
      public_key?: EncodedPublicKey;
      private_key?: EncodedPrivateKey;
    }

    export interface RotateRequest
      extends Common.RotateRequest,
        RotateOptions {}

    export interface RotateResult extends Common.RotateResult {
      algorithm: string;
      purpose: string;
      public_key?: EncodedPublicKey;
    }

    /**
     * Parameters for an encrypt/decrypt structured request.
     */
    export interface EncryptStructuredRequest<O = object> {
      /**
       * The ID of the key to use. It must be an item of type `symmetric_key` or
       * `asymmetric_key` and purpose `encryption`.
       */
      id: string;

      /**
       * Structured data for applying bulk operations.
       */
      structured_data: O;

      /**
       * A filter expression. It must point to string elements of the
       * `structured_data` field.
       */
      filter: string;

      /**
       * The item version. Defaults to the current version.
       */
      version?: number;

      /**
       * User provided authentication data.
       */
      additional_data?: string;
    }

    /**
     * Result of an encrypt/decrypt structured request.
     */
    export interface EncryptStructuredResult<O = object> {
      /**
       * The ID of the item.
       */
      id: string;

      /**
       * The item version.
       */
      version: number;

      /**
       * The algorithm of the key.
       */
      algorithm: string;

      /**
       * Structured data with filtered fields encrypted.
       */
      structured_data: O;
    }

    /** Parameters for an encrypt transform request. */
    export interface EncryptTransformRequest {
      /** The ID of the key to use. */
      id: string;

      /** Message to be encrypted. */
      plain_text: string;

      /** Set of characters to use for format-preserving encryption (FPE). */
      alphabet: TransformAlphabet;

      /**
       * User provided tweak string. If not provided, a random string will be
       * generated and returned. The user must securely store the tweak source
       * which will be needed to decrypt the data.
       */
      tweak?: string;

      /** The item version. Defaults to the current version. */
      version?: number;
    }

    /** Result of an encrypt transform request. */
    export interface EncryptTransformResult {
      /** The ID of the item. */
      id: string;

      /** The item version. */
      version: number;

      /** The algorithm of the key. */
      algorithm: string;

      /** The encrypted message. */
      cipher_text: string;

      /**
       * User provided tweak string. If not provided, a random string will be
       * generated and returned. The user must securely store the tweak source
       * which will be needed to decrypt the data.
       */
      tweak: string;

      /** Set of characters to use for format-preserving encryption (FPE). */
      alphabet: string;
    }

    /** Parameters for an decrypt transform request. */
    export interface DecryptTransformRequest {
      /** The ID of the key to use. */
      id: string;

      /** A message encrypted by Vault. */
      cipher_text: string;

      /**
       * User provided tweak string. If not provided, a random string will be
       * generated and returned. The user must securely store the tweak source
       * which will be needed to decrypt the data.
       */
      tweak: string;

      /** Set of characters to use for format-preserving encryption (FPE). */
      alphabet: TransformAlphabet;

      /** The item version. Defaults to the current version. */
      version?: number;
    }

    /** Result of an decrypt transform request. */
    export interface DecryptTransformResult {
      /** The ID of the item. */
      id: string;

      /** The item version. */
      version: number;

      /** The algorithm of the key. */
      algorithm: string;

      /** Decrypted message. */
      plain_text: string;
    }
  }

  export namespace Asymmetric {
    export interface GenerateOptions extends Common.GenerateOptions {}

    export interface GenerateRequest
      extends Common.GenerateRequest,
        GenerateOptions {
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

    export interface GenerateRequest
      extends Common.GenerateRequest,
        GenerateOptions {
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
      rotation_frequency?: string;
      rotation_state?: ItemVersionState;
      rotation_grace_period?: string;
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
    [key: string]: string | undefined;
    first_name?: string;
    last_name?: string;
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
    id: string;
    email: string;
    profile: Profile;
    verified: boolean;
    disabled: boolean;
    accepted_eula_id?: string;
    accepted_privacy_policy_id?: string;
    last_login_at?: string;
    created_at: string;
    login_count: number;
    last_login_ip?: string;
    last_login_city?: string;
    last_login_country?: string;
    authenticators?: AuthN.User.Authenticators.Authenticator[];
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

  export interface IPIntelligence {
    is_bad: boolean;
    is_vpn: boolean;
    is_proxy: boolean;
    reputation: Intel.ReputationData;
    geolocation: Intel.IP.GeolocateData;
  }

  export interface DomainIntelligence {
    is_bad: boolean;
    reputation: Intel.ReputationData;
  }

  export interface Intelligence {
    embargo: boolean;
    ip_intel: IPIntelligence;
    domain_intel: DomainIntelligence;
    user_intel: boolean;
  }

  export interface SessionToken {
    id: string;
    type: TokenType;
    life: number;
    expire: string;
    identity: string;
    email: string;
    scopes: Scopes;
    profile: Profile;
    created_at: string;
    intelligence?: Intelligence;
  }

  export interface LoginToken extends SessionToken {
    token: string;
  }

  export namespace Agreements {
    export enum AgreementType {
      EULA = "eula",
      PRIVACY_POLICY = "privacy_policy",
    }

    export interface CreateRequest {
      type: AgreementType;
      name: string;
      text: string;
      active?: boolean;
    }

    export interface AgreementInfo {
      type: string;
      id: string;
      created_at: string;
      updated_at: string;
      published_at: string;
      name: string;
      text: string;
      active: boolean;
    }

    export interface CreateResult extends AgreementInfo {}

    export interface DeleteRequest {
      type: AgreementType;
      id: string;
    }

    export interface DeleteResult {}

    export enum AgreementListOrderBy {
      ID = "id",
      CREATED_AT = "created_at",
      NAME = "name",
      TEXT = "text",
    }

    export interface ListFilter {
      active?: boolean;
      created_at?: string;
      created_at__gt?: string;
      created_at__gte?: string;
      created_at__lt?: string;
      created_at__lte?: string;
      published_at?: string;
      published_at__gt?: string;
      published_at__gte?: string;
      published_at__lt?: string;
      published_at__lte?: string;
      type?: string;
      type__contains?: string[];
      type__in?: string[];
      id?: string;
      id__contains?: string[];
      id__in?: string[];
      name?: string;
      name__contains?: string[];
      name__in?: string[];
      text?: string;
      text__contains?: string[];
      text__in?: string[];
    }

    export interface ListRequest {
      filter?: object | ListFilter;
      last?: string;
      order?: ItemOrder;
      order_by?: AgreementListOrderBy;
      size?: number;
    }

    export interface ListResult {
      agreements: AgreementInfo[];
      count: number;
      last?: string;
    }

    export interface UpdateRequest {
      type: AgreementType;
      id: string;
      name?: string;
      text?: string;
      active?: boolean;
    }

    export interface UpdateResult extends AgreementInfo {}
  }

  export namespace Flow {
    export enum Choice {
      AGREEMENTS = "agreements",
      CAPTCHA = "captcha",
      EMAIL_OTP = "email_otp",
      MAGICLINK = "magiclink",
      PASSWORD = "password",
      PROFILE = "profile",
      PROVISIONAL_ENROLLMENT = "provisional_enrollment",
      RESET_PASSWORD = "reset_password",
      SET_EMAIL = "set_mail",
      SET_PASSWORD = "set_password",
      SMS_OTP = "sms_otp",
      SOCIAL = "social",
      TOTP = "totp",
      VERIFY_EMAIL = "verify_email",
    }

    export interface ChoiceItem {
      choice: string;
      data: Dictionary;
    }

    export interface Result {
      flow_id: string;
      flow_type: string[];
      email: string;
      disclaimer?: string;
      flow_phase: string;
      flow_choices: Flow.ChoiceItem[];
    }

    export interface CompleteRequest {
      flow_id: string;
    }

    export interface CompleteResult {
      refresh_token: LoginToken;
      active_token?: LoginToken;
    }

    export interface StartRequest {
      cb_uri?: string;
      email?: string;
      flow_types?: FlowType[];
      invitation?: string;
    }

    export interface StartResult extends Flow.Result {}

    export namespace Restart {
      export interface DataSMSOTP {
        phone: string;
      }

      export type Data = Dictionary | DataSMSOTP;
    }

    export interface RestartRequest {
      flow_id: string;
      choice: Choice;
      data: Restart.Data;
    }

    export interface RestartResult extends Flow.Result {}

    export namespace Update {
      export interface DataAgreements {
        agreed: string[];
      }

      export interface DataCaptcha {
        code: string;
      }

      export interface DataEmailOTP {
        code: string;
      }

      export interface DataMagiclink {
        state: string;
        code: string;
      }

      export interface DataPassword {
        password: string;
      }

      export interface DataProfile {
        profile: Profile;
      }

      export interface DataProvisionalEnrollment {
        state: string;
        code: string;
      }

      export interface DataResetPassword {
        state: string;
        code: string;
      }

      export interface DataSetEmail {
        email: string;
      }

      export interface DataSetPassword {
        password: string;
      }

      export interface DataSMSOTP {
        code: string;
      }

      export interface DataSocialProvider {
        social_provider: string;
        uri: string;
      }

      export interface DataTOTP {
        code: string;
      }

      export interface DataVerifyEmail {
        state: string;
        code: string;
      }

      export type Data =
        | Dictionary
        | DataAgreements
        | DataCaptcha
        | DataEmailOTP
        | DataMagiclink
        | DataPassword
        | DataProfile
        | DataProvisionalEnrollment
        | DataResetPassword
        | DataSetEmail
        | DataSetPassword
        | DataSMSOTP
        | DataSocialProvider
        | DataTOTP
        | DataVerifyEmail;
    }

    export interface UpdateRequest {
      flow_id: string;
      choice: Flow.Choice;
      data: Flow.Update.Data;
    }

    export interface UpdateResult extends Flow.Result {}
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

      export interface CheckResult extends LoginToken {}
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
        filter?: Object | AuthN.Session.ListFilter;
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

    export interface ListFilter {
      active_token_id?: string;
      active_token_id__contains?: string[];
      active_token_id__in?: string[];
      created_at?: string;
      created_at__gt?: string;
      created_at__gte?: string;
      created_at__lt?: string;
      created_at__lte?: string;
      email?: string;
      email__contains?: string[];
      email__in?: string[];
      expire?: string;
      expire__gt?: string;
      expire__gte?: string;
      expire__lt?: string;
      expire__lte?: string;
      id?: string;
      id__contains?: string[];
      id__in?: string[];
      identity?: string;
      identity__contains?: string[];
      identity__in?: string[];
      scopes?: string[];
      type?: string;
      type__contains?: string[];
      type__in?: string[];
    }

    export interface ListRequest {
      filter?: Object | ListFilter;
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
    export interface CreateOptions {}

    export interface CreateRequest extends CreateOptions {
      email: string;
      profile: Profile;
    }

    export interface CreateResult {
      id: string;
      email: string;
      profile: Profile;
      scopes?: Scopes;
      id_providers: string[];
      mfa_provider?: MFAProvider[];
      require_mfa: boolean;
      verified: boolean;
      disable: boolean;
      accepted_eula_id?: string;
      last_login_at?: string;
      created_at: string;
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

    export interface InviteRequest {
      inviter: string;
      email: string;
      callback: string;
      state: string;
    }

    export interface InviteResult extends InviteItem {}

    export namespace Delete {
      export interface EmailRequest {
        email: string;
      }

      export interface IDRequest {
        id: string;
      }
    }

    export enum ListOrderBy {
      ID = "id",
      CREATED_AT = "created_at",
      LAST_LOGIN_AT = "last_login_at",
      EMAIL = "email",
    }

    export interface ListFilter {
      accepted_eula_id?: string;
      accepted_eula_id__contains?: string[];
      accepted_eula_id__in?: string[];
      created_at?: string;
      created_at__gt?: string;
      created_at__gte?: string;
      created_at__lt?: string;
      created_at__lte?: string;
      disabled?: boolean;
      email?: string;
      email__contains?: string[];
      email__in?: string[];
      id?: string;
      id__contains?: string[];
      id__in?: string[];
      last_login_at?: string;
      last_login_at__gt?: string;
      last_login_at__gte?: string;
      last_login_at__lt?: string;
      last_login_at__lte?: string;
      last_login_ip?: string;
      last_login_ip__contains?: string[];
      last_login_ip__in?: string[];
      last_login_city?: string;
      last_login_city__contains?: string[];
      last_login_city__in?: string[];
      last_login_country?: string;
      last_login_country__contains?: string[];
      last_login_country__in?: string[];
      login_count?: number;
      login_count__gt?: number;
      login_count__gte?: number;
      login_count__lt?: number;
      login_count__lte?: number;
      require_mfa?: boolean;
      scopes?: string[];
      verified?: boolean;
    }

    export interface ListRequest {
      filter?: Object | ListFilter;
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

      export interface ListFilter {
        callback?: string;
        callback__contains?: string[];
        callback__in?: string[];
        created_at?: string;
        created_at__gt?: string;
        created_at__gte?: string;
        created_at__lt?: string;
        created_at__lte?: string;
        email?: string;
        email__contains?: string[];
        email__in?: string[];
        expire?: string;
        expire__gt?: string;
        expire__gte?: string;
        expire__lt?: string;
        expire__lte?: string;
        id?: string;
        id__contains?: string[];
        id__in?: string[];
        invite_org?: string;
        invite_org__contains?: string[];
        invite_org__in?: string[];
        inviter?: string;
        inviter__contains?: string[];
        inviter__in?: string[];
        is_signup?: boolean;
        require_mfa?: boolean;
        state?: string;
        state__contains?: string[];
        state__in?: string[];
      }

      export interface ListRequest {
        filter?: Object | ListFilter;
        last?: string;
        order?: ItemOrder;
        order_by?: OrderBy;
        size?: number;
      }

      export interface ListResult {
        invites: InviteItem[];
      }
    }

    export namespace Authenticators {
      export namespace Delete {
        export interface IDRequest {
          id: string;
          authenticator_id: string;
        }

        export interface EmailRequest {
          email: string;
          authenticator_id: string;
        }
      }

      export interface ListRequest {
        email?: string;
        id?: string;
      }

      export interface Authenticator {
        id: string;
        type: string;
        enable: boolean;
        provider?: string;
        rpid: string;
        phase: string;
      }

      export interface ListResult {
        authenticators: Authenticator[];
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
        export interface Common {
          profile: Profile;
        }

        export interface EmailRequest extends Common {
          email: string;
        }

        export interface IDRequest extends Common {
          id: string;
        }
      }

      export interface UpdateResult extends UserItem {}
    }

    export namespace Update {
      export interface Options {
        disabled?: boolean;
        unlock?: boolean;
      }

      export interface EmailRequest extends Options {
        email: string;
      }

      export interface IDRequest extends Options {
        id: string;
      }
    }

    export interface UpdateResult extends UserItem {}
  }
}

export namespace AuthZ {
  export enum ItemOrder {
    ASC = "asc",
    DESC = "desc",
  }
  export enum TupleOrderBy {
    RESOURCE_NAMESPACE = "resource_namespace",
    RESOURCE_ID = "resource_id",
    RELATION = "relation",
    SUBJECT_NAMESPACE = "subject_namespace",
    SUBJECT_ID = "subject_id",
    SUBJECT_ACTION = "subject_action",
  }

  export interface Resource {
    type: string;
    id?: string;
  }

  export interface Subject {
    type: string;
    id: string;
    action?: string;
  }

  export interface Tuple {
    resource: Resource;
    relation: string;
    subject: Subject;
  }

  export interface TupleCreateRequest {
    tuples: Tuple[];
  }

  export interface TupleCreateResult {}

  export interface TupleListFilter {
    resource_type?: string;
    resource_type__contains?: string[];
    resource_type__in?: string[];
    resource_id?: string;
    resource_id__contains?: string[];
    resource_id__in?: string[];
    relation?: string;
    relation__contains?: string[];
    relation__in?: string[];
    subject_type?: string;
    subject_type__contains?: string[];
    subject_type__in?: string[];
    subject_id?: string;
    subject_id__contains?: string[];
    subject_id__in?: string[];
    subject_action?: string;
    subject_action__contains?: string[];
    subject_action__in?: string[];
  }

  export interface TupleListRequest {
    filter: TupleListFilter;
    size?: number;
    last?: string;
    order?: ItemOrder;
    order_by?: TupleOrderBy;
  }

  export interface TupleListResult {
    tuples: Tuple[];
    last: string;
    count: number;
  }

  export interface TupleDeleteRequest {
    tuples: Tuple[];
  }

  export interface TupleDeleteResult {}

  export interface CheckRequest {
    resource: Resource;
    action: string;
    subject: Subject;
    debug?: boolean;
    attributes?: Dictionary;
  }

  export interface DebugPath {
    type: string;
    id: string;
    action: string;
  }

  export interface Debug {
    path: DebugPath[];
  }

  export interface CheckResult {
    schema_id: string;
    schema_version: number;
    depth: number;
    allowed: boolean;
    debug?: Debug;
  }

  export interface ListResourcesRequest {
    type: string;
    action: string;
    subject: Subject;
  }

  export interface ListResourcesResult {
    ids: string[];
  }

  export interface ListSubjectsRequest {
    resource: Resource;
    action: string;
  }

  export interface ListSubjectsResult {
    subjects: Subject[];
  }
}
