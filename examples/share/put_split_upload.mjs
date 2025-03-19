/* eslint-disable no-console */

import {
  PangeaConfig,
  ShareService,
  TransferMethod,
  FileUploader,
} from "pangea-node-sdk";
import * as fs from "fs";

// Load Pangea token and domain from environment variables
const token = process.env.PANGEA_SHARE_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: process.env.PANGEA_URL_TEMPLATE });

// Create Share client
const client = new ShareService(token, config);

// Create unique folder path
const time = Math.round(Date.now() / 1000);
const filepath = "./testfile.pdf";

// Auxiliary function
const delay = async (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

(async () => {
  try {
    console.log("Request upload url with put transfer method...");
    let response;
    // Create a file unique name
    const name = time + "_file_split_put_url";
    try {
      // Request upload url with put-url transfer method
      response = await client.requestUploadURL({
        transfer_method: TransferMethod.PUT_URL,
        name: name,
      });
    } catch (e) {
      console.log(e.toString());
      process.exit(1);
    }

    const url = response.accepted_result?.put_url || "";
    console.log(`Got URL: ${url}`);

    // Create FileUploader client
    const uploader = new FileUploader();

    // Read file content as buffer
    const data = fs.readFileSync(filepath);

    console.log("Uploading file...");
    // Upload the file to received url
    await uploader.uploadFile(
      url,
      {
        file: data,
        name: "file",
      },
      {
        transfer_method: TransferMethod.PUT_URL,
      }
    );

    const maxRetry = 12;
    let retry;
    for (retry = 0; retry < maxRetry; retry++) {
      try {
        console.log(`Polling result. Retry: ${retry}`);
        // Wait until result could be ready
        await delay(10 * 1000);
        const request_id = response.request_id || "";
        response = await client.pollResult(request_id);

        console.log(
          `Poll result success. Item ID: ${response.result.object.id}`
        );
        break;
      } catch {
        console.log("Result is not ready yet.");
      }
    }

    if (retry >= maxRetry) {
      console.log("Failed to poll result. Reached max retry.");
    }
  } catch (e) {
    console.log(e.toString());
    process.exit(1);
  }
})();
