/* eslint-disable no-console */

import { PangeaConfig, AuditService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_AUDIT_CUSTOM_SCHEMA_TOKEN;
const config = new PangeaConfig({
  baseURLTemplate: process.env.PANGEA_URL_TEMPLATE,
});
const audit = new AuditService(token, config);

(async () => {
  const msg = "node-sdk-custom-schema-example";

  const data = {
    message: msg,
    field_int: 1,
    field_bool: true,
    field_str_short: "node-sdk-no-signed",
    field_str_long:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lacinia, orci eget commodo commodo non.",
    field_time: new Date(Date.now()).toISOString(),
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
