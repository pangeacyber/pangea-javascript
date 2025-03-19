/* eslint-disable no-console */

import { PangeaConfig, VaultService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_VAULT_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: process.env.PANGEA_URL_TEMPLATE });
const vault = new VaultService(token, config);

(async () => {
  const secretV1 = "mySecret";
  const secretV2 = "myNEWSecret";

  try {
    console.log("Store...");
    // Name should be unique
    const name = "Node rotate example " + Date.now();
    const storeResponse = await vault.secretStore({
      secret: secretV1,
      name: name,
    });
    console.log("Response: %s", storeResponse.result);
    const id = storeResponse.result.id;

    console.log("Rotating...");
    const rotateResponse = await vault.secretRotate({
      id: id,
      secret: secretV2,
    });
    console.log("Response: %s", rotateResponse.result);

    console.log("Getting last version...");
    const getLastResponse = await vault.getItem({
      id: id,
    });
    console.log("Response: %s", getLastResponse.result);
    console.log("Version: ", getLastResponse.result.item_versions[0]);

    console.log("Getting version 1...");
    const getV1Response = await vault.getItem({
      id,
      version: "1",
    });
    console.log("Response: %s", getV1Response.result);
    console.log("Version: ", getV1Response.result.item_versions[0]);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.toString());
    } else {
      throw err;
    }
  }
})();
