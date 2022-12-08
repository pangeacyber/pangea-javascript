/* eslint-disable no-console */

import { PangeaConfig, FileIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_FILE_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const fileIntel = new FileIntelService(String(token), config);

(async () => {
  console.log("Checking file...");

  const options = { provider: "reversinglabs", verbose: true, raw: true };
  try {
    const response = await fileIntel.lookup(
      "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
      "sha256",
      options
    );
    console.log(response.result);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
