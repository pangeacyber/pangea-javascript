/* eslint-disable no-console */

import { PangeaConfig, RedactService, PangeaErrors } from "pangea-node-sdk";

const token = process.env.PANGEA_REDACT_MULTICONFIG_TOKEN;
const configId = process.env.PANGEA_REDACT_CONFIG_ID;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

// Set configId in service constructor
const redact = new RedactService(token, config, {config_id: configId});

(async () => {
  const text = "Hello, my phone number is 123-456-7890";
  console.log("Redacting PII from: '%s'", text);
  try {
    const response = await redact.redact(text);
    console.log("Redacted text:", response.result.redacted_text);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.toString());
    } else {
      throw err;
    }
  }

})();
