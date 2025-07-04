import PangeaConfig from "../config.js";
import PangeaResponse from "../response.js";
import { AIGuard } from "../types.js";
import BaseService from "./base.js";

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
  guardText(
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
}

export default AIGuardService;
