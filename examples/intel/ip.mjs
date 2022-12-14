/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_IP_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const ipIntel = new IPIntelService(String(token), config);

(async () => {
  console.log("Checking IP...");

  const options = { provider: "domaintools", verbose: true, raw: true };
  try {
    const response = await ipIntel.lookup("93.231.182.110", options);
    console.log(response.result);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
