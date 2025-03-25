/* eslint-disable no-console */

import { PangeaConfig, RedactService } from "pangea-node-sdk";

const token = process.env.PANGEA_REDACT_TOKEN;
const config = new PangeaConfig({
  baseURLTemplate: process.env.PANGEA_URL_TEMPLATE,
});
const redact = new RedactService(token, config);

(async () => {
  const text = "Hello, my phone number is 123-456-7890";
  console.log("Redacting PII from: '%s'", text);
  const response = await redact.redact(text);

  if (response.success) {
    console.log("Redacted text:", response.result.redacted_text);
  } else {
    console.log("Error", response.code, response.result);
  }
})();
