import PangeaResponse from "@src/response.js";
import PangeaConfig from "@src/config.js";
import BaseService from "@src/services/base.js";
import { AuthN } from "@src/types.js";

export default class FlowReset extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/flow/reset/password
  /**
   * @summary Password Reset
   * @description Reset password during sign-in.
   * @operationId authn_post_v1_flow_reset_password
   * @param {String} flowID - An ID for a login or signup flow
   * @param {String} password - A password
   * @param {Object} options - Supported options:
   *   - cb_state (string): State tracking string for login callbacks
   *   - cb_code (string): A social oauth callback code
   *   - cancel (boolean)
   * @returns {Promise<PangeaResponse<AuthN.Flow.Reset.PasswordResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.reset.password(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   "My1s+Password",
   *   {
   *     cb_state: "pcb_zurr3lkcwdp5keq73htsfpcii5k4zgm7",
   *     cb_code: "poc_fwg3ul4db1jpivexru3wyj354u9ej5e2",
   *   }
   * );
   * ```
   */
  password(
    flowID: string,
    password: string,
    options: AuthN.Flow.Reset.PasswordOptions = {}
  ): Promise<PangeaResponse<AuthN.Flow.Reset.PasswordResult>> {
    const data: AuthN.Flow.Reset.PasswordRequest = {
      flow_id: flowID,
      password: password,
    };
    Object.assign(data, options);
    return this.post("flow/reset/password", data);
  }
}
