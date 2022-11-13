/* eslint-disable no-console */

/*
 This example code is intended to be run directly
 from the source code with `ts-node-esm`.

 % ts-node-esm embargo.ts
*/

import PangeaConfig from "../src/config.js";
import EmbargoService from "../src/services/embargo.js";
import { PangeaErrors } from "../src/errors.js";

const domain = process.env.PANGEA_DOMAIN;
const token = process.env.PANGEA_TOKEN || "";
const config = new PangeaConfig({ domain });
const embargo = new EmbargoService(token, config);

(async () => {
  try {
    const response = await embargo.ipCheck("213.24.238.26");
    console.log(response.status, response.result);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log("Error", err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();

(async () => {
  try {
    const response = await embargo.isoCheck("CU");
    console.log(response.status, response.result);
  } catch (err) {
    if (err instanceof PangeaErrors.APIError) {
      console.log("Error", err.summary, err.pangeaResponse);
    } else {
      throw err;
    }
  }
})();
