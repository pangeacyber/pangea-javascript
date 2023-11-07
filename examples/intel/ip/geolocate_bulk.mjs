/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const ipIntel = new IPIntelService(String(token), config);

function printData(indicator, data){
  console.log(`\t Indicator: ${indicator}`);
  console.log(`\t\t country: ${data.country}`);
  console.log(`\t\t city: ${data.city}`);
  console.log(`\t\t latitude: ${data.latitude}`);
  console.log(`\t\t longitude: ${data.longitude}`);
  console.log(`\t\t postal_code: ${data.postal_code}`);
  console.log(`\t\t country_code: ${data.country_code}`);
}

function printBulkData(data) {
  for (const [key, value] of Object.entries(data)) {
    printData(key, value)
  }
}

(async () => {
  console.log("Geolocate IPs...");

  const options = {verbose: true, raw: true };
  try {
    const response = await ipIntel.geolocateBulk(["93.231.182.110", "24.235.114.61"], options);

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
