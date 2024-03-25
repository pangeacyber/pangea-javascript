/* eslint-disable no-console */

import {
  PangeaConfig,
  SanitizeService,
  TransferMethod,
  PangeaErrors,
} from "pangea-node-sdk";

// Load Pangea token and domain from environment variables
const token = process.env.PANGEA_SANITIZE_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

// Create Sanitize client
const client = new SanitizeService(token, config);

// Set your own file path
const filepath = "./ds11.pdf";

// Auxiliary function
const delay = async (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

(async () => {
  let exception;
  try {
    console.log("Request upload url with put transfer method...");
    try {
      console.log("Sending request to Sanitize service...");
      const request = {
        transfer_method: TransferMethod.POST_URL,
        uploaded_file_name: "uploaded_file",
      };
      await client.sanitize(
        request,
        {
          file: filepath,
          name: "file",
        },
        {
          pollResultSync: false, // Disable polling result just for this request
        }
      );
    } catch (e) {
      if (e instanceof PangeaErrors.AcceptedRequestException) {
        console.log("Received AcceptedRequestException as expected");
        exception = e;
      } else {
        console.log(e);
        process.exit(1);
      }
    }

    const maxRetry = 12;
    let retry;
    for (retry = 0; retry < maxRetry; retry++) {
      try {
        console.log(`Polling result. Retry: ${retry}`);
        // Wait until result could be ready
        await delay(10 * 1000);
        const request_id = exception?.request_id || "";
        const response = await client.pollResult(request_id);

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
        console.log("\tCDR data:", JSON.stringify(response.result.data.cdr));

        if (response.result.data.malicious_file) {
          console.log("File IS malicious");
        } else {
          console.log("File is NOT malicious");
        }
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
