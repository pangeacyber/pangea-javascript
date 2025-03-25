/* eslint-disable no-console */

import { PangeaConfig, UserIntelService, PangeaErrors } from "pangea-node-sdk";

const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
const userIntel = new UserIntelService(String(token), config);

(async () => {
  console.log("Checking username...");

  const request = { username: "shortpatrick", verbose: true, raw: true };
  try {
    const response = await userIntel.userBreached(request);
    console.log("Result: ", response.result.data);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      throw err;
    }
  }
})();
