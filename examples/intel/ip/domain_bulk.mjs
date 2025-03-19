/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const ipIntel = new IPIntelService(String(token), config);

function printData(ip, data) {
  if (data.domain_found === true) {
    console.log(`\t IP ${ip} domain is: ${data.domain}`);
  } else {
    console.log(`\t IP ${ip} domain not found`);
  }
}

function printBulkData(data) {
  for (const [key, value] of Object.entries(data)) {
    printData(key, value);
  }
}

(async () => {
  console.log("Geolocate IPs...");

  const options = { provider: "digitalelement", verbose: true, raw: true };
  try {
    const response = await ipIntel.getDomainBulk(
      ["93.231.182.110", "24.235.114.61"],
      options
    );

    console.log("Result: ");
    printBulkData(response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
