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
   * const config = new PangeaConfig({ domain: "pangea_domain" });
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
    const input: Redact.TextParams = {
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
    const input: Redact.StructuredParams = {
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

  /**
   * @summary Get a service config.
   * @description Get a service config.
   * @operationId redact_post_v1beta_config
   * @param configId Configuration ID.
   */
  async getServiceConfig(
    configId: string
  ): Promise<PangeaResponse<Redact.ServiceConfigResult>> {
    return await this.post("v1beta/config", { id: configId });
  }

  /**
   * @summary Create a v1.0.0 service config
   * @description Create a v1.0.0 service config
   * @operationId redact_post_v1beta_config_create
   * @param options.vault_service_config_id Service config used to create the secret
   * @param options.salt_vault_secret_id Pangea only allows hashing to be done using a salt value to prevent brute-force attacks
   */
  createServiceConfig(
    name: string,
    options: {
      version?: "1.0.0";
      enabled_rules?: string[];
      redactions?: { [key: string]: Redact.Redaction };
      vault_service_config_id?: string;
      salt_vault_secret_id?: string;
      fpe_vault_secret_id?: string;
      rules?: { [key: string]: Redact.RuleV1 };
      rulesets?: { [key: string]: Redact.RulesetV1 };
      supported_languages?: "en"[];
    }
  ): Promise<PangeaResponse<Redact.ServiceConfigV1>>;

  /**
   * @summary Create a v2.0.0 service config
   * @description Create a v2.0.0 service config
   * @operationId redact_post_v1beta_config_create
   * @param options.enforce_enabled_rules Always run service config enabled rules across all redact calls regardless of flags?
   * @param options.vault_service_config_id Service config used to create the secret
   * @param options.salt_vault_secret_id Pangea only allows hashing to be done using a salt value to prevent brute-force attacks
   * @param options.fpe_vault_secret_id The ID of the key used by FF3 Encryption algorithms for FPE
   */
  createServiceConfig(
    name: string,
    options: {
      version?: "2.0.0";
      enabled_rules?: string[];
      enforce_enabled_rules?: boolean;
      redactions?: { [key: string]: Redact.Redaction };
      vault_service_config_id?: string;
      salt_vault_secret_id?: string;
      fpe_vault_secret_id?: string;
      rules?: { [key: string]: Redact.RuleV2 };
      rulesets?: { [key: string]: Redact.RulesetV2 };
      supported_languages?: "en"[];
    }
  ): Promise<PangeaResponse<Redact.ServiceConfigV2>>;

  /**
   * @summary Create a service config
   * @description Create a service config with the specified version and parameters
   * @operationId redact_post_v1beta_config_create
   * @param name Configuration name
   * @param options Configuration options
   */
  async createServiceConfig(
    name: string,
    options: {
      version?: "1.0.0" | "2.0.0";
      enabled_rules?: string[];
      enforce_enabled_rules?: boolean;
      redactions?: { [key: string]: Redact.Redaction };
      vault_service_config_id?: string;
      salt_vault_secret_id?: string;
      fpe_vault_secret_id?: string;
      rules?:
        | { [key: string]: Redact.RuleV1 }
        | { [key: string]: Redact.RuleV2 };
      rulesets?:
        | { [key: string]: Redact.RulesetV1 }
        | { [key: string]: Redact.RulesetV2 };
      supported_languages?: "en"[];
    } = {}
  ): Promise<PangeaResponse<Redact.ServiceConfigResult>> {
    return await this.post("v1beta/config/create", { name, ...options });
  }

  /**
   * @summary Update a v1.0.0 service config
   * @description Update a v1.0.0 service config
   * @operationId redact_post_v1beta_config_update
   * @param options.vault_service_config_id Service config used to create the secret
   * @param options.salt_vault_secret_id Pangea only allows hashing to be done using a salt value to prevent brute-force attacks
   */
  updateServiceConfig(
    configId: string,
    options: {
      version?: "1.0.0";
      name: string;
      updated_at: string;
      enabled_rules?: string[];
      redactions?: { [key: string]: Redact.Redaction };
      vault_service_config_id?: string;
      salt_vault_secret_id?: string;
      rules?: { [key: string]: Redact.RuleV1 };
      rulesets?: { [key: string]: Redact.RulesetV1 };
      supported_languages?: "en"[];
    }
  ): Promise<PangeaResponse<Redact.ServiceConfigV1>>;

  /**
   * @summary Update a v2.0.0 service config
   * @description Update a v2.0.0 service config
   * @operationId redact_post_v1beta_config_update
   * @param options.enforce_enabled_rules Always run service config enabled rules across all redact calls regardless of flags?
   * @param options.vault_service_config_id Service config used to create the secret
   * @param options.salt_vault_secret_id Pangea only allows hashing to be done using a salt value to prevent brute-force attacks
   * @param options.fpe_vault_secret_id The ID of the key used by FF3 Encryption algorithms for FPE
   */
  updateServiceConfig(
    configId: string,
    options: {
      version?: "2.0.0";
      name: string;
      updated_at: string;
      enabled_rules?: string[];
      enforce_enabled_rules?: boolean;
      redactions?: { [key: string]: Redact.Redaction };
      vault_service_config_id?: string;
      salt_vault_secret_id?: string;
      fpe_vault_secret_id?: string;
      rules?: { [key: string]: Redact.RuleV2 };
      rulesets?: { [key: string]: Redact.RulesetV2 };
      supported_languages?: "en"[];
    }
  ): Promise<PangeaResponse<Redact.ServiceConfigV2>>;

  /**
   * @summary Update a service config
   * @description Update a service config with the specified version and parameters
   * @operationId redact_post_v1beta_config_update
   * @param configId The ID of the config to update
   * @param options Configuration options
   */
  async updateServiceConfig(
    configId: string,
    options: {
      version?: "1.0.0" | "2.0.0";
      name: string;
      updated_at: string;
      enabled_rules?: string[];
      enforce_enabled_rules?: boolean;
      redactions?: { [key: string]: Redact.Redaction };
      vault_service_config_id?: string;
      salt_vault_secret_id?: string;
      fpe_vault_secret_id?: string;
      rules?:
        | { [key: string]: Redact.RuleV1 }
        | { [key: string]: Redact.RuleV2 };
      rulesets?:
        | { [key: string]: Redact.RulesetV1 }
        | { [key: string]: Redact.RulesetV2 };
      supported_languages?: "en"[];
    }
  ): Promise<PangeaResponse<Redact.ServiceConfigResult>> {
    return await this.post("v1beta/config/update", {
      id: configId,
      ...options,
    });
  }

  /**
   * @summary Delete a service config
   * @description Delete a service config
   * @operationId redact_post_v1beta_config_delete
   * @param configId An ID for a service config
   */
  async deleteServiceConfig(
    configId: string
  ): Promise<PangeaResponse<Redact.ServiceConfigResult>> {
    return await this.post("v1beta/config/delete", { id: configId });
  }

  /**
   * @summary List service configs
   * @description List service configs
   * @operationId redact_post_v1beta_config_list
   * @param options.filter Filter criteria for the list
   * @param options.last Reflected value from a previous response to obtain the next page of results
   * @param options.order Order results asc(ending) or desc(ending)
   * @param options.order_by Which field to order results by
   * @param options.size Maximum results to include in the response
   */
  async listServiceConfigs(
    options: {
      filter?: Redact.ServiceConfigFilter;
      last?: string;
      order?: "asc" | "desc";
      order_by?: "id" | "created_at" | "updated_at";
      size?: number;
    } = {}
  ): Promise<PangeaResponse<Redact.ServiceConfigListResult>> {
    return await this.post("v1beta/config/list", options);
  }
}

export default RedactService;
