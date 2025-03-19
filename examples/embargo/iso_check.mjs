/* eslint-disable no-console */

import { PangeaConfig, EmbargoService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_EMBARGO_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: process.env.PANGEA_URL_TEMPLATE });
const embargo = new EmbargoService(token, config);

(async () => {
  const iso_country_code = "CU";
  console.log("Checking Embargo ISO code: '%s'", iso_country_code);

  try {
    const response = await embargo.isoCheck(iso_country_code);
    console.log("Response: ", response.result);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
