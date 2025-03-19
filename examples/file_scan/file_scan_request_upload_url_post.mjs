/* eslint-disable no-console */

import {
  PangeaConfig,
  FileScanService,
  PangeaErrors,
  TransferMethod,
  getFileUploadParams,
  FileScanUploader,
} from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_FILE_SCAN_TOKEN;

// To enable sync mode, set queuedRetryEnabled to true and set a timeout
const config = new PangeaConfig({
  baseURLTemplate: urlTemplate,
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
      transfer_method: TransferMethod.POST_URL,
    };

    // extract upload url and upload details that should be posted with the file
    const params = getFileUploadParams(yourFilepath);

    // request an upload url
    response = await client.requestUploadURL(request, {
      params: params,
    });

    // extract upload url and upload details that should be posted with the file
    const url = response.accepted_result?.post_url || "";
    const file_details = response.accepted_result?.post_form_data;
    console.log(`Got presigned url: ${url}`);

    // Create an uploader and upload the file
    const uploader = new FileScanUploader();
    await uploader.uploadFile(
      url,
      {
        file: yourFilepath,
        name: "file",
        file_details: file_details,
      },
      {
        transfer_method: TransferMethod.POST_URL,
      }
    );

    console.log("Upload file success");

    console.log("Let's try to poll scan result...");
    const maxRetry = 12;

    for (let retry = 0; retry < maxRetry; retry++) {
      try {
        await delay(10 * 1000);
        const request_id = response.request_id || "";
        // multiple polling attempts may be required
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
      throw err;
    }
  }
})();
