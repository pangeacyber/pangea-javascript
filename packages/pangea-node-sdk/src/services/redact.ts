import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { PangeaToken, Redact } from "@src/types.js";

export interface RedactOptions {
  config_id?: string;
}

/**
 * RedactService class provides methods for interacting with the Redact Service
 * @extends BaseService
 */
class RedactService extends BaseService {
  /**
   * Creates a new `RedactService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ baseURLTemplate: "https://{SERVICE_NAME}.aws.us.pangea.cloud" });
   * const redact = new RedactService("pangea_token", config);
   * ```
   *
   * @summary Redact
   */
  constructor(
    token: PangeaToken,
    config: PangeaConfig,
    options: RedactOptions = {}
  ) {
    super("redact", token, config, options.config_id);
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
   *   - rulesets {String[]} - An array of redact ruleset short names
   *   - return_result {Boolean} - Setting this value to false will omit the redacted result only returning count
   *   - redaction_method_overrides {RedactionMethodOverrides} - A set of redaction method overrides for any enabled rule. These methods override the config declared methods
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
    return this.post("v1/redact", input);
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
   *   - rulesets {String[]} - An array of redact ruleset short names
   *   - jsonp {String[]} - JSON path(s) used to identify the specific JSON fields to redact in the
   * structured data. Note: If jsonp parameter is used, the data parameter must be in JSON format.
   *   - format {String} - The format of the structured data to redact. Default: "json"
   *   - return_result {Boolean} - Setting this value to false will omit the redacted result only returning count
   *   - redaction_method_overrides {RedactionMethodOverrides} - A set of redaction method overrides for any enabled rule. These methods override the config declared methods
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
    return this.post("v1/redact_structured", input);
  }

  /**
   * @summary Unredact
   * @description Decrypt or unredact fpe redactions.
   * @operationId redact_post_v1_unredact
   * @param request - Unredact request data
   *   - redacted_data - Data to unredact
   *   - fpe_context {string} - FPE context used to decrypt and unredact data
   * @returns {Promise} - A promise representing an async call to the unredact endpoint
   */
  unredact<O = object>(
    request: Redact.UnredactRequest<O>
  ): Promise<PangeaResponse<Redact.UnredactResult<O>>> {
    return this.post("v1/unredact", request);
  }
}

export default RedactService;
