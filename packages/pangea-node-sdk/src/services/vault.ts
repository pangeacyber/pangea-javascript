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

  async revoke(id: string): Promise<PangeaResponse<Vault.RevokeResult>> {
    const data: Vault.RevokeRequest = {
      id: id,
    };

    return this.post("revoke", data);
  }

  async delete(id: string): Promise<PangeaResponse<Vault.DeleteResult>> {
    const data: Vault.DeleteResult = {
      id: id,
    };

    return this.post("delete", data);
  }

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

  async list(options: Vault.ListOptions = {}): Promise<PangeaResponse<Vault.ListResult>> {
    return this.post("list", options);
  }

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

  async secretStore(
    secret: string,
    options: Vault.Secret.StoreOptions = {}
  ): Promise<PangeaResponse<Vault.Secret.StoreResult>> {
    let data: Vault.Secret.StoreRequest = {
      type: Vault.ItemType.SECRET,
      secret: secret,
    };

    Object.assign(data, options);
    return this.post("secret/store", data);
  }

  async secretRotate(
    id: string,
    secret: string
  ): Promise<PangeaResponse<Vault.Secret.RotateResult>> {
    let data: Vault.Secret.RotateRequest = {
      id: id,
      secret: secret,
    };

    return this.post("secret/rotate", data);
  }

  async symmetricGenerate(
    options: Vault.Symmetric.GenerateOptions = {}
  ): Promise<PangeaResponse<Vault.Symmetric.GenerateResult>> {
    let data: Vault.Symmetric.GenerateRequest = {
      type: Vault.ItemType.SYMMETRIC_KEY,
    };

    Object.assign(data, options);
    return this.post("key/generate", data);
  }

  async asymmetricGenerate(
    options: Vault.Asymmetric.GenerateOptions = {}
  ): Promise<PangeaResponse<Vault.Asymmetric.GenerateResult>> {
    let data: Vault.Asymmetric.GenerateRequest = {
      type: Vault.ItemType.ASYMMETRIC_KEY,
    };

    Object.assign(data, options);
    return this.post("key/generate", data);
  }

  async asymmetricStore(
    algorithm: string,
    publicKey: Vault.EncodedPublicKey,
    privateKey: Vault.EncodedPrivateKey,
    options: Vault.Asymmetric.StoreOptions = {}
  ): Promise<PangeaResponse<Vault.Asymmetric.StoreResult>> {
    let data: Vault.Asymmetric.StoreRequest = {
      type: Vault.ItemType.ASYMMETRIC_KEY,
      algorithm: algorithm,
      public_key: publicKey,
      private_key: privateKey,
    };

    Object.assign(data, options);
    return this.post("key/store", data);
  }

  async symmetricStore(
    algorithm: string,
    key: string,
    options: Vault.Asymmetric.StoreOptions = {}
  ): Promise<PangeaResponse<Vault.Symmetric.StoreResult>> {
    let data: Vault.Symmetric.StoreRequest = {
      type: Vault.ItemType.SYMMETRIC_KEY,
      algorithm: algorithm,
      key: key,
    };

    Object.assign(data, options);
    return this.post("key/store", data);
  }

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

  async sign(id: string, message: string): Promise<PangeaResponse<Vault.Asymmetric.SignResult>> {
    let data: Vault.Asymmetric.SignRequest = {
      id: id,
      message: message,
    };
    return this.post("key/sign", data);
  }

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
}

export default VaultService;
