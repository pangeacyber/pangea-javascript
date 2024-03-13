import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";

export default class Flow extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
  }

  /**
   * @summary Complete sign-up/sign-in
   * @description Complete a login or signup flow.
   * @operationId authn_post_v2_flow_complete
   * @param {String} flowID - An ID for a login or signup flow
   * @returns {Promise<PangeaResponse<AuthN.Flow.CompleteResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/flow#/v2/flow/complete).
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

  /**
   * @summary Start a sign-up/sign-in flow
   * @description Start a new signup or signin flow.
   * @operationId authn_post_v2_flow_start
   * @param {AuthN.Flow.StartRequest} request
   * @returns {Promise<PangeaResponse<AuthN.Flow.StartResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/flow#/v2/flow/start).
   * @example
   * ```js
   * const response = await authn.flow.start({
   *   email: "joe.user@email.com",
   *   cb_uri: "https://www.myserver.com/callback",
   *   flow_types: [
   *     AuthN.FlowType.SIGNIN,
   *     AuthN.FlowType.SIGNUP,
   *   ],
   *   invitation: "pmc_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
   * });
   * ```
   */
  start(
    request: AuthN.Flow.StartRequest
  ): Promise<PangeaResponse<AuthN.Flow.StartResult>> {
    return this.post("v2/flow/start", request);
  }

  /**
   * @summary Restart a sign-up/sign-in flow
   * @description Restart a signup-up/in flow choice.
   * @operationId authn_post_v2_flow_restart
   * @param {AuthN.Flow.RestartRequest} request
   * @returns {Promise<PangeaResponse<AuthN.Flow.RestartResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/flow#/v2/flow/restart).
   * @example
   * ```js
   * const response = await authn.flow.restart({
   *   flow_id: "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   choice: AuthN.Flow.Choice.PASSWORD,
   *   data: {},
   * });
   * ```
   */
  restart(
    request: AuthN.Flow.RestartRequest
  ): Promise<PangeaResponse<AuthN.Flow.RestartResult>> {
    return this.post("v2/flow/restart", request);
  }

  /**
   * @summary Update a sign-up/sign-in flow
   * @description Update a sign-up/sign-in flow.
   * @operationId authn_post_v2_flow_update
   * @param {AuthN.Flow.UpdateRequest} request
   * @returns {Promise<PangeaResponse<AuthN.Flow.UpdateResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/flow#/v2/flow/update).
   * @example
   * ```js
   * const response = await authn.flow.update({
   *   flow_id: "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   choice: AuthN.Flow.Choice.PASSWORD,
   *   data: {
   *     password: "someNewPasswordHere",
   *   },
   * });
   * ```
   */
  update(
    request: AuthN.Flow.UpdateRequest
  ): Promise<PangeaResponse<AuthN.Flow.UpdateResult>> {
    return this.post("v2/flow/update", request);
  }
}
