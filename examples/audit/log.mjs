/* eslint-disable no-console */

import { PangeaConfig, AuditService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_AUDIT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const audit = new AuditService(token, config);

(async () => {
  const data = {
    message: "Hello, World!",
  };

  try {
    console.log("Logging audit data...");
    const logResponse = await audit.log(data);
    console.log(logResponse.status, logResponse.result);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();
