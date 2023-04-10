/* eslint-disable no-console */

import {
  Intel,
  PangeaConfig,
  UserIntelService,
  PangeaErrors,
} from "pangea-node-sdk";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_INTEL_TOKEN;
const config = new PangeaConfig({ domain: domain });
const userIntel = new UserIntelService(String(token), config);

(async () => {
  console.log("Checking password breached...");

  const options = { verbose: true, raw: true };
  try {
    const response = await userIntel.passwordBreached(
      Intel.HashType.SHA256,
      "5baa6",
      options
    );
    console.log(response.result);
  } catch (e) {
    if (e instanceof PangeaErrors.APIError) {
      console.log("Error", e.summary, e.errors);
    } else {
      console.log("Error: ", e);
    }
  }
})();
