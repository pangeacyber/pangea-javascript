/* eslint-disable no-console */

import { PangeaConfig, AuditService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_AUDIT_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: process.env.PANGEA_URL_TEMPLATE });
const audit = new AuditService(token, config);

(async () => {
  const event1 = {
    message: "Sign up",
  };

  const event2 = {
    message: "Sign in",
  };

  try {
    console.log("Logging multiple events");
    const logResponse = await audit.logBulk([event1, event2], {
      verbose: true,
    });
    logResponse.result.results.forEach((result) => {
      console.log("Result: %s", result);
    });
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();
