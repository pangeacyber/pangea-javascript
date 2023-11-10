/* eslint-disable no-console */

import { PangeaConfig, AuditService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_AUDIT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
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
  } catch (err) {
    if (err instanceof PangeaErrors.AcceptedRequestException) {
      console.log("AcceptedRequestException as expected");
    } else if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();
