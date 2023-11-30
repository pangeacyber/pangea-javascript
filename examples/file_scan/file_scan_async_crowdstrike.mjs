/* eslint-disable no-console */

import { PangeaConfig, FileScanService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_FILE_SCAN_TOKEN;

// To enable async mode, set queuedRetryEnabled to false
// When .fileScan() is called it will return an AcceptedError immediately when server returns a 202 response
const config = new PangeaConfig({ domain: domain, queuedRetryEnabled: false });
const client = new FileScanService(String(token), config);

const yourFilepath = "./testfile.pdf";

// helper function. Sleep for some time
const delay = async (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

(async () => {
  console.log("Checking file...");

  let exception;
  try {
    const request = { verbose: true, raw: true, provider: "crowdstrike" };
    const response = await client.fileScan(request, yourFilepath, {
      pollResultSync: false,
    });
    console.log("Scan success on first attempt...");
    console.log("Result:", response.result);
    process.exit(0);
  } catch (e) {
    if (e instanceof PangeaErrors.AcceptedRequestException) {
      console.log("This is an expected exception");
      // Save the exception for later, it has the request ID
      exception = e;
    } else {
      console.log("This is an unexpected exception");
      console.log(e.toString());
      process.exit(1);
    }
  }

  await delay(20 * 1000);
  const request_id = exception?.request_id || "";
  try {
    // multiple polling attempts may be required
    const response = await client.pollResult(request_id);
    console.log("Poll result success...");
    console.log("Result:", response.result);
  } catch (e) {
    if (e instanceof PangeaErrors.AcceptedRequestException) {
      console.log("Result is not ready yet");
    } else {
      console.log("This is an unexpected exception");
      console.log(e.toString());
      process.exit(1);
    }
  }
})();
