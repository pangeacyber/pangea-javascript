/* eslint-disable no-console */

import {
  PangeaConfig,
  AuditService,
  PangeaErrors,
  VaultService,
} from "pangea-node-sdk";

const vault_token = process.env.PANGEA_VAULT_TOKEN;
const config = new PangeaConfig({ domain: process.env.PANGEA_DOMAIN });
const audit_token_vault_id = process.env.PANGEA_AUDIT_TOKEN_VAULT_ID;

(async () => {
  const event1 = {
    message: "Sign up",
  };

  try {
    // Create the vault service instance
    const vault = new VaultService(vault_token, config);
    // Retrieve the audit token
    const getLastResponse = await vault.getItem(audit_token_vault_id);
    const audit_token = getLastResponse.result.current_version.secret;
    // Create the Audit instance and log events
    const audit = new AuditService(audit_token, config);
    await audit.logBulkAsync([event1], { verbose: true });
    console.log("Success");
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      console.log(err);
    }
  }
})();
