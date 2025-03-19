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
    console.log("Send multiple events");
    await audit.logBulkAsync([event1, event2], { verbose: true });
    console.log("Success");
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      console.log(err);
    }
  }
})();
