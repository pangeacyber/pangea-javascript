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
    const createRespose = await vault.asymmetricGenerate(
      Vault.AsymmetricAlgorithm.Ed25519,
      Vault.KeyPurpose.SIGNING,
      "My key name"
    );
    console.log("Response: %s", createRespose.result);
    const keyID = createRespose.result.id;

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

    if (verifyResponse.result.valid_signature == true) {
      console.log("Signature is valid");
    } else {
      console.log("Signature is invalid");
    }
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();
