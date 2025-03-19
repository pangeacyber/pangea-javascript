/* eslint-disable no-console */

import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const ipIntel = new IPIntelService(String(token), config);

function printData(indicator, data) {
  console.log(`\t Indicator: ${indicator}`);
  console.log(`\t\t Verdict: ${data.verdict}`);
  console.log(`\t\t Score: ${data.score}`);
  console.log(`\t\t Category: ${data.category}`);
}

(async () => {
  console.log("Checking IP...");

  const options = { provider: "crowdstrike", verbose: true, raw: true };
  try {
    const indicator = "93.231.182.110";
    const response = await ipIntel.reputation(indicator, options);

    console.log("Result: ");
    printData(indicator, response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
