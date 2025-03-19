/* eslint-disable no-console */

import { PangeaConfig, FileScanService, PangeaErrors } from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_FILE_SCAN_TOKEN;

// To enable sync mode, set queuedRetryEnabled to true and set a timeout
const config = new PangeaConfig({
  domain: domain,
  queuedRetryEnabled: true,
  pollResultTimeoutMs: 60 * 1000,
});
const client = new FileScanService(String(token), config);

const yourFilepath = "./testfile.pdf";

(async () => {
  console.log("Checking file...");

  try {
    const request = { verbose: true, raw: true, provider: "crowdstrike" };
    const response = await client.fileScan(request, yourFilepath);
    console.log("Result:", response.result);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log(e.toString());
    } else {
      console.log("Error: ", e);
    }
  }
})();
