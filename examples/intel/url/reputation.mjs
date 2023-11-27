/* eslint-disable no-console */

import { PangeaConfig, URLIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const urlIntel = new URLIntelService(String(token), config);

function printData(indicator, data) {
  console.log(`\t Indicator: ${indicator}`);
  console.log(`\t\t Verdict: ${data.verdict}`);
  console.log(`\t\t Score: ${data.score}`);
  console.log(`\t\t Category: ${data.category}`);
}

(async () => {
  console.log("Checking url...");

  const options = { provider: "crowdstrike", verbose: true, raw: true };
  try {
    const indicator = "http://113.235.101.11:54384";
    const response = await urlIntel.reputation(indicator, options);

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
