/* eslint-disable no-console */

import { PangeaConfig, URLIntelService, PangeaErrors } from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({
  domain: domain,
  queuedRetryEnabled: true,
  pollResultTimeoutMs: 60 * 1000,
});
const urlIntel = new URLIntelService(String(token), config);

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
  console.log("Checking url...");

  const options = { provider: "crowdstrike", verbose: true, raw: true };
  try {
    const urls = [
      "http://113.235.101.11:54384",
      "http://45.14.49.109:54819",
      "https://chcial.ru/uplcv?utm_term%3Dcost%2Bto%2Brezone%2Bland",
    ];
    const response = await urlIntel.reputationBulk(urls, options);

    console.log("Result: ");
    printBulkData(response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error:", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
