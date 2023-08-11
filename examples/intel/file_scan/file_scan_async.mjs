/* eslint-disable no-console */

import { PangeaConfig, FileScanService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;

// To work in async it's need to set up queuedRetryEnabled to false
// When we call .fileScan() it will return an AcceptedRequestException inmediatly if server return a 202 response
const config = new PangeaConfig({ domain: domain, queuedRetryEnabled: false });
const intel = new FileScanService(String(token), config);

const yourFilepath = "./intel/file_scan/testfile.pdf";

// helper function. Sleep some time
const delay = async (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

(async () => {
  console.log("Checking file...");

  let exception;
  try {
    const request = { verbose: true, raw: true, provider: "crowdstrike" };
    const response = await intel.fileScan(request, yourFilepath, {
      pollResultSync: false,
    });
  } catch (e) {
    if (e instanceof PangeaErrors.AcceptedRequestException) {
      console.log("This is an expected exception");
      // Let's save the exception to poll result in a while
      exception = e;
    } else {
      console.log("This is an unexpected exception");
      console.log(e.toString());
      process.exit(1);
    }
  }

  // Wait until result could be ready
  await delay(30 * 1000);
  const request_id = exception?.request_id || "";
  const response = await intel.pollResult(request_id);
  console.log("Result:", response.result);
})();
