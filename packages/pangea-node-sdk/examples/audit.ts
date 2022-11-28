/* eslint-disable no-console */

/*
 This example code is intended to be run directly
 from the source code with `ts-node-esm`.

 % ts-node-esm audit.ts
*/

import PangeaConfig from "../src/config.js";
import AuditService from "../src/services/audit.js";
import PangeaResponse from "../src/response.js";
import { PangeaErrors } from "../src/errors.js";
import { Audit } from "../src/types.js";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_TOKEN || "";
const config = new PangeaConfig({ domain });
const audit = new AuditService(token, config);

(async () => {
  const data = {
    actor: "pangea",
    action: "update",
    status: "success",
    source: "monitor",
    message: "node-sdk test message",
  };

  try {
    console.log("Logging audit data...");
    const logResponse = await audit.log(data, { verbose: true });
    console.log(logResponse.status, logResponse.result);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }

  try {
    console.log("Searching audit data...");
    const searchResponse: PangeaResponse<Audit.SearchResponse> = await audit.search(
      "message:test",
      {
        restriction: { source: ["monitor"] },
        limit: 10,
        verify: true,
      }
    );

    console.log(searchResponse.status);
    searchResponse.result.events.forEach((row: Audit.AuditRecord) => {
      console.log(
        row.envelope.received_at,
        row.envelope.event.message,
        row.envelope.event.source,
        row.envelope.event.actor,
        row.membership_verification,
        row.consistency_verification,
        row.signature_verification
      );
    });
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();
