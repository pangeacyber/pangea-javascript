/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const ipIntel = new IPIntelService(String(token), config);

function printData(ip, data){
  if (data.is_proxy === true) {
    console.log(`\t IP ${ip} is a proxy`);
  } else {
    console.log(`\t IP ${ip} is not a proxy`);
  }
}

(async () => {
  console.log("Checking IP is proxy...");

  const options = { provider: "digitalelement", verbose: true, raw: true };
  try {
    const ip = "34.201.32.172";
    const response = await ipIntel.isProxy(ip, options);

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
