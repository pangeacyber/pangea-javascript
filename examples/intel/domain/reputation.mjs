/* eslint-disable no-console */

import {
  PangeaConfig,
  DomainIntelService,
  PangeaErrors,
} from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const domainIntel = new DomainIntelService(String(token), config);

(async () => {
  console.log("Checking domain...");

  const options = { provider: "domaintools", verbose: true, raw: true };
  try {
    const response = await domainIntel.reputation(
      "737updatesboeing.com",
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
