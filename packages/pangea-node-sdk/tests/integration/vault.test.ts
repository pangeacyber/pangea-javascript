import PangeaConfig from "../../src/config";
import VaultService from "../../src/services/vault";
import { Vault } from "../../src/types";
import { jest, it, expect } from "@jest/globals";
import { PangeaErrors } from "../../src/errors";
import { strToB64 } from "../../src/utils/utils";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils";

const environment = TestEnvironment.DEVELOP;
const token = getTestToken(environment);
const testHost = getTestDomain(environment);
const config = new PangeaConfig({ domain: testHost });
const vault = new VaultService(token, config);
const TIME = new Date().toDateString();
const FOLDER_VALUE = "/test_key_folder_" + TIME + "/";
const METADATA_VALUE = { test: "true", field1: "value1", field2: "value2" };
const TAGS_VALUE = ["test", "symmetric"];
const ROTATION_FREQUENCY_VALUE = "1d";
const ROTATION_STATE_VALUE = Vault.ItemVersionState.DEACTIVATED;
const EXPIRATION_VALUE = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString();

const KEY_ED25519 = {
  algorithm: Vault.AsymmetricAlgorithm.Ed25519,
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMC4CAQAwBQYDK2VwBCIEIGthqegkjgddRAn0PWN2FeYC6HcCVQf/Ph9sUbeprTBO\n-----END PRIVATE KEY-----\n",
  public_key:
    "-----BEGIN PUBLIC KEY-----\nMCowBQYDK2VwAyEAPlGrDliJXUbPc2YWEhFxlL2UbBfLHc3ed1f36FrDtTc=\n-----END PUBLIC KEY-----\n",
};

const KEY_AES = {
  algorithm: Vault.SymmetricAlgorithm.AES,
  key: "oILlp2FUPHWiaqFXl4/1ww==",
};

jest.setTimeout(60000);
it("Secret life cycle", async () => {
  // Store
  const secretV1 = "mysecret";
  const store1Resp = await vault.secretStore(secretV1);
  const id = store1Resp.result.id;
  expect(id).toBeDefined();
  expect(store1Resp.result.secret).toBe(secretV1);
  expect(store1Resp.result.version).toBe(1);

  // Rotate
  const secretV2 = "newsecret";
  const rotateResp = await vault.secretRotate(id, secretV2);
  expect(rotateResp.result.secret).toBe(secretV2);
  expect(rotateResp.result.version).toBe(2);

  // Get
  let getResp = await vault.getItem(id);
  expect(getResp.result.versions.length).toBe(0);
  expect(getResp.result.current_version.secret).toBe(secretV2);
  expect(getResp.result.current_version.version).toBe(2);
  expect(getResp.result.current_version.public_key).toBeUndefined();

  // Deactivate
  const stateChangeResp = await vault.stateChange(id, Vault.ItemVersionState.SUSPENDED, {
    version: 1,
  });
  expect(stateChangeResp.result.id).toBe(id);

  // Get after deactivate
  getResp = await vault.getItem(id);
  expect(getResp.result.versions.length).toBe(0);
  expect(getResp.result.current_version.secret).toBe(secretV2);
  expect(getResp.result.current_version.version).toBe(2);
  expect(getResp.result.current_version.public_key).toBeUndefined();
});

async function asymSigningCycle(id: string) {
  const data = "thisisamessagetosign";

  // Sign 1
  const sign1Resp = await vault.sign(id, data);
  expect(sign1Resp.result.id).toBe(id);
  expect(sign1Resp.result.version).toBe(1);
  expect(sign1Resp.result.signature).toBeDefined();

  // Rotate
  const rotateResp = await vault.keyRotate(id);
  expect(rotateResp.result.version).toBe(2);
  expect(rotateResp.result.id).toBe(id);

  // Sign2
  const sign2Resp = await vault.sign(id, data);
  expect(sign2Resp.result.id).toBe(id);
  expect(sign2Resp.result.version).toBe(2);
  expect(sign2Resp.result.signature).toBeDefined();

  // Verify 2
  const verify2Resp = await vault.verify(id, data, sign2Resp.result.signature, {
    version: 2,
  });
  expect(verify2Resp.result.valid_signature).toBe(true);

  // Verify default version
  const verifyDefaultResp = await vault.verify(id, data, sign2Resp.result.signature);
  expect(verifyDefaultResp.result.valid_signature).toBe(true);

  // Verify wrong id
  let f = async () => {
    await vault.verify("notanid", data, sign2Resp.result.signature);
  };
  await expect(f()).rejects.toThrow(PangeaErrors.APIError);

  // # Verify wrong signature
  f = async () => {
    await vault.verify(id, data, "thisisnotasignature");
  };
  await expect(f()).rejects.toThrow(PangeaErrors.APIError);

  // verify wrong signature
  const verifyBad1Resp = await vault.verify(id, data, sign1Resp.result.signature);
  expect(verifyBad1Resp.result.valid_signature).toBe(false);

  // verify wrong data
  const verifyBad2Resp = await vault.verify(
    id,
    "thisisnottheoriginaldata",
    sign2Resp.result.signature
  );
  expect(verifyBad2Resp.result.valid_signature).toBe(false);

  // Deactivate key
  const stateChangeResp = await vault.stateChange(id, Vault.ItemVersionState.SUSPENDED, {
    version: 1,
  });
  expect(stateChangeResp.result.id).toBe(id);

  // Verify after deactivated
  const verify1Resp = await vault.verify(id, data, sign1Resp.result.signature, {
    version: 1,
  });
  expect(verify1Resp.result.valid_signature).toBe(true);
}

async function jwtSigningCycle(id: string) {
  const data = {
    message: "message to sign",
    data: "Some extra data",
  };

  const payload = JSON.stringify(data);

  // Sign 1
  try {
    const sign1Resp = await vault.jwtSign(id, payload);
    expect(sign1Resp.result.jws).toBeDefined();

    // Rotate
    const rotateResp = await vault.keyRotate(id);
    expect(rotateResp.result.version).toBe(2);
    expect(rotateResp.result.id).toBe(id);

    // Sign2
    const sign2Resp = await vault.jwtSign(id, payload);
    expect(sign2Resp.result.jws).toBeDefined();

    // Verify 2
    const verify2Resp = await vault.jwtVerify(sign2Resp.result.jws);
    expect(verify2Resp.result.valid_signature).toBe(true);

    // Get default
    let getResp = await vault.jwkGet(id);
    expect(getResp.result.jwk.keys.length).toBe(1);

    // Get version
    getResp = await vault.jwkGet(id, { version: "1" });
    expect(getResp.result.jwk.keys.length).toBe(1);

    // Get all
    getResp = await vault.jwkGet(id, { version: "all" });
    expect(getResp.result.jwk.keys.length).toBe(2);

    // Get -1
    getResp = await vault.jwkGet(id, { version: "-1" });
    expect(getResp.result.jwk.keys.length).toBe(2);

    // Deactivate key
    const stateChangeResp = await vault.stateChange(id, Vault.ItemVersionState.SUSPENDED, {
      version: 1,
    });
    expect(stateChangeResp.result.id).toBe(id);

    // Verify after deactivated
    const verify1Resp = await vault.jwtVerify(sign1Resp.result.jws);
    expect(verify1Resp.result.valid_signature).toBe(true);
  } catch (e) {
    e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    expect(false).toBeTruthy();
  }
}

async function encryptingCycle(id: string) {
  const msg = "thisisamessagetoencrypt";
  const dataB64 = strToB64(msg);

  // Encrypt 1
  const enc1Resp = await vault.encrypt(id, dataB64);
  expect(enc1Resp.result.id).toBe(id);
  expect(enc1Resp.result.version).toBe(1);
  expect(enc1Resp.result.cipher_text).toBeDefined();

  // Rotate
  const rotateResp = await vault.keyRotate(id);
  expect(rotateResp.result.id).toBe(id);
  expect(rotateResp.result.version).toBe(2);

  // Encrypt 2
  const enc2Resp = await vault.encrypt(id, dataB64);
  expect(enc2Resp.result.id).toBe(id);
  expect(enc2Resp.result.version).toBe(2);
  expect(enc2Resp.result.cipher_text).toBeDefined();

  // Decrypt 1
  const dec1Resp = await vault.decrypt(id, enc1Resp.result.cipher_text, {
    version: 1,
  });
  expect(dec1Resp.result.plain_text).toBe(dataB64);

  // Decrypt 2
  const dec2Resp = await vault.decrypt(id, enc2Resp.result.cipher_text, {
    version: 2,
  });
  expect(dec2Resp.result.plain_text).toBe(dataB64);

  // Decrypt default
  const decDefaultResp = await vault.decrypt(id, enc2Resp.result.cipher_text);
  expect(decDefaultResp.result.plain_text).toBe(dataB64);

  // // Decrypt wrong version
  // const decBad1Resp = await vault.decrypt(id, enc1Resp.result.cipher_text);
  // expect(decBad1Resp.result.plain_text).not.toBe(dataB64);

  let f = async () => {
    await vault.decrypt("notandid", enc2Resp.result.cipher_text);
  };

  await expect(f()).rejects.toThrow(PangeaErrors.APIError);

  // Deactivate key
  const stateChangeResp = await vault.stateChange(id, Vault.ItemVersionState.SUSPENDED, {
    version: 1,
  });
  expect(stateChangeResp.result.id).toBe(id);

  // Decrypt after deactivated
  const dec1RespRevoked = await vault.decrypt(id, enc1Resp.result.cipher_text, {
    version: 1,
  });
  expect(dec1RespRevoked.result.plain_text).toBe(dataB64);
}

async function symGenerateDefault(
  algorithm: Vault.SymmetricAlgorithm,
  purpose: Vault.KeyPurpose
): Promise<string> {
  const response = await vault.symmetricGenerate(algorithm, purpose);
  expect(response.result.type).toBe(Vault.ItemType.SYMMETRIC_KEY);
  expect(response.result.version).toBe(1);
  expect(response.result.id).toBeDefined();
  return response.result.id;
}

async function symGenerateParams(
  algorithm: Vault.SymmetricAlgorithm,
  purpose: Vault.KeyPurpose
): Promise<string> {
  const name = "symGenerateParams_" + TIME;
  const genResp = await vault.symmetricGenerate(algorithm, purpose, {
    name: name,
    metadata: METADATA_VALUE,
    tags: TAGS_VALUE,
    folder: FOLDER_VALUE,
    expiration: EXPIRATION_VALUE,
    rotation_frequency: ROTATION_FREQUENCY_VALUE,
    rotation_state: ROTATION_STATE_VALUE,
  });
  expect(genResp.result.type).toBe(Vault.ItemType.SYMMETRIC_KEY);
  expect(genResp.result.version).toBe(1);
  expect(genResp.result.id).toBeDefined();

  const getResp = await vault.getItem(genResp.result.id, { verbose: true });
  expect(getResp.result.algorithm).toBe(algorithm);
  expect(getResp.result.versions.length).toBe(0);
  expect(getResp.result.current_version.version).toBe(1);
  expect(getResp.result.name).toBe(name);
  expect(getResp.result.expiration).toBe(EXPIRATION_VALUE);
  expect(getResp.result.rotation_frequency).toBe(ROTATION_FREQUENCY_VALUE);
  expect(getResp.result.rotation_state).toBe(ROTATION_STATE_VALUE);
  expect(getResp.result.id).toBeDefined();
  return getResp.result.id;
}

async function asymGenerateDefault(
  algorithm: Vault.AsymmetricAlgorithm,
  purpose: Vault.KeyPurpose
): Promise<string> {
  const genResp = await vault.asymmetricGenerate(algorithm, purpose);
  expect(genResp.result.type).toBe(Vault.ItemType.ASYMMETRIC_KEY);
  expect(genResp.result.version).toBe(1);
  expect(genResp.result.id).toBeDefined();
  return genResp.result.id;
}

async function asymGenerateParams(
  algorithm: Vault.AsymmetricAlgorithm,
  purpose: Vault.KeyPurpose
): Promise<string> {
  const name = "asymGenerateParams_" + TIME;
  const genResp = await vault.asymmetricGenerate(algorithm, purpose, {
    name: name,
    metadata: METADATA_VALUE,
    tags: TAGS_VALUE,
    folder: FOLDER_VALUE,
    expiration: EXPIRATION_VALUE,
    rotation_frequency: ROTATION_FREQUENCY_VALUE,
    rotation_state: ROTATION_STATE_VALUE,
  });
  expect(genResp.result.type).toBe(Vault.ItemType.ASYMMETRIC_KEY);
  expect(genResp.result.version).toBe(1);
  expect(genResp.result.id).toBeDefined();

  const getResp = await vault.getItem(genResp.result.id, { verbose: true });
  expect(getResp.result.versions.length).toBe(0);
  expect(getResp.result.algorithm).toBe(algorithm);
  expect(getResp.result.current_version.version).toBe(1);
  expect(getResp.result.name).toBe(name);
  expect(getResp.result.folder).toBe(FOLDER_VALUE);
  expect(getResp.result.expiration).toBe(EXPIRATION_VALUE);
  expect(getResp.result.rotation_frequency).toBe(ROTATION_FREQUENCY_VALUE);
  expect(getResp.result.rotation_state).toBe(ROTATION_STATE_VALUE);
  expect(getResp.result.id).toBeDefined();
  return getResp.result.id;
}

jest.setTimeout(60000);
it("Ed25519 signing generate all params", async () => {
  const algorithm = Vault.AsymmetricAlgorithm.Ed25519;
  const purpose = Vault.KeyPurpose.SIGNING;
  try {
    const id = await asymGenerateParams(algorithm, purpose);
    await vault.delete(id);
  } catch (e) {
    e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    console.log(`Failed asymGenerateParams with ${algorithm} and ${purpose}`);
    expect(false).toBeTruthy();
  }
});

jest.setTimeout(60000);
it("Ed25519 default store", async () => {
  const genResp = await vault.asymmetricStore(
    KEY_ED25519.private_key,
    KEY_ED25519.public_key,
    KEY_ED25519.algorithm,
    Vault.KeyPurpose.SIGNING
  );
  expect(genResp.result.type).toBe(Vault.ItemType.ASYMMETRIC_KEY);
  expect(genResp.result.version).toBe(1);
  expect(genResp.result.id).toBeDefined();
});

jest.setTimeout(60000);
it("AES default store", async () => {
  const genResp = await vault.symmetricStore(
    KEY_AES.key,
    KEY_AES.algorithm,
    Vault.KeyPurpose.ENCRYPTION
  );
  expect(genResp.result.type).toBe(Vault.ItemType.SYMMETRIC_KEY);
  expect(genResp.result.version).toBe(1);
  expect(genResp.result.id).toBeDefined();
});

jest.setTimeout(60000);
it("AES encrypting generate all params", async () => {
  const algorithm = Vault.SymmetricAlgorithm.AES;
  const purpose = Vault.KeyPurpose.ENCRYPTION;
  try {
    const id = await symGenerateParams(algorithm, purpose);
    await vault.delete(id);
  } catch (e) {
    e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    console.log(`Failed symGenerateParams with ${algorithm} and ${purpose}`);
    expect(false).toBeTruthy();
  }
});

jest.setTimeout(60000);
it("RSA encrypting generate all params", async () => {
  const algorithm = Vault.AsymmetricAlgorithm.RSA;
  const purpose = Vault.KeyPurpose.ENCRYPTION;
  try {
    const id = await asymGenerateParams(algorithm as Vault.AsymmetricAlgorithm, purpose);
    await vault.delete(id);
  } catch (e) {
    e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    console.log(`Failed asymGenerateParams with ${algorithm} and ${purpose}`);
    expect(false).toBeTruthy();
  }
});

jest.setTimeout(60000);
it("Ed25519 signing life cycle", async () => {
  const algorithm = Vault.AsymmetricAlgorithm.Ed25519;
  const purpose = Vault.KeyPurpose.SIGNING;
  try {
    const id = await asymGenerateDefault(algorithm, purpose);
    await asymSigningCycle(id);
    await vault.delete(id);
  } catch (e) {
    console.log(`Failed asymmetric signing life cycle with ${algorithm} and ${purpose}`);
    expect(false).toBeTruthy();
  }
});

jest.setTimeout(60000);
it("RSA encrypting life cycle", async () => {
  const algorithm = Vault.AsymmetricAlgorithm.RSA;
  const purpose = Vault.KeyPurpose.ENCRYPTION;
  try {
    const id = await asymGenerateDefault(algorithm as Vault.AsymmetricAlgorithm, purpose);
    await encryptingCycle(id);
    await vault.delete(id);
  } catch (e) {
    e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    console.log(`Failed asymmetric encrypting life cycle with ${algorithm} and ${purpose}`);
    expect(false).toBeTruthy();
  }
});

jest.setTimeout(60000);
it("AES encrypting life cycle", async () => {
  const algorithm = Vault.SymmetricAlgorithm.AES;
  const purpose = Vault.KeyPurpose.ENCRYPTION;
  try {
    const id = await symGenerateDefault(algorithm as Vault.SymmetricAlgorithm, purpose);
    await encryptingCycle(id);
    await vault.delete(id);
  } catch (e) {
    console.log(`Failed symmetric encrypting life cycle with ${algorithm} and ${purpose}`);
    expect(false).toBeTruthy();
  }
});

jest.setTimeout(60000);
it("JWT asymmetric signing life cycle", async () => {
  const algorithms = [
    Vault.AsymmetricAlgorithm.ES256,
    Vault.AsymmetricAlgorithm.ES384,
    Vault.AsymmetricAlgorithm.ES512,
  ];
  const purpose = Vault.KeyPurpose.JWT;
  algorithms.forEach(async (algorithm) => {
    try {
      const id = await asymGenerateDefault(algorithm, purpose);
      await jwtSigningCycle(id);
      await vault.delete(id);
    } catch (e) {
      console.log(`Failed JWT asymmetric signing life cycle with ${algorithm} and ${purpose}`);
      expect(false).toBeTruthy();
    }
  });
});

jest.setTimeout(60000);
it("JWT symmetric signing life cycle", async () => {
  const algorithm = Vault.SymmetricAlgorithm.HS256;
  const purpose = Vault.KeyPurpose.JWT;
  try {
    const id = await symGenerateDefault(algorithm, purpose);
    await jwtSigningCycle(id);
    await vault.delete(id);
  } catch (e) {
    e instanceof PangeaErrors.APIError ? console.log(e.toString()) : console.log(e);
    console.log(`Failed JWT symmetric signing life cycle with ${algorithm} and ${purpose}`);
    expect(false).toBeTruthy();
  }
});
