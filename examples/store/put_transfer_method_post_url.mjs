/* eslint-disable no-console */

import { PangeaConfig, StoreService, TransferMethod } from "pangea-node-sdk";
import * as fs from "fs";

// Load pangea token and domain from environment variables
const token = process.env.PANGEA_STORE_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

// Create Store client
const client = new StoreService(token, config);

// Create unique folder path
const time = Math.round(Date.now() / 1000);
const filepath = "./testfile.pdf";

(async () => {
  try {
    console.log("Uploading file with post-url transfer method...");
    // Create a unique name
    const name = time + "_file_post_url";

    // Read file content as buffer
    const data = fs.readFileSync(filepath);

    // Send Put request setting transfer_method to post-url
    // SDK will request an upload url, post the file to that url and then poll the upload result to Store service
    const respPut = await client.put(
      {
        name: name,
        transfer_method: TransferMethod.POST_URL,
      },
      {
        file: data,
        name: name,
      }
    );

    console.log(`Upload success. Item ID: ${respPut.result.object.id}`);
  } catch (e) {
    console.log(e.toString());
  }
})();
