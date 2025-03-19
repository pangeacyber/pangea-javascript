/* eslint-disable no-console */

import {
  PangeaConfig,
  PangeaErrors,
  SanitizeService,
  TransferMethod,
} from "pangea-node-sdk";

// Load Pangea token and domain from environment variables
const token = process.env.PANGEA_SANITIZE_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: process.env.PANGEA_URL_TEMPLATE });

// Create Sanitize client
const client = new SanitizeService(token, config);

// Set your own file path
const filepath = "./test-sanitize.txt";

(async () => {
  try {
    // Create Sanitize file information
    let file_scan = { scan_provider: "crowdstrike" };

    // Create content sanitization config
    let content = {
      url_intel: true,
      url_intel_provider: "crowdstrike",
      domain_intel: true,
      domain_intel_provider: "crowdstrike",
      defang: true,
      defang_threshold: 20,
      redact: true,
    };

    // Disable Secure Share output and its folder
    let share_output = {
      enabled: false,
    };
    // Make the request to Sanitize service
    console.log("Sending request to Sanitize service...");
    const request = {
      transfer_method: TransferMethod.MULTIPART, // Set transfer method to multipart
      file: file_scan,
      content: content,
      share_output: share_output,
      uploaded_file_name: "uploaded_file",
    };

    const response = await client.sanitize(request, {
      file: filepath,
      name: "file",
    });

    console.log("Sanitize request success");
    console.log("File Share ID: ", response.result.dest_share_id);
    console.log("Download URL: ", response.result.dest_url);
    console.log("\tRedact data:", JSON.stringify(response.result.data.redact));
    console.log("\tDefang data:", JSON.stringify(response.result.data.defang));

    if (response.result.data.malicious_file) {
      console.log("File IS malicious");
    } else {
      console.log("File is NOT malicious");
    }
  } catch (e) {
    if (e instanceof PangeaErrors.AcceptedRequestException) {
      console.log(
        `The result of request '${e.request_id}' took too long to be ready.`
      );
      process.exit(0);
    }

    console.log(e.toString());
    process.exit(1);
  }
})();
