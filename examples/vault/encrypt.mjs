/* eslint-disable no-console */

import { PangeaConfig, VaultService, PangeaErrors, Vault} from "pangea-node-sdk";

const token = process.env.PANGEA_VAULT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const vault = new VaultService(token, config);

(async () => {
  try {
    console.log("Create...");
    const createRespose = await vault.symmetricGenerate(Vault.SymmetricAlgorithm.AES, Vault.KeyPurpose.ENCRYPTING, "My key name");
    console.log("Response: %s", createRespose.result);
    const keyID = createRespose.result.id;

    console.log("Encrypt...");
    const text = "mymessagetoencrypt";
    const data = Buffer.from(text, "utf8").toString("base64");
    const encryptResponse = await vault.sign(keyID, data);
    console.log("Response: %s", encryptResponse.result);

    console.log("Decrypt...");
    const decryptResponse = await vault.decrypt(keyID, data, encryptResponse.result.cipher_text);
    console.log("Response: %s", decryptResponse.result)

    if(decryptResponse.result.plain_text == text){
      console.log("Encrypt/decrypt worked");
    } else {
      console.log("Encrypt/decrypt failed");
    }

  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();
