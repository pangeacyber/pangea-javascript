/* eslint-disable no-console */

import {
  PangeaConfig,
  AuditService,
  VaultService,
  PangeaErrors,
} from "pangea-node-sdk";

const token = process.env.PANGEA_VAULT_TOKEN;
const audit_token_id = process.env.PANGEA_AUDIT_TOKEN_ID;
const config = new PangeaConfig({
  baseURLTemplate: process.env.PANGEA_URL_TEMPLATE,
});
const vault = new VaultService(token, config);

(async () => {
  try {
    console.log("Fetch the audit token...");
    const storeResponse = await vault.getItem({
      id: audit_token_id,
    });
    const audit_token = storeResponse.result.item_versions[0].secret;

    console.log("Create audit instance...");
    var audit = new AuditService(audit_token, config);
    const data = {
      message: "Hello, World!",
    };

    const logResponse = await audit.log(data, { verbose: true });
    console.log("Response: %s", logResponse.result);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.toString());
    } else {
      throw err;
    }
  }
})();
