import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { Redact } from "@src/types.js";

/**
 * RedactService class provides methods for interacting with the Redact Service
 * @extends BaseService
 */
class RedactService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("redact", token, config);
    this.apiVersion = "v1";
  }

  /**
   * @summary Redact
   * @description Redact sensitive information from provided text.
   * @operationId redact_post_v1_redact
   * @param {String} text - The text data to redact
   * @param {Object} options - Supported options:
   *   - debug {Boolean} - Setting this value to true will provide a detailed analysis of the redacted
   * data and the rules that caused redaction
   *   - rules {String[]} - An array of redact rule short names
   *   - return_result {Boolean} - Setting this value to false will omit the redacted result only returning count
   * @returns {Promise} - A promise representing an async call to the redact endpoint
   * @example
   * ```js
   * const response = await redact.redact(
   *   "Jenny Jenny... 555-867-5309"
   * );
   * ```
   */
  redact(
    text: string,
    options: Redact.TextOptions = {}
  ): Promise<PangeaResponse<Redact.TextResult>> {
    let input: Redact.TextParams = {
      text: text,
    };

    Object.assign(input, options);
    return this.post("redact", input);
  }

  /**
   * @summary Redact structured
   * @description Redact sensitive information from structured data (e.g., JSON).
   * @operationId redact_post_v1_redact_structured
   * @param {Object} data - Structured data to redact
   * @param {Object} options - Supported options:
   *   - debug {Boolean} - Setting this value to true will provide a detailed analysis of the redacted
   * data and the rules that caused redaction
   *   - rules {String[]} - An array of redact rule short names
   *   - jsonp {String[]} - JSON path(s) used to identify the specific JSON fields to redact in the
   * structured data. Note: If jsonp parameter is used, the data parameter must be in JSON format.
   *   - format {String} - The format of the structured data to redact. Default: "json"
   *   - return_result {Boolean} - Setting this value to false will omit the redacted result only returning count
   * @returns {Promise} - A promise representing an async call to the redactStructured endpoint
   * @example
   * ```js
   * const response = await redact.redactStructured({
   *   "phone": "555-867-5309"
   * });
   * ```
   */
  redactStructured(
    data: object,
    options: Redact.StructuredOptions = {}
  ): Promise<PangeaResponse<Redact.StructuredResult>> {
    let input: Redact.StructuredParams = {
      data: data,
    };

    Object.assign(input, options);
    return this.post("redact_structured", input);
  }
}

export default RedactService;
