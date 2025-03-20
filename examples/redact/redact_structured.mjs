/* eslint-disable no-console */

import process from "node:process";

import { PangeaConfig, RedactService } from "pangea-node-sdk";

const token = process.env.PANGEA_REDACT_TOKEN;
const config = new PangeaConfig({
  baseURLTemplate: process.env.PANGEA_URL_TEMPLATE,
});

const redact = new RedactService(token, config);

(async () => {
  const data = {
    phone: "415-867-5309",
    name: "Jenny Jenny",
  };

  console.log("Redacting PII from: %s", JSON.stringify(data));
  const response = await redact.redactStructured(data);
  console.log(
    "Redacted data: %s",
    JSON.stringify(response.result.redacted_data)
  );
})();
