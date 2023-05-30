/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const ipIntel = new IPIntelService(String(token), config);

(async () => {
  console.log("Geolocate IP...");

  const options = { provider: "digitalelement", verbose: true, raw: true };
  try {
    const response = await ipIntel.getDomain("24.235.114.61", options);
    if(response.result.data.domain_found === true){      
      console.log("IP's domain is:", response.result.data.domain);
    } else {
      console.log("IP's domain not found");
    }
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
