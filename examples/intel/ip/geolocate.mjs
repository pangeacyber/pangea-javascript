/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const ipIntel = new IPIntelService(String(token), config);

function printData(indicator, data) {
  console.log(`\t Indicator: ${indicator}`);
  console.log(`\t\t country: ${data.country}`);
  console.log(`\t\t city: ${data.city}`);
  console.log(`\t\t latitude: ${data.latitude}`);
  console.log(`\t\t longitude: ${data.longitude}`);
  console.log(`\t\t postal_code: ${data.postal_code}`);
  console.log(`\t\t country_code: ${data.country_code}`);
}

(async () => {
  console.log("Geolocate IP...");

  const options = { provider: "digitalelement", verbose: true, raw: true };
  try {
    const ip = "93.231.182.110";
    const response = await ipIntel.geolocate(ip, options);

    console.log("Result: ");
    printData(ip, response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
