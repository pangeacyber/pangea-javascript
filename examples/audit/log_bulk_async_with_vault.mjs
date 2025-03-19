/* eslint-disable no-console */

import {
  PangeaConfig,
  AuditService,
  PangeaErrors,
  VaultService,
} from "pangea-node-sdk";

const vaultToken = process.env.PANGEA_VAULT_TOKEN;
const config = new PangeaConfig({ baseURLTemplate: process.env.PANGEA_URL_TEMPLATE });
const auditTokenVaultId = process.env.PANGEA_AUDIT_TOKEN_VAULT_ID;

(async () => {
  const event1 = {
    message: "Sign up",
  };

  try {
    // Create the vault service instance
    const vault = new VaultService(vaultToken, config);
    // Retrieve the audit token
    const getLastResponse = await vault.getItem(auditTokenVaultId);
    const auditToken = getLastResponse.result.current_version.secret;
    // Create the Audit instance and log events
    const audit = new AuditService(auditToken, config);
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
