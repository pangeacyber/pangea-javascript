/* eslint-disable no-console */

/*
 This example code is intended to be run directly
 from the source code with `ts-node-esm`.

 % ts-node-esm intel.ts
*/

import { PangeaConfig, DomainIntelService, PangeaErrors } from "node-pangea";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_DOMAIN_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const domainIntel = new DomainIntelService(String(token), config);

(async () => {
  console.log("Checking domain...");

  const options = { provider: "domaintools", verbose: true, raw: true };
  try {
    const response = await domainIntel.lookup("737updatesboeing.com", options);
    console.log(response.result);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
