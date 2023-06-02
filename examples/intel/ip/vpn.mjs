/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const ipIntel = new IPIntelService(String(token), config);

(async () => {
  console.log("Checking IP is a VPN...");

  const options = { provider: "digitalelement", verbose: true, raw: true };
  try {
    const response = await ipIntel.isVPN("2.56.189.74", options);
    if (response.result.data.is_vpn === true) {
      console.log("IP is a VPN");
    } else {
      console.log("IP is not a VPN");
    }
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
