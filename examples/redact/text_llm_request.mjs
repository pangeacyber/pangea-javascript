/* eslint-disable no-console */

import process from "node:process";

import { PangeaConfig, RedactService } from "pangea-node-sdk";

const token = process.env.PANGEA_REDACT_TOKEN;
const config = new PangeaConfig({
  baseURLTemplate: process.env.PANGEA_URL_TEMPLATE,
});

const redact = new RedactService(token, config);

(async () => {
  const text = "Visit our website at https://pangea.cloud";
  console.log("Redacting PII from: %s", text);
  const redacted = await redact.redact(text, { llm_request: true });
  console.log("Redacted text: %s", redacted.result.redacted_text);

  const unredacted = await redact.unredact({
    redacted_data: redacted.result.redacted_text,
    fpe_context: redacted.result.fpe_context,
  });
  console.log("Unredacted text: %s", unredacted.result.data);
})();
