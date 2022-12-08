/* eslint-disable no-console */

import { PangeaConfig, EmbargoService , PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_EMBARGO_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const embargo = new EmbargoService(token, config);

(async () => {
  const ip = "213.24.238.26";
  console.log("Checking Embargo IP : '%s'", ip);

  try {
    const response = await embargo.ipCheck(ip);
    console.log("Response: ", response.result);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
