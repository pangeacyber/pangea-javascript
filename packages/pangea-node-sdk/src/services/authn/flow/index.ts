import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";

export default class Flow extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
  }

  // authn::/v2/flow/complete
  /**
   * @summary Complete Sign-up/in
   * @description Complete a login or signup flow.
   * @operationId authn_post_v1_flow_complete
   * @param {String} flowID - An ID for a login or signup flow
   * @returns {Promise<PangeaResponse<AuthN.Flow.CompleteResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.complete(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh"
   * );
   * ```
   */
  complete(flowID: string): Promise<PangeaResponse<AuthN.Flow.CompleteResult>> {
    const data: AuthN.Flow.CompleteRequest = {
      flow_id: flowID,
    };
    return this.post("v2/flow/complete", data);
  }

  // TODO: Docs
  start(request: AuthN.Flow.StartRequest): Promise<PangeaResponse<AuthN.Flow.StartResult>> {
    return this.post("v2/flow/start", request);
  }

  // TODO: Docs
  restart(request: AuthN.Flow.RestartRequest): Promise<PangeaResponse<AuthN.Flow.RestartResult>> {
    return this.post("v2/flow/restart", request);
  }

  // TODO: Docs
  update(request: AuthN.Flow.UpdateRequest): Promise<PangeaResponse<AuthN.Flow.UpdateResult>> {
    return this.post("v2/flow/update", request);
  }
}
