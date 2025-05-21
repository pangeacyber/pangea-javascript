import PangeaConfig from "../config.js";
import PangeaResponse from "../response.js";
import { PromptGuard } from "../types.js";
import BaseService from "./base.js";

/** Prompt Guard API client. */
export class PromptGuardService extends BaseService {
  /**
   * Creates a new `PromptGuardService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ domain: "pangea_domain" });
   * const promptGuard = new PromptGuardService("pangea_token", config);
   * ```
   *
   * @summary Prompt Guard
   */
  constructor(token: string, config: PangeaConfig) {
    super("prompt-guard", token, config);
  }

  /**
   * @summary Guard
   * @description Undocumented.
   * @operationId prompt_guard_post_v1_guard
   * @param request Request parameters.
   * @example
   * ```ts
   * const response = await promptGuard.guard({
   *   messages: [{"role": "user", "content": "text"}]
   * });
   * ```
   */
  guard(
    request: PromptGuard.GuardRequest
  ): Promise<PangeaResponse<PromptGuard.GuardResult>> {
    return this.post("v1/guard", request);
  }

  /**
   * @operationId prompt_guard_post_v1beta_config
   */
  async getServiceConfig(body: {
    id?: string;
    version?: string;
    analyzers?: {
      [key: string]: boolean;
    };
    malicious_detection_threshold?: number | null;
    benign_detection_threshold?: number | null;
    audit_data_activity?: PromptGuard.AuditDataActivityConfig;
  }): Promise<PangeaResponse<{}>> {
    return await this.post("v1beta/config", body);
  }

  /**
   * @operationId prompt_guard_post_v1beta_config_create
   */
  async createServiceConfig(body: {
    id?: string;
    version?: string;
    analyzers?: {
      [key: string]: boolean;
    };
    malicious_detection_threshold?: number | null;
    benign_detection_threshold?: number | null;
    audit_data_activity?: PromptGuard.AuditDataActivityConfig;
  }): Promise<PangeaResponse<{}>> {
    return await this.post("v1beta/config/create", body);
  }

  /**
   * @operationId prompt_guard_post_v1beta_config_update
   */
  async updateServiceConfig(body: {
    id?: string;
    version?: string;
    analyzers?: {
      [key: string]: boolean;
    };
    malicious_detection_threshold?: number | null;
    benign_detection_threshold?: number | null;
    audit_data_activity?: PromptGuard.AuditDataActivityConfig;
  }): Promise<PangeaResponse<{}>> {
    return await this.post("v1beta/config/update", body);
  }

  /**
   * @operationId prompt_guard_post_v1beta_config_delete
   */
  async deleteServiceConfig(id: string): Promise<PangeaResponse<{}>> {
    return await this.post("v1beta/config/delete", { id });
  }

  /**
   * @operationId prompt_guard_post_v1beta_config_list
   */
  async listServiceConfigs(
    request: PromptGuard.ServiceConfigListParams
  ): Promise<PangeaResponse<PromptGuard.ServiceConfigListResult>> {
    return await this.post("v1beta/config/list", request);
  }
}

export default PromptGuardService;
