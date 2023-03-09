import { Signer } from "utils/signer";

/**
 * PangeaConfig options
 */
export interface ConfigOptions {
  domain?: string;
  environment?: string;
  requestRetries?: number;
  requestTimeout?: number;
  queuedRetryEnabled?: boolean;
  aqueuedRetries?: number;
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
    publicKeyInfo?: Object; // Key:Value object
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
    tenant_id?: string;
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
    export interface GeolocateResult extends CommonResponse {
      data: {
        country: string;
        city: string;
        latitude: number;
        longitude: number;
        postal_code: string;
        country_code: string;
      };
    }

    export interface DomainResult extends CommonResponse {
      data: {
        domain_found: boolean;
        domain?: string;
      };
    }

    export interface VPNResult extends CommonResponse {
      data: {
        is_vpn: boolean;
      };
    }

    export interface ProxyResult extends CommonResponse {
      data: {
        is_proxy: boolean;
      };
    }
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

  export interface CommonResponse {
    parameter?: Object;
    raw_data?: Object;
  }

  export interface Response extends CommonResponse {
    data: {
      category: string[];
      score: number;
      verdict: string;
    };
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
    Ed25519 = "ed25519",
    RSA = "rsa",
    ES256 = "es256",
    ES384 = "es384",
    ES512 = "es512",
  }

  export enum SymmetricAlgorithm {
    AES = "aes",
    HS256 = "hs256",
    HS384 = "hs384",
    HS512 = "hs512",
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
    id?: string;
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

    export interface JWKSet {
      keys: [JWKrsa | JWKec][];
    }

    export interface GetResult {
      jwk: JWKSet;
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
}
