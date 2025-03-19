/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
const ipIntel = new IPIntelService(String(token), config);

function printData(ip, data) {
  if (data.domain_found === true) {
    console.log(`\t IP ${ip} domain is: ${data.domain}`);
  } else {
    console.log(`\t IP ${ip} domain not found`);
  }
}

(async () => {
  console.log("Geolocate IP...");

  const options = { provider: "digitalelement", verbose: true, raw: true };
  try {
    const ip = "24.235.114.61";
    const response = await ipIntel.getDomain(ip, options);

    console.log("Result: ");
    printData(ip, response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      throw err;
    }
  }
})();
