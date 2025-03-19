/* eslint-disable no-console */

import { PangeaConfig, AuditService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_AUDIT_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: process.env.PANGEA_URL_TEMPLATE });
const audit = new AuditService(token, config);

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
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();
