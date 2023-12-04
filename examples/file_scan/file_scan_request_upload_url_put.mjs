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

// To work in sync it's need to set up queuedRetryEnabled to true and set up a proper timeout
// If timeout it's so little service won't end up and will return an AcceptedRequestException anyway
const config = new PangeaConfig({
  domain: domain,
  queuedRetryEnabled: true,
  pollResultTimeoutMs: 60 * 1000,
});
const client = new FileScanService(String(token), config);

const yourFilepath = "./testfile.pdf";

// helper function. Sleep some time
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

    // If use TransferMethod.PUT_URL it's not needed file params
    // request an upload url
    response = await client.requestUploadURL(request);

    // extract upload url and upload details that should be posted with the file
    // If use TransferMethod.PUT_URL it's not needed file_details
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

    console.log("Let's try to poll scan result...");
    const maxRetry = 12;

    for (let retry = 0; retry < maxRetry; retry++) {
      try {
        // Wait until result could be ready
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
