/* eslint-disable no-console */

import { PangeaConfig, SanitizeService, TransferMethod } from "pangea-node-sdk";

// Load Pangea token and domain from environment variables
const token = process.env.PANGEA_SANITIZE_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

// Create Sanitize client
const client = new SanitizeService(token, config);

// Set your own file path
const filepath = "./ds11.pdf";

(async () => {
  try {
    // Create Sanitize file information, setting scan and crd providers
    let file_scan = {
      scan_provider: "crowdstrike",
      cdr_provider: "apryse",
    };

    // Create content sanitization config
    let content = {
      url_intel: true,
      url_intel_provider: "crowdstrike",
      domain_intel: true,
      domain_intel_provider: "crowdstrike",
      defang: true,
      defang_threshold: 20,
      remove_interactive: true,
      remove_attachments: true,
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
    console.log("\tCDR data:", JSON.stringify(response.result.data.cdr));

    if (response.result.data.malicious_file) {
      console.log("File IS malicious");
    } else {
      console.log("File is NOT malicious");
    }
  } catch (e) {
    console.log(e.toString());
    process.exit(1);
  }
})();
