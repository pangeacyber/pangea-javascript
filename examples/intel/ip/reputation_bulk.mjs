/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
const ipIntel = new IPIntelService(String(token), config);

function printData(indicator, data) {
  console.log(`\t Indicator: ${indicator}`);
  console.log(`\t\t Verdict: ${data.verdict}`);
  console.log(`\t\t Score: ${data.score}`);
  console.log(`\t\t Category: ${data.category}`);
}

function printBulkData(data) {
  for (const [key, value] of Object.entries(data)) {
    printData(key, value);
  }
}

(async () => {
  console.log("Checking IP...");

  const options = { provider: "crowdstrike", verbose: true, raw: true };
  try {
    const ips = ["93.231.182.110", "190.28.74.251"];
    const response = await ipIntel.reputationBulk(ips, options);

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
