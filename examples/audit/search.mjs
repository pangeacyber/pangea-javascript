// An example of searching Secure Audit Log for specific events.

/* eslint-disable no-console */

import { PangeaConfig, AuditService } from "pangea-node-sdk";

const token = process.env.PANGEA_AUDIT_TOKEN;
const config = new PangeaConfig({
  baseURLTemplate: process.env.PANGEA_URL_TEMPLATE,
});
const audit = new AuditService(token, config);

(async () => {
  // Search for audit events with actor "Dennis" or target "Grant". More
  // information about the search syntax can be found at
  // <https://pangea.cloud/docs/audit/using-secure-audit-log/searching-the-logs#search-syntax>.
  const response = await audit.search('actor:"Dennis" OR target:"Grant"');

  // Log the results.
  console.log(`Found ${response.result.count} events.`);
  console.log(response.result.events);
})();
