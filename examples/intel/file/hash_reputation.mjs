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

(async () => {
  console.log("Checking hash...");

  const options = { provider: "reversinglabs", verbose: true, raw: true };
  try {
    const indicator =
      "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e";
    const response = await fileIntel.hashReputation(
      indicator,
      "sha256",
      options
    );

    console.log("Result: ");
    printData(indicator, response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      throw err;
    }
  }
})();
