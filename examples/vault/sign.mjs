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
    const createResponse = await vault.asymmetricGenerate(
      Vault.AsymmetricAlgorithm.Ed25519,
      Vault.KeyPurpose.SIGNING,
      name
    );
    console.log("Response: %s", createResponse.result);
    const keyID = createResponse.result.id;

    console.log("Sign...");
    const data = Buffer.from("mymessagetosign", "utf8").toString("base64");
    const signResponse = await vault.sign(keyID, data);
    console.log("Response: %s", signResponse.result);

    console.log("Verify...");
    const verifyResponse = await vault.verify(
      keyID,
      data,
      signResponse.result.signature
    );

    if (verifyResponse.result.valid_signature) {
      console.log("Signature is valid");
    } else {
      console.log("Signature is invalid");
    }
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.toString());
    } else {
      throw err;
    }
  }
})();
