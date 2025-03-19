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
   * const config = new PangeaConfig({ baseURLTemplate: "https://{SERVICE_NAME}.aws.us.pangea.cloud" });
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
}

export default PromptGuardService;
