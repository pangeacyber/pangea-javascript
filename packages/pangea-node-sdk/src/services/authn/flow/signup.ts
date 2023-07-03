import PangeaResponse from "@src/response.js";
import PangeaConfig from "@src/config.js";
import BaseService from "@src/services/base.js";
import { AuthN } from "@src/types.js";

export default class FlowSignup extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/flow/signup/password
  /**
   * @summary Password Sign-up
   * @description Signup a new account using a password.
   * @operationId authn_post_v1_flow_signup_password
   * @param {String} flowID - An ID for a login or signup flow
   * @param {String} password - A password
   * @param {String} firstName
   * @param {String} lastName
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.signup.password(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   "My1s+Password",
   *   "Joe",
   *   "User"
   * );
   * ```
   */
  password(
    flowID: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Signup.PasswordRequest = {
      flow_id: flowID,
      password: password,
      first_name: firstName,
      last_name: lastName,
    };
    return this.post("flow/signup/password", data);
  }

  // authn::/v1/flow/signup/social
  /**
   * @summary Social Sign-up
   * @description Signup a new account using a social provider.
   * @operationId authn_post_v1_flow_signup_social
   * @param {String} flowID - An ID for a login or signup flow
   * @param {String} cbState - State tracking string fo login callbacks
   * @param {String} cbCode - A social oauth callback code
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.signup.social(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   "pcb_zurr3lkcwdp5keq73htsfpcii5k4zgm7",
   *   "poc_fwg3ul4db1jpivexru3wyj354u9ej5e2"
   * );
   * ```
   */
  social(
    flowID: string,
    cbState: string,
    cbCode: string
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Signup.SocialRequest = {
      flow_id: flowID,
      cb_code: cbCode,
      cb_state: cbState,
    };
    return this.post("flow/signup/social", data);
  }
}
