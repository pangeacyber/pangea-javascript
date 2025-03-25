/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
const ipIntel = new IPIntelService(String(token), config);

function printData(ip, data) {
  if (data.is_proxy === true) {
    console.log(`\t IP ${ip} is a proxy`);
  } else {
    console.log(`\t IP ${ip} is not a proxy`);
  }
}

function printBulkData(data) {
  for (const [key, value] of Object.entries(data)) {
    printData(key, value);
  }
}

(async () => {
  console.log("Checking IP is proxy...");

  const options = { verbose: true, raw: true };
  try {
    const response = await ipIntel.isProxyBulk(
      ["132.76.150.141", "24.235.114.61"],
      options
    );

    console.log("Result: ");
    printBulkData(response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      throw err;
    }
  }
})();
