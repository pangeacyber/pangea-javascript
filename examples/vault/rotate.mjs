/* eslint-disable no-console */

import { PangeaConfig, VaultService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_VAULT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const vault = new VaultService(token, config);

(async () => {
  const secretV1 = "mySecret";
  const secretV2 = "myNEWSecret";

  try {
    console.log("Store...");
    // Name should be unique
    const name = "Node rotate example " + Date.now()
    const storeResponse = await vault.secretStore(secretV1, name);
    console.log("Response: %s", storeResponse.result);
    const id = storeResponse.result.id;

    console.log("Rotating...");
    const rotateResponse = await vault.secretRotate(id, secretV2);
    console.log("Response: %s", rotateResponse.result);

    console.log("Getting last version...");
    const getLastResponse = await vault.getItem(id);
    console.log("Response: %s", getLastResponse.result);
    console.log("Current versions: ", getLastResponse.result.current_version);

    console.log("Getting version 1...");
    const getV1Response = await vault.getItem(id, { version: "1" });
    console.log("Response: %s", getV1Response.result);
    console.log("Version: ", getV1Response.result.versions[0]);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.toString());
    } else {
      throw err;
    }
  }
})();
