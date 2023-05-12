/* eslint-disable no-console */

import { PangeaConfig, FileScanService, PangeaErrors } from "pangea-node-sdk";
import fs from "fs";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;

// To work in async it's need to set up queuedRetryEnabled to false
// When we call .fileScan() it will return an AcceptedRequestException inmediatly if server return a 202 response
const config = new PangeaConfig({ domain: domain, queuedRetryEnabled: false });
const intel = new FileScanService(String(token), config);

const EICAR =
  "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*\n";
const yourFilepath = "./file.exe";

// Helper function. Create a EICAR file
function createEICAR() {
  fs.writeFileSync(yourFilepath, EICAR);
}

// helper function. Sleep some time
const delay = async (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

(async () => {
  console.log("Checking file...");

  // Here we create a file that will give us a malicious result as example
  createEICAR();

  let exception;
  try {
    const request = { verbose: true, raw: true, provider: "reversinglabs" };
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
      console.log(e);
    }
  }

  // Wait until result could be ready
  await delay(30 * 1000);
  const request_id = exception?.request_id || "";
  const response = await intel.pollResult(request_id);
  console.log("Result:", response.result);
})();
