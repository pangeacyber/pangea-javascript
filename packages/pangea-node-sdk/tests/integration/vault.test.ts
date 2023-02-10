import PangeaConfig from "../../src/config";
import VaultService from "../../src/services/vault";
import { Vault } from "../../src/types";
import { jest, it, expect } from "@jest/globals";
import { PangeaErrors } from "../../src/errors";
import { strToB64, b64toStr } from "../../src/utils/utils";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils";

const environment = TestEnvironment.DEVELOP;
const token = getTestToken(environment);
const testHost = getTestDomain(environment);
const config = new PangeaConfig({ domain: testHost });
const vault = new VaultService(token, config);

jest.setTimeout(60000);
it("Secret life cycle", async () => {
  const secretV1 = "mysecret";
  const respV1 = await vault.secretStore(secretV1);
  const id = respV1.result.id;
  expect(id).toBeDefined();
  expect(respV1.result.secret).toBe(secretV1);
  expect(respV1.result.version).toBe(1);

  const secretV2 = "newsecret";
  const respRotate = await vault.secretRotate(id, secretV2);
  expect(respRotate.result.secret).toBe(secretV2);
  expect(respRotate.result.version).toBe(2);

  const respGet = await vault.getItem(id);
  expect(respGet.result.secret).toBe(secretV2);
  expect(respGet.result.version).toBe(2);
  expect(respGet.result.revoked_at).toBeUndefined();
  expect(respGet.result.private_key).toBeUndefined();
  expect(respGet.result.public_key).toBeUndefined();
  expect(respGet.result.key).toBeUndefined();

  const respRevoke = await vault.revoke(id);
  expect(respRevoke.result.id).toBe(id);

  const f = async () => {
    return await vault.getItem(id);
  };
  await expect(f()).rejects.toThrow(PangeaErrors.APIError);
});

async function signingCycle(id: string) {
  const data = "thisisamessagetosign";

  // Sign 1
  const respSign1 = await vault.sign(id, data);
  expect(respSign1.result.id).toBe(id);
  expect(respSign1.result.version).toBe(1);
  expect(respSign1.result.signature).toBeDefined();

  // Rotate
  const respRotate = await vault.keyRotate(id);
  expect(respRotate.result.version).toBe(2);
  expect(respRotate.result.id).toBe(id);

  // Sign2
  const respSign2 = await vault.sign(id, data);
  expect(respSign2.result.id).toBe(id);
  expect(respSign2.result.version).toBe(2);
  expect(respSign2.result.signature).toBeDefined();

  // Verify 2
  const respVerify2 = await vault.verify(id, data, respSign2.result.signature, {
    version: 2,
  });
  expect(respVerify2.result.valid_signature).toBe(true);

  // Verify default version
  const respVerifyDefault = await vault.verify(id, data, respSign2.result.signature);
  expect(respVerifyDefault.result.valid_signature).toBe(true);

  // Verify wrong id
  let f = async () => {
    await vault.verify("notanid", data, respSign2.result.signature);
  };
  await expect(f()).rejects.toThrow(PangeaErrors.APIError);

  // # Verify wrong signature
  f = async () => {
    await vault.verify(id, data, "thisisnotasignature");
  };
  await expect(f()).rejects.toThrow(PangeaErrors.APIError);

  // verify wrong signature
  const respVerifyBad1 = await vault.verify(id, data, respSign1.result.signature);
  expect(respVerifyBad1.result.valid_signature).toBe(false);

  // verify wrong data
  const respVerifyBad2 = await vault.verify(
    id,
    "thisisnottheoriginaldata",
    respSign2.result.signature
  );
  expect(respVerifyBad2.result.valid_signature).toBe(false);

  // Revoke key
  const respRevoke = await vault.revoke(id);
  expect(respRevoke.result.id).toBe(id);

  // Verify after revoked
  const respVerify1 = await vault.verify(id, data, respSign1.result.signature, {
    version: 1,
  });
  expect(respVerify1.result.valid_signature).toBe(true);
}

async function encryptingCycle(id: string) {
  const msg = "thisisamessagetoencrypt";
  const dataB64 = strToB64(msg);

  // Encrypt 1
  const respEnc1 = await vault.encrypt(id, dataB64);
  expect(respEnc1.result.id).toBe(id);
  expect(respEnc1.result.version).toBe(1);
  expect(respEnc1.result.cipher_text).toBeDefined();

  // Rotate
  const respRotate = await vault.keyRotate(id);
  expect(respRotate.result.id).toBe(id);
  expect(respRotate.result.version).toBe(2);

  // Encrypt 2
  const respEnc2 = await vault.encrypt(id, dataB64);
  expect(respEnc2.result.id).toBe(id);
  expect(respEnc2.result.version).toBe(2);
  expect(respEnc2.result.cipher_text).toBeDefined();

  // Decrypt 1
  const respDec1 = await vault.decrypt(id, respEnc1.result.cipher_text, {
    version: 1,
  });
  expect(respDec1.result.plain_text).toBe(dataB64);

  // Decrypt 2
  const respDec2 = await vault.decrypt(id, respEnc2.result.cipher_text, {
    version: 2,
  });
  expect(respDec2.result.plain_text).toBe(dataB64);

  // Decrypt default
  const respDecDefault = await vault.decrypt(id, respEnc2.result.cipher_text);
  expect(respDecDefault.result.plain_text).toBe(dataB64);

  // Decrypt wrong version
  const respDecBad1 = await vault.decrypt(id, respEnc1.result.cipher_text);
  expect(respDecBad1.result.plain_text).not.toBe(dataB64);

  let f = async () => {
    await vault.decrypt("notandid", respEnc2.result.cipher_text);
  };

  await expect(f()).rejects.toThrow(PangeaErrors.APIError);

  // Revoke key
  const respRevoke = await vault.revoke(id);
  expect(respRevoke.result.id).toBe(id);

  // Decrypt after revoked
  const respDec1Revoked = await vault.decrypt(id, respEnc1.result.cipher_text, {
    version: 1,
  });
  expect(respDec1Revoked.result.plain_text).toBe(dataB64);
}

jest.setTimeout(60000);
it("ed25519 generate, store and signing life cycle", async () => {
  const algorithm = Vault.AsymmetricAlgorithm.Ed25519;
  const purpose = Vault.KeyPurpose.SIGNING;

  const respGen = await vault.asymmetricGenerate({
    algorithm: algorithm,
    purpose: purpose,
    managed: false,
    store: false,
  });

  expect(respGen.result.id).toBeUndefined();
  expect(respGen.result.public_key).toBeDefined();
  expect(respGen.result.private_key).toBeDefined();

  const respStore = await vault.asymmetricStore(
    algorithm,
    respGen.result.public_key,
    String(respGen.result.private_key),
    {
      purpose: purpose,
    }
  );

  const id = respStore.result.id;
  expect(id).toBeDefined();
  expect(respStore.result.version).toBe(1);
  await signingCycle(id);
});

jest.setTimeout(60000);
it("AES generate, store and encrypting life cycle", async () => {
  const algorithm = Vault.SymmetricAlgorithm.AES;

  const respGen = await vault.symmetricGenerate({
    algorithm: algorithm,
    managed: false,
    store: false,
  });

  expect(respGen.result.id).toBeUndefined();
  expect(respGen.result.key).toBeDefined();

  const respStore = await vault.symmetricStore(algorithm, String(respGen.result.key));

  const id = respStore.result.id;
  expect(id).toBeDefined();
  expect(respStore.result.version).toBe(1);
  await encryptingCycle(id);
});
