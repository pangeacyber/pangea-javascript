/* eslint-disable no-console */

import {
  PangeaConfig,
  SanitizeService,
  TransferMethod,
  FileUploader,
} from "pangea-node-sdk";
import * as fs from "fs";

// Load Pangea token and domain from environment variables
const token = process.env.PANGEA_SANITIZE_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

// Create Sanitize client
const client = new SanitizeService(token, config);

// Set your own file path
const filepath = "./test-sanitize.txt";

// Auxiliary function
const delay = async (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

(async () => {
  try {
    console.log("Request upload url with put transfer method...");
    let response;
    try {
      console.log("Requesting upload URL...");
      const request = {
        transfer_method: TransferMethod.PUT_URL,
        uploaded_file_name: "uploaded_file",
      };
      response = await client.requestUploadURL(request);
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

        console.log("Sanitize request success");
        console.log("File Share ID: ", response.result.dest_share_id);
        console.log("Download URL: ", response.result.dest_url);
        console.log(
          "\tRedact data:",
          JSON.stringify(response.result.data.redact)
        );
        console.log(
          "\tDefang data:",
          JSON.stringify(response.result.data.defang)
        );

        if (response.result.data.malicious_file) {
          console.log("File IS malicious");
        } else {
          console.log("File is NOT malicious");
        }
        break;
      } catch (e) {
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
