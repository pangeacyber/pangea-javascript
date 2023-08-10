/* eslint-disable no-console */

import { PangeaConfig, FileIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const fileIntel = new FileIntelService(String(token), config);

(async () => {
  console.log("Checking file...");

  const options = { provider: "reversinglabs", verbose: true, raw: true };
  try {
    const response = await fileIntel.filepathReputation("./README.md", options);
    console.log("Result: ", response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
