/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const ipIntel = new IPIntelService(String(token), config);

(async () => {
  console.log("Checking IP is proxy...");

  const options = { provider: "digitalelement", verbose: true, raw: true };
  try {
    const response = await ipIntel.isProxy("34.201.32.172", options);
    if (response.result.data.is_proxy === true) {
      console.log("IP is a proxy");
    } else {
      console.log("IP is not a proxy");
    }
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
