/* eslint-disable no-console */

import {
  PangeaConfig,
  FileScanService,
  PangeaErrors,
  TransferMethod,
  getFileUploadParams,
  FileScanUploader,
} from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_FILE_SCAN_TOKEN;

// To enable sync mode, set queuedRetryEnabled to true and set a timeout
const config = new PangeaConfig({
  domain: domain,
  queuedRetryEnabled: true,
  pollResultTimeoutMs: 60 * 1000,
});
const client = new FileScanService(String(token), config);

const yourFilepath = "./testfile.pdf";

// helper function. Sleep for some time
const delay = async (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

(async () => {
  console.log("Checking file...");

  let response;
  try {
    const request = {
      verbose: true,
      raw: true,
      provider: "reversinglabs",
      transfer_method: TransferMethod.PUT_URL,
    };

    // Only the TransferMethod is needed when using TransferMethod.PUT_URL, in addition to the standard parameters
    // request an upload url
    response = await client.requestUploadURL(request);

    // extract upload url that should be posted with the file
    const url = response.accepted_result?.accepted_status.upload_url || "";
    console.log(`Got presigned url: ${url}`);

    // Create an uploader and upload the file
    const uploader = new FileScanUploader();
    await uploader.uploadFile(
      url,
      {
        file: yourFilepath,
        name: "file",
      },
      {
        transfer_method: TransferMethod.PUT_URL,
      }
    );

    console.log("Upload file success");

    console.log("Poll for the scan result...");
    const maxRetry = 12;

    for (let retry = 0; retry < maxRetry; retry++) {
      try {
        await delay(10 * 1000);
        const request_id = response.request_id || "";
        response = await client.pollResult(request_id);
        console.log("Result:", response.result);
        break;
      } catch {
        console.log(`Result is not ready yet. Retry: ${retry}`);
      }
    }
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log(e.toString());
    } else {
      console.log("Error: ", e);
    }
  }
})();
