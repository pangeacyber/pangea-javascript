/* eslint-disable no-console */

import { PangeaConfig, FileIntelService, PangeaErrors } from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
const fileIntel = new FileIntelService(String(token), config);

function printData(indicator, data) {
  console.log(`\t Indicator: ${indicator}`);
  console.log(`\t\t Verdict: ${data.verdict}`);
  console.log(`\t\t Score: ${data.score}`);
  console.log(`\t\t Category: ${data.category}`);
}

function printBulkData(data) {
  for (const [key, value] of Object.entries(data)) {
    printData(key, value);
  }
}

(async () => {
  console.log("Checking hashes...");

  const options = { provider: "reversinglabs", verbose: true, raw: true };
  try {
    const hashes = [
      "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
      "179e2b8a4162372cd9344b81793cbf74a9513a002eda3324e6331243f3137a63",
    ];

    const response = await fileIntel.hashReputationBulk(
      hashes,
      "sha256",
      options
    );

    console.log("Result: ");
    printBulkData(response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      throw err;
    }
  }
})();
