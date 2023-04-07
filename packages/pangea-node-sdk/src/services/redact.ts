import PangeaResponse from "../response.js";
import BaseService from "./base.js";
import PangeaConfig from "../config.js";
import { Redact } from "../types.js";

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
   * @description Redact sensitive information from provided text
   * @param {String} text - The text data to redact
   * @param {Object} options - Supported options:
   *   - debug {Boolean} - Setting this value to true will provide a detailed analysis of the redacted
   * data and the rules that caused redaction
   *   - rules {String[]} - An array of redact rule short names
   *   - return_result {Boolean} - Setting this value to false will omit the redacted result only returning count
   * @returns {Promise} - A promise representing an async call to the redact endpoint
   * @example
   * const response = await redact.redact("Jenny Jenny... 415-867-5309");
   */
  redact(
    text: string,
    options: Redact.TextOptions = {}
  ): Promise<PangeaResponse<Redact.BaseResponse>> {
    let input: Redact.TextParams = {
      text: text,
    };

    if (options?.debug) input.debug = options.debug;
    if (options?.rules) input.rules = options.rules;

    return this.post("redact", input);
  }

  /**
   * @summary Redact structured
   * @description Redact sensitive information from structured data (e.g., JSON)
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
   * const data = { "phone": "415-867-5309" };
   *
   * const response = await redact.redactStructured(data);
   */
  redactStructured(
    data: object,
    options: Redact.StructuredOptions = {}
  ): Promise<PangeaResponse<Redact.StructuredResponse>> {
    let input: Redact.StructuredParams = {
      data: data,
    };

    if (options?.debug) input.debug = options.debug;
    if (options?.rules) input.rules = options.rules;
    if (options?.jsonp) input.jsonp = options.jsonp;
    if (options?.format) input.format = options.format;

    return this.post("redact_structured", input);
  }
}

export default RedactService;
