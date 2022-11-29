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
   * @description Redact sensitive information from provided text.
   * @param {string} text - The text data to redact.
   * @returns {Promise} - A promise representing an async call to the redact endpoint
   * @example
   * const response = await redact.redact("Jenny Jenny... 415-867-5309");
   */
  redact(text: string): Promise<PangeaResponse<Redact.BaseResponse>> {
    const input = { text };

    return this.post("redact", input);
  }

  /**
   * @summary Redact structured
   * @description Redact sensitive information from structured data (e.g., JSON).
   * @param {Object} text - Structured data to redact
   * @returns {Promise} - A promise representing an async call to the redactStructured endpoint
   * @example
   * const data = { "phone": "415-867-5309" };
   *
   * const response = await redact.redactStructured(data);
   */
  redactStructured(data: object): Promise<PangeaResponse<Redact.StructuredResponse>> {
    const input = { data };

    return this.post("redact_structured", input);
  }
}

export default RedactService;
