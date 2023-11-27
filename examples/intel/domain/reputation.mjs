/* eslint-disable no-console */

import {
  PangeaConfig,
  DomainIntelService,
  PangeaErrors,
} from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const domainIntel = new DomainIntelService(String(token), config);

function printData(indicator, data) {
  console.log(`\t Indicator: ${indicator}`);
  console.log(`\t\t Verdict: ${data.verdict}`);
  console.log(`\t\t Score: ${data.score}`);
  console.log(`\t\t Category: ${data.category}`);
}

(async () => {
  console.log("Checking domain...");

  const options = { provider: "domaintools", verbose: true, raw: true };
  try {
    const indicator = "737updatesboeing.com";
    const response = await domainIntel.reputation(indicator, options);

    console.log("Result: ");
    printData(indicator, response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error:", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
