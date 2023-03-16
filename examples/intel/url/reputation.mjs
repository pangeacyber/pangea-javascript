/* eslint-disable no-console */

import { PangeaConfig, URLIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_URL_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const urlIntel = new URLIntelService(String(token), config);

(async () => {
  console.log("Checking url...");

  const options = { provider: "crowdstrike", verbose: true, raw: true };
  try {
    const response = await urlIntel.reputation(
      "http://113.235.101.11:54384",
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
