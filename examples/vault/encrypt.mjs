/* eslint-disable no-console */

import {
  PangeaConfig,
  VaultService,
  PangeaErrors,
  Vault,
} from "pangea-node-sdk";

const token = process.env.PANGEA_VAULT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const vault = new VaultService(token, config);

(async () => {
  try {
    console.log("Create...");
    // Name should be unique
    const name = "Node encrypt example " + Date.now();
    const createResponse = await vault.symmetricGenerate(
      Vault.SymmetricAlgorithm.AES128_CFB,
      Vault.KeyPurpose.ENCRYPTION,
      name
    );
    console.log("Response: %s", createResponse.result);
    const keyID = createResponse.result.id;

    console.log("Encrypt...");
    const text = "mymessagetoencrypt";
    const data = Buffer.from(text, "utf8").toString("base64");
    const encryptResponse = await vault.encrypt(keyID, data);
    console.log("Response: %s", encryptResponse.result);

    console.log("Decrypt...");
    const decryptResponse = await vault.decrypt(
      keyID,
      encryptResponse.result.cipher_text
    );
    console.log("Response: %s", decryptResponse.result);

    if (decryptResponse.result.plain_text === data) {
      console.log("Encrypt/decrypt worked");
    } else {
      console.log("Encrypt/decrypt failed");
    }
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.toString());
    } else {
      throw err;
    }
  }
})();
