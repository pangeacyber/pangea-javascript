/* eslint-disable no-console */

import process from "node:process";

import { PangeaConfig, RedactService } from "pangea-node-sdk";

const token = process.env.PANGEA_REDACT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });

const redact = new RedactService(token, config);

(async () => {
  const text = "Hello, my phone number is 123-456-7890";
  console.log("Redacting PII from: %s", text);
  const redacted = await redact.redact(text, {
    redaction_method_overrides: {
      PHONE_NUMBER: {
        redaction_type: "fpe",
        fpe_alphabet: "numeric",
      },
    },
  });
  console.log("Redacted text: %s", redacted.result.redacted_text);

  const unredacted = await redact.unredact({
    redacted_data: redacted.result.redacted_text,
    fpe_context: redacted.result.fpe_context,
  });
  console.log("Unredacted text: %s", unredacted.result.data);
})();
