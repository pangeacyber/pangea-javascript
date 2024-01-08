/* eslint-disable no-console */

import { PangeaConfig, AuditService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_AUDIT_MULTICONFIG_TOKEN;
const configId = process.env.PANGEA_AUDIT_CONFIG_ID;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

// Set configId in service constructor
const audit = new AuditService(token, config, undefined, configId);

(async () => {
  const data = {
    message: "Hello, World!",
  };

  try {
    console.log("Logging: %s", data.message);
    const logResponse = await audit.log(data, { verbose: true });
    console.log("Response: %s", logResponse.result);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.toString());
    } else {
      throw err;
    }
  }
})();
