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
    redacted_data: string;
  }

  export interface StructuredResponse {
    redacted_data: object;
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

  export interface Response {
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
  export const KeyPairPurpose = {
    SIGNING: "signing",
    ENCRYPTION: "encryption",
  };

  export const KeyPairAlgorithm = {
    Ed25519: "ed25519",
    RSA: "rsa",
  };

  export const KeyAlgorithm = {
    AES: "aes",
  };

  export const ItemType = {
    ASYMMETRIC_KEY: "asymmetric_key",
    SYMMETRIC_KEY: "symmetric_key",
    SECRET: "secret",
    MASTER_KEY: "master_key",
  };

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

  export interface RevokeRequest {
    id: string;
  }

  export interface RevokeResult {
    id: string;
  }

  export interface DeleteRequest {
    id: string;
  }

  export interface DeleteResult {
    id: string;
  }

  export interface ListItemData {
    //FIXME: check with Diego this fields, some are left from docs https://dev.pangea.cloud/docs/api/vault#list
    id: string;
    version: number;
    type: string;
    name?: string;
    folder?: string;
    metadata?: Metadata;
    tags?: Tags;
    rotation_policy?: string;
    next_rotation?: string;
    expiration?: string;
    created_at?: string;
    revoked_at?: string;
    managed?: boolean;
    identity: string;
  }

  export interface ListFolderData {
    type: string;
    name?: string;
    folder?: string;
  }

  export interface ListResult {
    items: [ListItemData | ListFolderData][];
    count: number;
    last?: string;
  }

  export interface ListOptions {
    filter?: Object;
    restrictions?: Object;
    last?: string;
    size?: number;
    order?: string;
    order_by?: string;
  }

  export interface UpdateOptions {
    name?: string;
    folder?: string;
    metadata?: Metadata;
    tags?: Tags;
    auto_rotate?: boolean;
    rotation_policy?: string;
    expiration?: string;
  }

  export interface UpdateRequest extends UpdateOptions {
    id: string;
  }

  export interface UpdateResult {
    id: string;
  }

  export interface GetRequest {
    id: string;
  }

  export interface GetOptions {
    version?: number;
    verbose?: boolean;
  }

  export interface GetResult {
    id: string;
    type: string;
    version: number;
    name?: string;
    folder?: string;
    metadata?: Metadata;
    tags?: Tags;
    auto_rotate?: boolean;
    rotation_policy?: string;
    last_rotated?: string;
    next_rotation?: string;
    retaion_previous_version?: boolean;
    expiration?: string;
    created_at?: string;
    revoked_at?: string;
    public_key?: EncodedPublicKey;
    private_key?: EncodedPrivateKey;
    algorithm?: string; // Should be KeyPairAlgorithm | KeyAlgorithm;
    purpose?: string; // Should be KeyPairPurpose
    key?: EncodedSymmetricKey;
    managed?: boolean;
    secret?: string;
  }

  export namespace Common {
    export interface StoreOptions {
      name?: string;
      folder?: string;
      metadata?: Metadata;
      tags?: Tags;
      auto_rotate?: boolean;
      rotation_policy?: string;
      retain_previous_version?: boolean;
      expiration?: string;
      managed?: boolean;
    }

    export interface StoreRequest {
      type: string; // should be some of Vault.ItemType;
    }

    export interface StoreResult {
      id: string;
      type: string;
      version: number;
    }

    export interface GenerateRequest {
      type: string; // should be some of Vault.ItemType;
    }

    export interface GenerateOptions {
      name?: string;
      folder?: string;
      metadata?: Metadata;
      tags?: Tags;
      auto_rotate?: boolean;
      rotation_policy?: string;
      retain_previous_version?: boolean;
      store?: boolean;
      expiration?: string;
      managed?: boolean;
    }

    export interface GenerateResult {
      id: string;
      type?: string;
      version?: number;
    }

    export interface RotateRequest {
      id: string;
    }

    export interface RotateResult {
      id: string;
      version: number;
      type: string;
    }

    export interface RotateGenericKeyOptions {
      public_key?: EncodedPublicKey;
      private_key?: EncodedPrivateKey;
      key?: EncodedSymmetricKey;
    }

    export interface RotateGenericKeyRequest extends RotateRequest, RotateGenericKeyOptions {}

    export interface RotateGenericKeyResult {
      public_key?: EncodedPublicKey;
      private_key?: EncodedPrivateKey;
      key?: EncodedSymmetricKey;
    }
  }

  export namespace Secret {
    export const Algorithm = {
      BASE32: "base32",
    };

    export interface StoreOptions extends Common.StoreOptions {}

    export interface StoreRequest extends Common.StoreRequest, StoreOptions {
      secret: string;
      type: string;
    }

    export interface StoreResult extends Common.StoreResult {
      secret: string;
    }

    export interface GenerateRequest extends Common.GenerateRequest, Common.GenerateOptions {}

    export interface GenerateResult extends Common.GenerateRequest {
      secret: string;
    }

    export interface RotateRequest extends Common.RotateRequest {
      secret: string;
    }

    export interface RotateResult extends Common.RotateResult {
      secret: string;
    }
  }

  export namespace Asymmetric {
    export interface GenerateOptions extends Common.GenerateOptions {
      algorithm?: string; // Should be KeyPairAlgorithm
      purpose?: string; // Should be KeyPairPurpose
    }

    export interface GenerateRequest extends Common.GenerateRequest, GenerateOptions {}

    export interface GenerateResult extends Common.GenerateResult {
      algorithm: string;
      public_key: EncodedPublicKey;
      private_key?: EncodedPrivateKey;
    }

    export interface StoreOptions extends Common.StoreOptions {
      purpose?: string; // Should be KeyPairPurpose
    }

    export interface StoreRequest extends Common.StoreRequest, StoreOptions {
      algorithm: string;
      public_key: EncodedPublicKey;
      private_key: EncodedPrivateKey;
    }

    export interface StoreResult extends Common.StoreResult {
      public_key: EncodedPublicKey;
      private_key?: EncodedPrivateKey;
      algorithm: string;
    }

    export interface RotateOptions {
      public_key?: EncodedPublicKey;
      private_key?: EncodedPrivateKey;
    }

    export interface RotateRequest extends RotateOptions, Common.RotateRequest {}

    export interface RotateResult extends Common.RotateResult {
      public_key: EncodedPublicKey;
      private_key?: EncodedPrivateKey;
      algorithm?: string;
    }

    export interface SignRequest {
      id: string;
      message: string;
    }

    export interface SignResult {
      id: string;
      version: number;
      signature: string;
      algorithm: string; // Should be KeyPairAlgorithm
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
      algorithm: string; // Should be KeyPairAlgorithm
      valid_signature: boolean;
    }
  }

  export namespace Symmetric {
    export interface StoreOptions extends Common.StoreOptions {
      managed?: boolean;
    }

    export interface StoreRequest extends Common.StoreRequest, StoreOptions {
      key: EncodedSymmetricKey;
      algorithm: string; // Should be KeyAlgorithm
    }

    export interface StoreResult extends Common.StoreResult {
      algorithm?: string; // Should be KeyAlgorithm   # FIXME: Remove optional once backend is updated
      key?: EncodedSymmetricKey;
    }

    export interface GenerateOptions extends Common.GenerateOptions {
      algorithm?: string; // Should be KeyAlgorithm
      managed?: boolean;
    }

    export interface GenerateRequest extends Common.GenerateRequest, GenerateOptions {}

    export interface GenerateResult extends Common.GenerateResult {
      algorithm: string; //Should be KeyAlgorithm
      key?: EncodedSymmetricKey;
    }

    export interface EncryptRequest {
      id: string;
      plain_text: string;
    }

    export interface EncryptResult {
      id: string;
      version: number;
      algorithm: string; // Should be KeyAlgorithm
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
      algorithm: string; // Should be KeyAlgorithm
      plain_text: string;
    }

    export interface RotateOptions {
      key?: string;
    }

    export interface RotateRequest extends Common.RotateRequest, RotateOptions {}

    export interface RotateResult extends Common.RotateResult {
      key?: string;
      algorithm: string;
    }
  }
}
