import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { PangeaToken, Vault } from "@src/types.js";

/**
 * VaultService class provides methods for interacting with the Vault Service
 * @extends BaseService
 */
class VaultService extends BaseService {
  /**
   * Creates a new `VaultService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ baseURLTemplate: "https://{SERVICE_NAME}/aws.us.pangea.cloud" });
   * const vault = new VaultService("pangea_token", config);
   * ```
   *
   * @summary Vault
   */
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("vault", token, config);
  }

  /**
   * @summary State change
   * @description Change the state of a specific version of a secret or key.
   * @operationId vault_post_v2_state_change
   * @param {Vault.StateChangeRequest} request - State change options. The following options are supported:
   *   - id (string):  The item ID
   *   - state (Vault.ItemVersionState): The new state of the item version
   *   - version (number): the item version
   *   - destroy_period (string): Period of time for the destruction of a compromised key.
   *     Only valid if state=`compromised`
   * @returns {Promise} - A promise representing an async call to the state change endpoint
   * @example
   * ```js
   * const response = await vault.stateChange( {
   *   id: "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   state: Vault.ItemVersionState.DEACTIVATED
   * });
   * ```
   */
  async stateChange(
    request: Vault.StateChangeRequest
  ): Promise<PangeaResponse<Vault.StateChangeResult>> {
    return this.post("v2/state/change", request);
  }

  /**
   * @summary Delete
   * @description Delete a secret or key.
   * @operationId vault_post_v2_delete
   * @param {String} id - The item ID
   * @returns {Promise} - A promise representing an async call to the delete endpoint
   * @example
   * ```js
   * const response = await vault.delete(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5"
   * );
   * ```
   */
  async delete(id: string): Promise<PangeaResponse<Vault.DeleteResult>> {
    const data: Vault.DeleteRequest = {
      id: id,
    };

    return this.post("v2/delete", data);
  }

  /**
   * @summary Retrieve
   * @description Retrieve a secret or key, and any associated information.
   * @operationId vault_post_v2_get
   * @param {Vault.GetRequest} request - The following options are supported:
   *   - id (string): The item ID
   *   - version (number | string): The key version(s).
   *     `all` for all versions, `num` for a specific version,
   *      `-num` for the `num` latest versions.
   *   - version_state (Vault.ItemVersionState): The state of the item version
   *   - verbose (boolean): Return metadata and extra fields
   * @returns {Promise} - A promise representing an async call to the get endpoint
   * @example
   * ```js
   * const response = await vault.getItem(
   *   {
   *     id: "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *     version: 1,
   *     version_state: Vault.ItemVersionState.ACTIVE,
   *     verbose: true,
   *   }
   * );
   * ```
   */
  async getItem(
    request: Vault.GetRequest
  ): Promise<PangeaResponse<Vault.GetResult>> {
    return this.post("v2/get", request);
  }

  /**
   * @summary Get Bulk
   * @description Retrieve a list of secrets, keys and folders.
   * @operationId vault_post_v2_get_bulk
   * @param {Vault.GetBulkRequest} request - The following options are supported:
   *   - filter (object): A set of filters to help you customize your search. Examples:
   *     `"folder": "/tmp"`, `"tags": "personal"`, `"name__contains": "xxx"`, `"created_at__gt": "2020-02-05T10:00:00Z"`
   *     For metadata, use: `"metadata_": "<value>"`
   *   - last (string): Internal ID returned in the previous look up response. Used for pagination.
   *   - order: (Vault.ItemOrder): Ordering direction
   *   - order_by: (Vault.ItemOrderBy): Property used to order the results
   *   - size: (number): Maximum number of items in the response
   * @returns {Promise} - A promise representing an async call to the get_bulk endpoint
   * @example
   * ```js
   * const response = await vault.getBulk(
   *   {
   *     filter: {
   *       folder: "/",
   *       type: "asymmetric_key",
   *       name__contains: "test",
   *       metadata_key1: "value1",
   *       created_at__lt: "2023-12-12T00:00:00Z",
   *     },
   *     last: "WyIvdGVzdF8yMDdfc3ltbWV0cmljLyJd",
   *     order: Vault.ItemOrder.ASC,
   *     order_by: Vault.ItemOrderby.NAME,
   *     size=20,
   *   }
   * );
   * ```
   */
  async getBulk(
    request: Vault.GetBulkRequest
  ): Promise<PangeaResponse<Vault.ListResult>> {
    return this.post("v2/get_bulk", request);
  }

  /**
   * @summary List
   * @description Look up a list of secrets, keys and folders, and their associated information.
   * @operationId vault_post_v2_list
   * @param {Vault.ListRequest} request - The following options are supported:
   *   - filter (object): A set of filters to help you customize your search. Examples:
   *     `"folder": "/tmp"`, `"tags": "personal"`, `"name__contains": "xxx"`, `"created_at__gt": "2020-02-05T10:00:00Z"`
   *     For metadata, use: `"metadata_": "<value>"`
   *   - last (string): Internal ID returned in the previous look up response. Used for pagination.
   *   - order: (Vault.ItemOrder): Ordering direction
   *   - order_by: (Vault.ItemOrderBy): Property used to order the results
   *   - size: (number): Maximum number of items in the response
   * @returns {Promise} - A promise representing an async call to the list endpoint
   * @example
   * ```js
   * const response = await vault.list(
   *   {
   *     filter: {
   *       folder: "/",
   *       type: "asymmetric_key",
   *       name__contains: "test",
   *       metadata_key1: "value1",
   *       created_at__lt: "2023-12-12T00:00:00Z",
   *     },
   *     last: "WyIvdGVzdF8yMDdfc3ltbWV0cmljLyJd",
   *     order: Vault.ItemOrder.ASC,
   *     order_by: Vault.ItemOrderby.NAME,
   *     size=20,
   *   }
   * );
   * ```
   */
  async list(
    request: Vault.ListRequest = {}
  ): Promise<PangeaResponse<Vault.ListResult>> {
    return this.post("v2/list", request);
  }

  /**
   * @summary Update
   * @description Update information associated with a secret or key.
   * @operationId vault_post_v2_update
   * @param {Vault.UpdateRequest} request - The following options are supported:
   *   - id (string): The item ID
   *   - name (string): The name of this item
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[], optional): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations
   *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
   *   - rotation_grace_period (string): Grace period for the previous version of the Pangea Token
   *   - expiration (string): Expiration timestamp
   *   - item_state (string): The new state of the item.
   * @returns {Promise} - A promise representing an async call to the update endpoint
   * @example
   * ```js
   * const response = await vault.update(
   *   {
   *     id: "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *     name: "my-very-secret-secret",
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
   *     rotation_grace_period: "1d",
   *     expiration: "2025-01-01T10:00:00Z",
   *     item_state: Vault.ItemState.DISABLED,
   *   }
   * );
   * ```
   */
  async update(
    request: Vault.UpdateRequest
  ): Promise<PangeaResponse<Vault.UpdateResult>> {
    return this.post("v2/update", request);
  }

  /**
   * @summary Secret store
   * @description Import a secret.
   * @operationId vault_post_v2_secret_store 1
   * @param {Vault.Secret.StoreRequest} request - The following options are supported:
   *   - secret (string): The secret value
   *   - token (string): The Pangea Token value
   *   - client_secret (string): The oauth client secret
   *   - client_id (string): The oauth client ID
   *   - client_secret_id (string): The oauth client secret ID
   *   - name (string): The name of this item
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[]): A list of user-defined tags
   *   - rotation_grace_period (string): Grace period for the previous version of the secret
   *   - rotation_frequency (string): Period of time between item rotations
   *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the secret store endpoint
   * @example
   * ```js
   * const response = await vault.secretStore(
   *   {
   *     secret: "12sdfgs4543qv@#%$casd",
   *     name: "my-very-secret-secret",
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async secretStore(
    request: Vault.Secret.StoreRequest
  ): Promise<PangeaResponse<Vault.Secret.StoreResult>> {
    return this.post("v2/secret/store", request);
  }

  /**
   * @summary Secret rotate
   * @description Rotate a secret.
   * @operationId vault_post_v2_secret_rotate 1
   * @param {Vault.Secret.RotateRequest} request - The following options are supported:
   *   - id (string): The item ID
   *   - secret (string): The secret value
   *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
   *     Default is `deactivated`.
   * @returns {Promise} - A promise representing an async call to the secret rotate endpoint
   * @example
   * ```js
   * const response = await vault.secretRotate(
   *   {
   *     id: "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *     secret: "12sdfgs4543qv@#%$casd",
   *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
   *   }
   * );
   * ```
   */
  async secretRotate(
    request: Vault.Secret.RotateRequest
  ): Promise<PangeaResponse<Vault.Secret.RotateResult>> {
    return this.post("v2/secret/rotate", request);
  }

  /**
   * @summary Symmetric generate
   * @description Generate a symmetric key.
   * @operationId vault_post_v2_key_generate 2
   * @param {Vault.Symmetric.GenerateRequest} request - The following options are supported:
   *   - algorithm (Vault.SymmetricAlgorithm): The algorithm of the key. Options
   * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/generate-a-key#generating-a-symmetric-key).
   *   - purpose (Vault.KeyPurpose): The purpose of this key
   *   - name (string): The name of this item
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[]): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
   *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the key generate endpoint
   * @example
   * ```js
   * const response = await vault.symmetricGenerate(
   *   {
   *     algorithm: Vault.SymmetricAlgorithm.AES128_CFB,
   *     purpose: Vault.KeyPurpose.ENCRYPTION,
   *     name: "my-very-secret-secret",
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async symmetricGenerate(
    request: Vault.Symmetric.GenerateRequest
  ): Promise<PangeaResponse<Vault.Symmetric.GenerateResult>> {
    request.type = Vault.ItemType.SYMMETRIC_KEY;
    return this.post("v2/key/generate", request);
  }

  /**
   * @summary Asymmetric generate
   * @description Generate an asymmetric key.
   * @operationId vault_post_v2_key_generate 1
   * @param {Vault.Asymmetric.GenerateOptions} options - The following options are supported:
   *   - algorithm (Vault.AsymmetricAlgorithm): The algorithm of the key. Options
   * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/generate-a-key#generating-asymmetric-key-pairs).
   *   - purpose (Vault.KeyPurpose): The purpose of this key
   *   - name (string): The name of this item
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[]): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
   *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the key generate endpoint
   * @example
   * ```js
   * const response = await vault.asymmetricGenerate(
   *   {
   *     algorithm: Vault.AsymmetricAlgorithm.RSA2048_PKCS1V15_SHA256,
   *     purpose: Vault.KeyPurpose.SIGNING,
   *     name: "my-very-secret-secret",
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async asymmetricGenerate(
    request: Vault.Asymmetric.GenerateRequest
  ): Promise<PangeaResponse<Vault.Asymmetric.GenerateResult>> {
    request.type = Vault.ItemType.ASYMMETRIC_KEY;
    return this.post("v2/key/generate", request);
  }

  /**
   * @summary Asymmetric store
   * @description Import an asymmetric key.
   * @operationId vault_post_v2_key_store 1
   * @param {Vault.Asymmetric.StoreRequest} request - The following options are supported:
   *   - private_key (Vault.EncodedPrivateKey): The private key in PEM format
   *   - public_key (Vault.EncodedPublicKey): The public key in PEM format
   *   - algorithm (Vault.AsymmetricAlgorithm): The algorithm of the key. Options
   * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/import-a-key#importing-an-asymmetric-key-pair).
   *   - purpose (Vault.KeyPurpose): The purpose of this key. `signing`, `encryption`, or `jwt`.
   *   - name (string): The name of this item
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[]): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
   *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the key store endpoint
   * @example
   * ```js
   * const response = await vault.asymmetricStore(
   *   {
   *     private_key: "private key example",
   *     public_key: "-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEA8s5JopbEPGBylPBcMK+L5PqHMqPJW/5KYPgBHzZGncc=\n-----END PUBLIC KEY-----",
   *     algorithm: Vault.AsymmetricAlgorithm.RSA2048_PKCS1V15_SHA256,
   *     purpose: Vault.KeyPurpose.SIGNING,
   *     name: "my-very-secret-secret",
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async asymmetricStore(
    request: Vault.Asymmetric.StoreRequest
  ): Promise<PangeaResponse<Vault.Asymmetric.StoreResult>> {
    request.type = Vault.ItemType.ASYMMETRIC_KEY;
    return this.post("v2/key/store", request);
  }

  /**
   * @summary Symmetric store
   * @description Import a symmetric key.
   * @operationId vault_post_v2_key_store 2
   * @param {Vault.Asymmetric.StoreRequest} request - The following options are supported:
   *   - key (string): The key material (in base64)
   *   - algorithm (Vault.SymmetricAlgorithm): The algorithm of the key. Options
   * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/import-a-key#importing-a-symmetric-key).
   *   - purpose (Vault.KeyPurpose): The purpose of this key. `encryption` or `jwt`
   *   - name (string): The name of this item
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[]): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
   *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the key store endpoint
   * @example
   * ```js
   * const response = await vault.symmetricStore(
   *   {
   *     keY: "lJkk0gCLux+Q+rPNqLPEYw==",
   *     algorithm: Vault.SymmetricAlgorithm.AES128_CFB,
   *     purpose: Vault.KeyPurpose.ENCRYPTION,
   *     name: "my-very-secret-secret",
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async symmetricStore(
    request: Vault.Symmetric.StoreRequest
  ): Promise<PangeaResponse<Vault.Symmetric.StoreResult>> {
    request.type = Vault.ItemType.SYMMETRIC_KEY;
    return this.post("v2/key/store", request);
  }

  /**
   * @summary Key rotate
   * @description Manually rotate a symmetric or asymmetric key.
   * @operationId vault_post_v2_key_rotate
   * @param {Vault.Key.RotateRequest} request - Supported options:
   *   - id (string): The ID of the item
   *   - rotation_state (Vault.ItemVersionState): State to which the previous version should transition upon rotation.
   *     `deactivated`, `suspended`, or `destroyed`. Default is `deactivated`.
   *   - public_key (string): The public key (in PEM format)
   *   - private_key: (string): The private key (in PEM format)
   *   - key: (string): The key material (in base64)
   * @returns {Promise} - A promise representing an async call to the key rotate endpoint
   * @example
   * ```js
   * const response = await vault.keyRotate(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   {
   *     rotation_state: Vault.ItemVersionState.DEACTIVATED,
   *     key: "lJkk0gCLux+Q+rPNqLPEYw==",
   *   }
   * );
   * ```
   */
  async keyRotate(
    request: Vault.Key.RotateRequest
  ): Promise<PangeaResponse<Vault.Key.RotateResult>> {
    return this.post("v2/key/rotate", request);
  }

  /**
   * @summary Encrypt
   * @description Encrypt a message using a key.
   * @operationId vault_post_v2_key_encrypt
   * @param {Vault.Symmetric.EncryptRequest} request - Supported options:
   *   - id (string) The item ID
   *   - plainText (string): A message to be in encrypted (in base64)
   * @returns {Promise} - A promise representing an async call to the key encrypt endpoint
   * @example
   * ```js
   * const response = await vault.encrypt({
   *   id: "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   plain_text: "lJkk0gCLux+Q+rPNqLPEYw=="
   * });
   * ```
   */
  async encrypt(
    request: Vault.Symmetric.EncryptRequest
  ): Promise<PangeaResponse<Vault.Symmetric.EncryptResult>> {
    return this.post("v2/encrypt", request);
  }

  /**
   * @summary Decrypt
   * @description Decrypt a message using a key.
   * @operationId vault_post_v2_key_decrypt
   * @param {Object} request - Supported options:
   *   - id (string): The item ID
   *   - cipher_text (string): A message encrypted by Vault (in base64)
   *   - version (number): The item version
   * @returns {Promise} - A promise representing an async call to the key decrypt endpoint
   * @example
   * ```js
   * const response = await vault.decrypt({
   *   id: "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   cipher_text: "lJkk0gCLux+Q+rPNqLPEYw==",
   *   version: 1
   * });
   * ```
   */
  async decrypt(
    request: Vault.Symmetric.DecryptRequest
  ): Promise<PangeaResponse<Vault.Symmetric.DecryptResult>> {
    return this.post("v2/decrypt", request);
  }

  /**
   * @summary Sign
   * @description Sign a message using a key.
   * @operationId vault_post_v2_key_sign
   * @param {String} id - The item ID
   * @param {String} message - The message to be signed, in base64
   * @returns {Promise} - A promise representing an async call to the key sign endpoint
   * @example
   * ```js
   * const response = await vault.sign(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   "lJkk0gCLux+Q+rPNqLPEYw=="
   * );
   * ```
   */
  async sign(
    id: string,
    message: string
  ): Promise<PangeaResponse<Vault.Asymmetric.SignResult>> {
    let data: Vault.Asymmetric.SignRequest = {
      id: id,
      message: message,
    };
    return this.post("v2/sign", data);
  }

  /**
   * @summary Verify
   * @description Verify a signature using a key.
   * @operationId vault_post_v2_key_verify
   * @param {Vault.Asymmetric.VerifyOptions} request - Supported options:
   *   - id (string): The item ID
   *   - message (string): The message to be verified (in base64)
   *   - signature (string): The message signature (in base64)
   *   - version (number): The item version
   * @returns {Promise} - A promise representing an async call to the key verify endpoint
   * @example
   * ```js
   * const response = await vault.verify({
   *   id: "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   message: "lJkk0gCLux+Q+rPNqLPEYw=="
   *   signature: "FfWuT2Mq/+cxa7wIugfhzi7ktZxVf926idJNgBDCysF/knY9B7M6wxqHMMPDEBs86D8OsEGuED21y3J7IGOpCQ==",
   * });
   * ```
   */
  async verify(
    request: Vault.Asymmetric.VerifyRequest
  ): Promise<PangeaResponse<Vault.Asymmetric.VerifyResult>> {
    return this.post("v2/verify", request);
  }

  /**
   * @summary JWT Retrieve
   * @description Retrieve a key in JWK format.
   * @operationId vault_post_v2_get_jwk
   * @param {Vault.JWK.GetOptions} options - Supported options:
   *   - id (string): The item ID
   *   - version (string): The key version(s). `all` for all versions, `num` for a specific version,
   *     `-num` for the `num` latest versions
   * @returns {Promise} - A promise representing an async call to the get JWK endpoint
   * @example
   * ```js
   * const response = await vault.jwkGet(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5"
   * );
   * ```
   */
  async jwkGet(
    request: Vault.JWK.GetRequest
  ): Promise<PangeaResponse<Vault.JWK.GetResult>> {
    return this.post("v2/jwk/get", request);
  }

  /**
   * @summary JWT Sign
   * @description Sign a JSON Web Token (JWT) using a key.
   * @operationId vault_post_v2_key_sign_jwt
   * @param {String} id - The item ID
   * @param {String} payload - The JWT payload (in JSON)
   * @returns {Promise} - A promise representing an async call to the JWT sign endpoint
   * @example
   * ```js
   * const response = await vault.jwtSign(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   "{\"sub\": \"1234567890\",\"name\": \"John Doe\",\"admin\": true}"
   * );
   * ```
   */
  async jwtSign(
    id: string,
    payload: string
  ): Promise<PangeaResponse<Vault.JWT.SignResult>> {
    let data: Vault.JWT.SignRequest = {
      id: id,
      payload: payload,
    };
    return this.post("v2/jwt/sign", data);
  }

  /**
   * @summary JWT Verify
   * @description Verify the signature of a JSON Web Token (JWT).
   * @operationId vault_post_v2_key_verify_jwt
   * @param {String} jws - The signed JSON Web Token (JWS)
   * @returns {Promise} - A promise representing an async call to the JWT verify endpoint
   * @example
   * ```js
   * const response = await vault.jwtVerify(
   *   "ewogICJhbGciO..."
   * );
   * ```
   */
  async jwtVerify(
    jws: string
  ): Promise<PangeaResponse<Vault.JWT.VerifyResult>> {
    let data: Vault.JWT.VerifyRequest = {
      jws: jws,
    };
    return this.post("v2/jwt/verify", data);
  }

  /**
   * @summary Create
   * @description Creates a folder.
   * @operationId vault_post_v2_folder_create
   * @param {Vault.Folder.CreateRequest} request - An object representing request to /folder/create endpoint
   * @returns {Promise} - A promise representing an async call to the folder create endpoint
   * @example
   * ```js
   * const createParentResp = await vault.folderCreate({
   *  name: "folder_name",
   *  folder: "parent/folder/name",
   * });
   * ```
   */
  async folderCreate(
    request: Vault.Folder.CreateRequest
  ): Promise<PangeaResponse<Vault.Folder.CreateResult>> {
    return this.post("v2/folder/create", request);
  }

  /**
   * @summary Encrypt structured
   * @description Encrypt parts of a JSON object.
   * @operationId vault_post_v2_key_encrypt_structured
   * @param request Request parameters.
   * @returns A `Promise` of the encrypted result.
   * @example
   * ```js
   * const response = await vault.encryptStructured({
   *   id: "pvi_[...]",
   *   structured_data: {"field1": [1, 2, "true", "false"], "field2": "data2"},
   *   filter: "$.field1[2:4]",
   * });
   * ```
   */
  async encryptStructured<O>(
    request: Vault.Key.EncryptStructuredRequest<O>
  ): Promise<PangeaResponse<Vault.Key.EncryptStructuredResult<O>>> {
    return this.post("v2/encrypt_structured", request);
  }

  /**
   * @summary Decrypt structured
   * @description Decrypt parts of a JSON object.
   * @operationId vault_post_v2_key_decrypt_structured
   * @param request Request parameters.
   * @returns A `Promise` of the decrypted result.
   * @example
   * ```js
   * const response = await vault.decryptStructured({
   *   id: "pvi_[...]",
   *   structured_data: {"field1": [1, 2, "[...]", "[...]"], "field2": "data2"},
   *   filter: "$.field1[2:4]",
   * });
   * ```
   */
  async decryptStructured<O>(
    request: Vault.Key.EncryptStructuredRequest<O>
  ): Promise<PangeaResponse<Vault.Key.EncryptStructuredResult<O>>> {
    return this.post("v2/decrypt_structured", request);
  }

  /**
   * @summary Encrypt transform
   * @description Encrypt using a format-preserving algorithm (FPE).
   * @operationId vault_post_v2_key_encrypt_transform
   * @param request Request parameters.
   * @returns A `Promise` of the encrypted result.
   * @example
   * ```js
   * const response = await vault.encryptTransform({
   *   id: "pvi_[...]",
   *   plain_text: "123-4567-8901",
   *   tweak: "MTIzMTIzMT==",
   *   alphabet: Vault.TransformAlphabet.ALPHANUMERIC,
   * });
   * ```
   */
  async encryptTransform(
    request: Vault.Key.EncryptTransformRequest
  ): Promise<PangeaResponse<Vault.Key.EncryptTransformResult>> {
    return this.post("v2/encrypt_transform", request);
  }

  /**
   * @summary Decrypt transform
   * @description Decrypt using a format-preserving algorithm (FPE).
   * @operationId vault_post_v2_key_decrypt_transform
   * @param request Request parameters.
   * @returns A `Promise` of the decrypted result.
   * @example
   * ```js
   * const response = await vault.decryptTransform({
   *   id: "pvi_[...]",
   *   cipher_text: "tZB-UKVP-MzTM",
   *   tweak: "MTIzMTIzMT==",
   *   alphabet: Vault.TransformAlphabet.ALPHANUMERIC,
   * });
   * ```
   */
  async decryptTransform(
    request: Vault.Key.DecryptTransformRequest
  ): Promise<PangeaResponse<Vault.Key.DecryptTransformResult>> {
    return this.post("v2/decrypt_transform", request);
  }

  /**
   * @summary Export
   * @description Export a symmetric or asymmetric key.
   * @operationId vault_post_v2_export
   * @param request Request parameters.
   * @returns A `Promise` of the export result.
   * @example
   * ```js
   * // Generate an exportable key.
   * const generated = await vault.asymmetricGenerate(
   *   Vault.AsymmetricAlgorithm.RSA4096_OAEP_SHA512,
   *   Vault.KeyPurpose.ENCRYPTION,
   *   "a-name-for-the-key",
   *   { exportable: true }
   * );
   *
   * // Then it can be exported whenever needed.
   * const exported = await vault.export({ id: generated.result.id });
   * ```
   */
  async export(
    request: Vault.ExportRequest
  ): Promise<PangeaResponse<Vault.ExportResult>> {
    return this.post("v2/export", request);
  }
}

export default VaultService;
