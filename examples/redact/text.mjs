/* eslint-disable no-console */

import { PangeaConfig, RedactService } from "pangea-node-sdk";

const token = process.env.PANGEA_REDACT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const redact = new RedactService(token, config);

(async () => {
  const text = "Hello, my phone number is 123-456-7890";
  console.log("Redacting PII from: '%s'", text);
  const response = await redact.redact(text);

  if (response.success) {
    console.log("Success:", response.result);
  } else {
    console.log("Error", response.code, response.result);
  }
})();
