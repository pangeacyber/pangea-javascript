import PangeaConfig from "../config.js";
import PangeaResponse from "../response.js";
import { DataGuard } from "../types.js";
import BaseService from "./base.js";

/** Data Guard API client. */
export class DataGuardService extends BaseService {
  /**
   * Creates a new `DataGuardService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ domain: "pangea_domain" });
   * const dataGuard = new DataGuardService("pangea_token", config);
   * ```
   *
   * @summary Data Guard
   */
  constructor(token: string, config: PangeaConfig) {
    super("data-guard", token, config);
  }

  /**
   * @summary Text guard (Beta)
   * @description Undocumented.
   * @operationId data_guard_post_v1beta_text_guard
   * @param request Request parameters.
   * @example
   * ```ts
   * const response = await dataGuard.guardText({
   *   text: "foobar",
   * });
   * ```
   */
  guardText(
    request: DataGuard.TextGuardRequest
  ): Promise<PangeaResponse<DataGuard.TextGuardResult>> {
    return this.post("v1beta/text/guard", request);
  }
}

export default DataGuardService;
