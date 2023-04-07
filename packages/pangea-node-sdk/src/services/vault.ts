import PangeaResponse from "../response.js";
import BaseService from "./base.js";
import PangeaConfig from "../config.js";
import { Vault } from "../types.js";

/**
 * VaultService class provides methods for interacting with the Vault Service
 * @extends BaseService
 */
class VaultService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("vault", token, config);
    this.apiVersion = "v1";
  }

  /**
   * @summary State change
   * @description Change the state of a specific version of a secret or key
   * @param {String} id - The item ID
   * @param {Vault.ItemVersionState} state - The new state of the item version
   * @param {Vault.StateChangeOptions} options - State change options. The following options are supported:
   *   - version (number): the item version
   *   - destroy_period (string): Period of time for the destruction of a compromised key.
   *     Only valid if state=`compromised`
   * @returns {Promise} - A promise representing an async call to the state change endpoint
   * @example
   * ```js
   * const response = await vault.stateChange(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   "deactivated"
   * );
   * ```
   */
  async stateChange(
    id: string,
    state: Vault.ItemVersionState,
    options: Vault.StateChangeOptions = {}
  ): Promise<PangeaResponse<Vault.StateChangeResult>> {
    const data: Vault.StateChangeRequest = {
      id: id,
      state: state,
    };
    Object.assign(data, options);
    return this.post("state/change", data);
  }

  /**
   * @summary Delete
   * @description Delete a secret or key
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
    const data: Vault.DeleteResult = {
      id: id,
    };

    return this.post("delete", data);
  }

  /**
   * @summary Retrieve
   * @description Retrieve a secret or key, and any associated information
   * @param {String} id - The item ID
   * @param {Vault.GetOptions} options - The following options are supported:
   *   - version (number | string): The key version(s).
   *     `all` for all versions, `num` for a specific version,
   *      `-num` for the `num` latest versions.
   *   - version_state (string): The state of the item version
   *   - verbose (boolean): Return metadata and extra fields
   * @returns {Promise} - A promise representing an async call to the get endpoint
   * @example
   * ```js
   * const response = await vault.getItem(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   {
   *     version: 1,
   *     version_state: "active",
   *     verbose: true,
   *   }
   * );
   * ```
   */
  async getItem(
    id: string,
    options: Vault.GetOptions = {}
  ): Promise<PangeaResponse<Vault.GetResult>> {
    let data: Vault.GetRequest = {
      id: id,
    };

    Object.assign(data, options);
    return this.post("get", data);
  }

  /**
   * @summary List
   * @description Look up a list of secrets, keys and folders, and their associated information
   * @param {Object} options - The following options are supported:
   *   - filter (object): A set of filters to help you customize your search. Examples:
   *     `"folder": "/tmp"`, `"tags": "personal"`, `"name__contains": "xxx"`, `"created_at__gt": "2020-02-05T10:00:00Z"`
   *     For metadata, use: `"metadata_": "<value>"`
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
   *     order: "asc",
   *     order_by: "name",
   *     size=20,
   *   }
   * );
   * ```
   */
  async list(options: Vault.ListOptions = {}): Promise<PangeaResponse<Vault.ListResult>> {
    return this.post("list", options);
  }

  /**
   * @summary Update
   * @description Update information associated with a secret or key
   * @param {String} id - The item ID
   * @param {Vault.UpdateOptions} options - The following options are supported:
   *   - name (string): The name of this item
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[], optional): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations
   *   - rotation_state (string): State to which the previous version should transition upon rotation.
   *   - rotation_grace_period (string): Grace period for the previous version of the Pangea Token
   *   - expiration (string): Expiration timestamp
   *   - item_state (string): The new state of the item.
   * @returns {Promise} - A promise representing an async call to the update endpoint
   * @example
   * ```js
   * const response = await vault.update(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   {
   *     name: "my-very-secret-secret",
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: "deactivated",
   *     rotation_grace_period: "1d",
   *     expiration: "2025-01-01T10:00:00Z",
   *     item_state: "disabled",
   *   }
   * );
   * ```
   */
  async update(
    id: string,
    options: Vault.UpdateOptions = {}
  ): Promise<PangeaResponse<Vault.UpdateResult>> {
    let data: Vault.UpdateRequest = {
      id: id,
    };

    Object.assign(data, options);
    return this.post("update", data);
  }

  /**
   * @summary Secret store
   * @description Import a secret
   * @param {String} secret - The secret value
   * @param {String} name - The name of this item
   * @param {Vault.Secret.StoreOptions} options - The following options are supported:
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[], optional): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations
   *   - rotation_state (string): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the secret store endpoint
   * @example
   * ```js
   * const response = await vault.secretStore(
   *   "12sdfgs4543qv@#%$casd",
   *   "my-very-secret-secret",
   *   {
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: "deactivated",
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async secretStore(
    secret: string,
    name: string,
    options: Vault.Secret.StoreOptions = {}
  ): Promise<PangeaResponse<Vault.Secret.StoreResult>> {
    let data: Vault.Secret.StoreRequest = {
      type: Vault.ItemType.SECRET,
      secret: secret,
      name: name,
    };

    Object.assign(data, options);
    return this.post("secret/store", data);
  }

  /**
   * @summary Pangea token store
   * @description Import a secret
   * @param {String} pangeaToken - The pangea token to store
   * @param {String} name - The name of this item
   * @param {Vault.Secret.StoreOptions} options - The following options are supported:
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[], optional): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations
   *   - rotation_state (string): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the secret store endpoint
   * @example
   * ```js
   * const response = await vault.secretStore(
   *   "ptv_x6fdiizbon6j3bsdvnpmwxsz2aan7fqd",
   *   "my-very-secret-secret",
   *   {
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: "deactivated",
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async pangeaTokenStore(
    pangeaToken: string,
    name: string,
    options: Vault.Secret.StoreOptions = {}
  ): Promise<PangeaResponse<Vault.Secret.StoreResult>> {
    let data: Vault.Secret.StoreRequest = {
      type: Vault.ItemType.PANGEA_TOKEN,
      secret: pangeaToken,
      name: name,
    };

    Object.assign(data, options);
    return this.post("secret/store", data);
  }

  /**
   * @summary Secret rotate
   * @description Rotate a secret
   * @param {String} id - The item ID
   * @param {String} secret - The secret value
   * @param {Vault.Secret.Secret.RotateOptions} options - The following options are supported:
   *   - rotation_state (string): State to which the previous version should transition upon rotation.
   *     Default is `deactivated`.
   * @returns {Promise} - A promise representing an async call to the secret rotate endpoint
   * @example
   * ```js
   * const response = await vault.secretRotate(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   "12sdfgs4543qv@#%$casd",
   *   {
   *     rotation_state: "deactivated",
   *   }
   * );
   * ```
   */
  async secretRotate(
    id: string,
    secret: string,
    options: Vault.Secret.Secret.RotateOptions = {}
  ): Promise<PangeaResponse<Vault.Secret.RotateResult>> {
    let data: Vault.Secret.Secret.RotateRequest = {
      id: id,
      secret: secret,
    };
    Object.assign(data, options);
    return this.post("secret/rotate", data);
  }

  /**
   * @summary Token rotate
   * @description Rotate a Pangea token
   * @param {String} id - The item ID
   * @param {String} rotation_grace_period - Grace period for the previous version of the Pangea Token
   * @returns {Promise} - A promise representing an async call to the secret rotate endpoint
   * @example
   * ```js
   * const response = await vault.pangeaTokenRotate(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   "1d"
   * );
   * ```
   */
  async pangeaTokenRotate(
    id: string,
    rotation_grace_period: string
  ): Promise<PangeaResponse<Vault.Secret.RotateResult>> {
    let data: Vault.Secret.Token.RotateRequest = {
      id: id,
      rotation_grace_period: rotation_grace_period,
    };

    return this.post("secret/rotate", data);
  }

  /**
   * @summary Symmetric generate
   * @description Generate a symmetric key
   * @param {Vault.SymmetricAlgorithm} algorithm - The algorithm of the key. Options
   * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/generate-a-key#generating-a-symmetric-key).
   * @param {Vault.KeyPurpose} purpose - The purpose of this key
   * @param {String} name - The name of this item
   * @param {Vault.Symmetric.GenerateOptions} options - The following options are supported:
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[], optional): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
   *   - rotation_state (string): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the key generate endpoint
   * @example
   * ```js
   * const response = await vault.symmetricGenerate(
   *   "AES-CFB-128",
   *   "encryption",
   *   "my-very-secret-secret",
   *   {
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: "deactivated",
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async symmetricGenerate(
    algorithm: Vault.SymmetricAlgorithm,
    purpose: Vault.KeyPurpose,
    name: string,
    options: Vault.Symmetric.GenerateOptions = {}
  ): Promise<PangeaResponse<Vault.Symmetric.GenerateResult>> {
    let data: Vault.Symmetric.GenerateRequest = {
      type: Vault.ItemType.SYMMETRIC_KEY,
      algorithm: algorithm,
      purpose: purpose,
      name: name,
    };

    Object.assign(data, options);
    return this.post("key/generate", data);
  }

  /**
   * @summary Asymmetric generate
   * @description Generate an asymmetric key
   * @param {Vault.AsymmetricAlgorithm} algorithm - The algorithm of the key. Options
   * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/generate-a-key#generating-asymmetric-key-pairs).
   * @param {Vault.KeyPurpose} purpose - The purpose of this key
   * @param {String} name - The name of this item
   * @param {Vault.Asymmetric.GenerateOptions} options - The following options are supported:
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[], optional): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
   *   - rotation_state (string): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the key generate endpoint
   * @example
   * ```js
   * const response = await vault.asymmetricGenerate(
   *   "RSA-PKCS1V15-2048-SHA256",
   *   "signing",
   *   "my-very-secret-secret",
   *   {
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: "deactivated",
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async asymmetricGenerate(
    algorithm: Vault.AsymmetricAlgorithm,
    purpose: Vault.KeyPurpose,
    name: string,
    options: Vault.Asymmetric.GenerateOptions = {}
  ): Promise<PangeaResponse<Vault.Asymmetric.GenerateResult>> {
    let data: Vault.Asymmetric.GenerateRequest = {
      type: Vault.ItemType.ASYMMETRIC_KEY,
      algorithm: algorithm,
      purpose: purpose,
      name: name,
    };

    Object.assign(data, options);
    return this.post("key/generate", data);
  }

  /**
   * @summary Asymmetric store
   * @description Import an asymmetric key
   * @param {Vault.EncodedPrivateKey} privateKey - The private key in PEM format
   * @param {Vault.EncodedPublicKey} publicKey - The public key in PEM format
   * @param {Vault.AsymmetricAlgorithm} algorithm - The algorithm of the key. Options
   * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/import-a-key#importing-an-asymmetric-key-pair).
   * @param {Vault.KeyPurpose} purpose - The purpose of this key. `signing`, `encryption`, or `jwt`.
   * @param {String} name - The name of this item
   * @param {Vault.Asymmetric.StoreOptions} options - The following options are supported:
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[], optional): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
   *   - rotation_state (string): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the key store endpoint
   * @example
   * ```js
   * const response = await vault.asymmetricStore(
   *   "private key example",
   *   "-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEA8s5JopbEPGBylPBcMK+L5PqHMqPJW/5KYPgBHzZGncc=\n-----END PUBLIC KEY-----",
   *   "RSA-PKCS1V15-2048-SHA256",
   *   "signing",
   *   "my-very-secret-secret",
   *   {
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: "deactivated",
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async asymmetricStore(
    privateKey: Vault.EncodedPrivateKey,
    publicKey: Vault.EncodedPublicKey,
    algorithm: Vault.AsymmetricAlgorithm,
    purpose: Vault.KeyPurpose,
    name: string,
    options: Vault.Asymmetric.StoreOptions = {}
  ): Promise<PangeaResponse<Vault.Asymmetric.StoreResult>> {
    let data: Vault.Asymmetric.StoreRequest = {
      type: Vault.ItemType.ASYMMETRIC_KEY,
      private_key: privateKey,
      public_key: publicKey,
      algorithm: algorithm,
      purpose: purpose,
      name: name,
    };

    Object.assign(data, options);
    return this.post("key/store", data);
  }

  /**
   * @summary Symmetric store
   * @description Import a symmetric key
   * @param {String} key - The key material (in base64)
   * @param {Vault.SymmetricAlgorithm} algorithm - The algorithm of the key. Options
   * [listed in Vault documentation](https://pangea.cloud/docs/vault/manage-keys/import-a-key#importing-a-symmetric-key).
   * @param {Vault.KeyPurpose} purpose - The purpose of this key. `encryption` or `jwt`
   * @param {String} name - The name of this item
   * @param {Vault.Asymmetric.StoreOptions} options - The following options are supported:
   *   - folder (string): The folder where this item is stored
   *   - metadata (object): User-provided metadata
   *   - tags (string[], optional): A list of user-defined tags
   *   - rotation_frequency (string): Period of time between item rotations, or `never` to disallow rotation
   *   - rotation_state (string): State to which the previous version should transition upon rotation.
   *   - expiration (string): Expiration timestamp
   * @returns {Promise} - A promise representing an async call to the key store endpoint
   * @example
   * ```js
   * const response = await vault.symmetricStore(
   *   "lJkk0gCLux+Q+rPNqLPEYw==",
   *   "AES-CFB-128",
   *   "encryption",
   *   "my-very-secret-secret",
   *   {
   *     folder: "/personal",
   *     metadata: {
   *       "created_by": "John Doe",
   *       "used_in": "Google products"
   *     },
   *     tags: ["irs_2023", "personal"],
   *     rotation_frequency: "10d",
   *     rotation_state: "deactivated",
   *     expiration: "2025-01-01T10:00:00Z",
   *   }
   * );
   * ```
   */
  async symmetricStore(
    key: string,
    algorithm: Vault.SymmetricAlgorithm,
    purpose: Vault.KeyPurpose,
    name: string,
    options: Vault.Asymmetric.StoreOptions = {}
  ): Promise<PangeaResponse<Vault.Symmetric.StoreResult>> {
    let data: Vault.Symmetric.StoreRequest = {
      type: Vault.ItemType.SYMMETRIC_KEY,
      key: key,
      algorithm: algorithm,
      purpose: purpose,
      name: name,
    };

    Object.assign(data, options);
    return this.post("key/store", data);
  }

  /**
   * @summary Key rotate
   * @description Manually rotate a symmetric or asymmetric key
   * @param {String} id - The ID of the item
   * @param {Vault.Key.RotateOptions} options - Supported options:
   *   - rotation_state (string): State to which the previous version should transition upon rotation.
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
   *     rotation_state: "deactivated",
   *     key: "lJkk0gCLux+Q+rPNqLPEYw==",
   *   }
   * );
   * ```
   */
  async keyRotate(
    id: string,
    options: Vault.Key.RotateOptions = {}
  ): Promise<PangeaResponse<Vault.Key.RotateResult>> {
    let data: Vault.Key.RotateRequest = {
      id: id,
    };

    Object.assign(data, options);
    return this.post("key/rotate", data);
  }

  /**
   * @summary Encrypt
   * @description Encrypt a message using a key
   * @param {String} id - The item ID
   * @param {String} plainText - A message to be in encrypted (in base64)
   * @returns {Promise} - A promise representing an async call to the key encrypt endpoint
   * @example
   * ```js
   * const response = await vault.encrypt(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   "lJkk0gCLux+Q+rPNqLPEYw=="
   * );
   * ```
   */
  async encrypt(
    id: string,
    plainText: string
  ): Promise<PangeaResponse<Vault.Symmetric.EncryptResult>> {
    let data: Vault.Symmetric.EncryptRequest = {
      id: id,
      plain_text: plainText,
    };
    return this.post("key/encrypt", data);
  }

  /**
   * @summary Decrypt
   * @description Decrypt a message using a key
   * @param {String} id - The item ID
   * @param {String} cipherText - A message encrypted by Vault (in base64)
   * @param {Object} options - Supported options:
   *   - version (number): The item version
   * @returns {Promise} - A promise representing an async call to the key decrypt endpoint
   * @example
   * ```js
   * const response = await vault.decrypt(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   "lJkk0gCLux+Q+rPNqLPEYw==",
   *   1
   * );
   * ```
   */
  async decrypt(
    id: string,
    cipherText: string,
    options: Vault.Symmetric.DecryptOptions = {}
  ): Promise<PangeaResponse<Vault.Symmetric.DecryptResult>> {
    let data: Vault.Symmetric.DecryptRequest = {
      id: id,
      cipher_text: cipherText,
    };
    Object.assign(data, options);
    return this.post("key/decrypt", data);
  }

  /**
   * @summary Sign
   * @description Sign a message using a key
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
  async sign(id: string, message: string): Promise<PangeaResponse<Vault.Asymmetric.SignResult>> {
    let data: Vault.Asymmetric.SignRequest = {
      id: id,
      message: message,
    };
    return this.post("key/sign", data);
  }

  /**
   * @summary Verify
   * @description Verify a signature using a key
   * @param {String} id - The item ID
   * @param {String} message - The message to be verified (in base64)
   * @param {String} signature - The message signature (in base64)
   * @param {Vault.Asymmetric.VerifyOptions} options - Supported options:
   *   - version (number): The item version
   * @returns {Promise} - A promise representing an async call to the key verify endpoint
   * @example
   * ```js
   * const response = await vault.verify(
   *   "pvi_p6g5i3gtbvqvc3u6zugab6qs6r63tqf5",
   *   "lJkk0gCLux+Q+rPNqLPEYw=="
   *   "FfWuT2Mq/+cxa7wIugfhzi7ktZxVf926idJNgBDCysF/knY9B7M6wxqHMMPDEBs86D8OsEGuED21y3J7IGOpCQ==",
   *   1
   * );
   * ```
   */
  async verify(
    id: string,
    message: string,
    signature: string,
    options: Vault.Asymmetric.VerifyOptions = {}
  ): Promise<PangeaResponse<Vault.Asymmetric.VerifyResult>> {
    let data: Vault.Asymmetric.VerifyRequest = {
      id: id,
      message: message,
      signature: signature,
    };
    Object.assign(data, options);
    return this.post("key/verify", data);
  }

  /**
   * @summary JWT Retrieve
   * @description Retrieve a key in JWK format
   * @param {String} id - The item ID
   * @param {Vault.JWK.GetOptions} options - Supported options:
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
    id: string,
    options: Vault.JWK.GetOptions = {}
  ): Promise<PangeaResponse<Vault.JWK.GetResult>> {
    let data: Vault.JWK.GetRequest = {
      id: id,
    };
    Object.assign(data, options);
    return this.post("get/jwk", data);
  }

  /**
   * @summary JWT Sign
   * @description Sign a JSON Web Token (JWT) using a key
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
  async jwtSign(id: string, payload: string): Promise<PangeaResponse<Vault.JWT.SignResult>> {
    let data: Vault.JWT.SignRequest = {
      id: id,
      payload: payload,
    };
    return this.post("key/sign/jwt", data);
  }

  /**
   * @summary JWT Verify
   * @description Verify the signature of a JSON Web Token (JWT)
   * @param {String} jws - The signed JSON Web Token (JWS)
   * @returns {Promise} - A promise representing an async call to the JWT verify endpoint
   * @example
   * ```js
   * const response = await vault.jwtVerify(
   *   "ewogICJhbGciO..."
   * );
   * ```
   */
  async jwtVerify(jws: string): Promise<PangeaResponse<Vault.JWT.VerifyResult>> {
    let data: Vault.JWT.VerifyRequest = {
      jws: jws,
    };
    return this.post("key/verify/jwt", data);
  }
}

export default VaultService;
