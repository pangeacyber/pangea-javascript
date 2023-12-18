/* eslint-disable no-console */

import {
  PangeaConfig,
  DomainIntelService,
  PangeaErrors,
} from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({
  domain: domain,
  queuedRetryEnabled: true,
  pollResultTimeoutMs: 60 * 1000,
});
const domainIntel = new DomainIntelService(String(token), config);

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
  console.log("Checking domain...");

  const options = { provider: "domaintools", verbose: true, raw: true };
  try {
    const domains = [
      "pemewizubidob.cafij.co.za",
      "redbomb.com.tr",
      "kmbk8.hicp.net",
    ];
    const response = await domainIntel.reputationBulk(domains, options);
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
