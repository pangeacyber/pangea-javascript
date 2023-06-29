import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";
import FlowEnroll from "./enroll/index.js";
import FlowSignup from "./signup.js";
import FlowVerify from "./verify/index.js";
import FlowReset from "./reset.js";

export default class Flow extends BaseService {
  enroll: FlowEnroll;
  signup: FlowSignup;
  verify: FlowVerify;
  reset: FlowReset;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.enroll = new FlowEnroll(token, config);
    this.signup = new FlowSignup(token, config);
    this.verify = new FlowVerify(token, config);
    this.reset = new FlowReset(token, config);
  }

  // authn::/v1/flow/complete
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
    return this.post("flow/complete", data);
  }

  // authn::/v1/flow/start
  /**
   * @summary Start a sign-up/in
   * @description Start a new signup or signin flow.
   * @operationId authn_post_v1_flow_start
   * @param {Object} options - Supported options:
   *   - email (string): An email address
   *   - cb_uri (string http-url): A login callback URI
   *   - flow_types (AuthN.FlowType[]): A list of flow types
   *   - provider (AuthN.IDProvider): Mechanism for authenticating a user's identity
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.start(
   *   {
   *     email: "joe.user@email.com",
   *     cb_uri: "https://www.myserver.com/callback",
   *     flow_types: [
   *       AuthN.FlowType.SIGNUP,
   *       AuthN.FlowType.SIGNIN,
   *     ],
   *     provider: AuthN.IDProvider.PASSWORD,
   *   }
   * )
   * ```
   */
  start(options: AuthN.Flow.StartOptions): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.StartRequest = {};

    Object.assign(data, options);
    return this.post("flow/start", data);
  }
}
