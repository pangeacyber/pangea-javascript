import PangeaConfig from "../config.js";
import PangeaResponse from "../response.js";
import { AIGuard } from "../types.js";
import BaseService from "./base.js";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

/** AI Guard API client. */
export class AIGuardService extends BaseService {
  /**
   * Creates a new `AIGuardService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ domain: "pangea_domain" });
   * const aiGuard = new AIGuardService("pangea_token", config);
   * ```
   *
   * @summary AI Guard
   */
  constructor(token: string, config: PangeaConfig) {
    super("ai-guard", token, config);
  }

  /**
   * @summary Text Guard for scanning LLM inputs and outputs
   * @description Analyze and redact text to avoid manipulation of the model,
   *   addition of malicious content, and other undesirable data transfers.
   * @operationId ai_guard_post_v1_text_guard
   * @param request Request parameters.
   * @example
   * ```ts
   * const response = await aiGuard.guardText({
   *   text: "foobar",
   * });
   * ```
   */
  guardText(
    request: { text: string } & AIGuard.TextGuardRequest
  ): Promise<PangeaResponse<AIGuard.TextGuardResult>>;

  /**
   * @summary Text Guard for scanning LLM inputs and outputs
   * @description Analyze and redact text to avoid manipulation of the model,
   *   addition of malicious content, and other undesirable data transfers.
   * @operationId ai_guard_post_v1_text_guard
   * @param request Request parameters.
   * @example
   * ```ts
   * const response = await aiGuard.guardText({
   *   messages: [
   *     { role: "user", content: "foobar" },
   *   ],
   * });
   * ```
   */
  guardText<T>(
    request: {
      messages: { role: string; content: string }[];
    } & AIGuard.TextGuardRequest
  ): Promise<PangeaResponse<AIGuard.TextGuardResult>>;

  /**
   * @summary Text Guard for scanning LLM inputs and outputs
   * @description Analyze and redact text to avoid manipulation of the model,
   *   addition of malicious content, and other undesirable data transfers.
   * @operationId ai_guard_post_v1_text_guard
   * @param request Request parameters.
   */
  guardText<T>(
    request: ({ text: string } | { messages: T }) & AIGuard.TextGuardRequest
  ): Promise<PangeaResponse<AIGuard.TextGuardResult>> {
    return this.post("v1/text/guard", request);
  }

  /**
   * @summary Guard LLM input and output
   * @description Analyze and redact content to avoid manipulation of the model,
   *  addition of malicious content, and other undesirable data transfers.
   * @operationId ai_guard_post_v1beta_guard
   * @param request Request parameters.
   */
  async guard(
    request: Simplify<AIGuard.MultimodalGuardRequest>
  ): Promise<PangeaResponse<AIGuard.TextGuardResult>> {
    return await this.post("v1beta/guard", request);
  }

  /**
   * @operationId ai_guard_post_v1beta_config
   */
  async getServiceConfig(
    id: string
  ): Promise<PangeaResponse<AIGuard.ServiceConfig>> {
    return await this.post("v1beta/config", { id });
  }

  /**
   * @operationId ai_guard_post_v1beta_config_create
   */
  async createServiceConfig(request: {
    name: string;
    id?: string;
    audit_data_activity?: AIGuard.AuditDataActivityConfig;
    connections?: AIGuard.ConnectionsConfig;
    recipes?: { [key: string]: AIGuard.RecipeConfig };
  }): Promise<PangeaResponse<AIGuard.ServiceConfig>> {
    return await this.post("v1beta/config/create", request);
  }

  /**
   * @operationId ai_guard_post_v1beta_config_update
   */
  async updateServiceConfig(request: {
    id: string;
    name: string;
    audit_data_activity?: AIGuard.AuditDataActivityConfig;
    connections?: AIGuard.ConnectionsConfig;
    recipes?: { [key: string]: AIGuard.RecipeConfig };
  }): Promise<PangeaResponse<AIGuard.ServiceConfig>> {
    return await this.post("v1beta/config/update", request);
  }

  /**
   * @operationId ai_guard_post_v1beta_config_delete
   */
  async deleteServiceConfig(
    id: string
  ): Promise<PangeaResponse<AIGuard.ServiceConfig>> {
    return await this.post("v1beta/config/delete", { id });
  }

  /**
   * @operationId ai_guard_post_v1beta_config_list
   */
  async listServiceConfigs(
    request: AIGuard.ServiceConfigListParams
  ): Promise<PangeaResponse<AIGuard.ServiceConfigListResult>> {
    return await this.post("v1beta/config/list", request);
  }
}

export default AIGuardService;
