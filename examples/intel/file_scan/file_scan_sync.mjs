/* eslint-disable no-console */

import { PangeaConfig, FileScanService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;

// To work in sync it's need to set up queuedRetryEnabled to true and set up a proper timeout
// If timeout it's so little service won't end up and will return an AcceptedRequestException anyway
const config = new PangeaConfig({
  domain: domain,
  queuedRetryEnabled: true,
  pollResultTimeoutMs: 60 * 1000,
});
const intel = new FileScanService(String(token), config);

const yourFilepath = "./intel/file_scan/testfile.pdf";

(async () => {
  console.log("Checking file...");

  try {
    const request = { verbose: true, raw: true, provider: "crowdstrike" };
    const response = await intel.fileScan(request, yourFilepath);
    console.log("Result:", response.result);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log(e.toString());
    } else {
      console.log("Error: ", e);
    }
  }
})();
