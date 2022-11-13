/* eslint-disable no-console */

/*
 This example code is intended to be run directly
 from the source code with `ts-node-esm`.

 % ts-node-esm redact.ts
*/

import PangeaConfig from "../src/config.js";
import { PangeaErrors } from "../src/errors.js";
import RedactService from "../src/services/redact.js";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_TOKEN || "";
const config = new PangeaConfig({ domain });
const redact = new RedactService(token, config);

(async () => {
  try {
    const response = await redact.redact("Jenny Jenny... 415-867-5309");
    console.log(response.status, response.result);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();

(async () => {
  try {
    const response = await redact.redactStructured({ phone: "415-867-5309" });
    console.log(response.status, response.result);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log(err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();
