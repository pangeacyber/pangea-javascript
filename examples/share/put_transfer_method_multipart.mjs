/* eslint-disable no-console */

import { PangeaConfig, ShareService, TransferMethod } from "pangea-node-sdk";
import * as fs from "fs";

// Load Pangea token and domain from environment variables
const token = process.env.PANGEA_SHARE_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

// Create Share client
const client = new ShareService(token, config);

// Create unique folder path
const time = Math.round(Date.now() / 1000);
const filepath = "./testfile.pdf";

(async () => {
  try {
    console.log("Uploading file with multipart transfer method...");
    // Create a unique name
    const name = time + "_file_multipart";

    // Read file content as buffer
    const data = fs.readFileSync(filepath);

    // Send Put request setting transfer_method to multipart
    const respPut = await client.put(
      {
        name: name,
        transfer_method: TransferMethod.MULTIPART,
      },
      {
        file: data,
        name: name,
      }
    );

    console.log(`Upload success. Item ID: ${respPut.result.object.id}`);
  } catch (e) {
    console.log(e);
  }
})();
