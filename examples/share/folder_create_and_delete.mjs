/* eslint-disable no-console */

import { PangeaConfig, ShareService } from "pangea-node-sdk";

// Load Pangea token and domain from environment variables
const token = process.env.PANGEA_SHARE_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

// Create Share client
const client = new ShareService(token, config);

// Create unique folder path
const time = Math.round(Date.now() / 1000);
const folderPath = "/sdk_examples/node/delete/" + time;

(async () => {
  try {
    console.log("Creating folder...");
    const respCreate = await client.folderCreate({ folder: folderPath });

    const id = respCreate.result.object.id;
    console.log(`Folder create success. Folder ID: ${id}`);

    console.log("Deleting folder...");
    const respDelete = await client.delete({ id });

    console.log(`Deleted ${respDelete.result.count} item(s)`);
  } catch (e) {
    console.log(e);
  }
})();
