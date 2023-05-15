import PangeaResponse from "../../../../response.js";
import PangeaConfig from "../../../../config.js";
import BaseService from "../../../base.js";
import { AuthN } from "../../../../types.js";

import FlowVerifyMFA from "./mfa.js";

export default class FlowVerify extends BaseService {
  mfa: FlowVerifyMFA;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.mfa = new FlowVerifyMFA(token, config);
  }

  // authn::/v1/flow/verify/captcha
  /**
   * @summary Verify CAPTCHA
   * @description Verify a CAPTCHA during a signup or signin flow.
   * @operationId authn_post_v1_flow_verify_captcha
   * @param {String} flowID - An ID for a login or signup flow
   * @param {String} code - Code from CAPTCHA
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.verify.captcha(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   "SOMEREALLYLONGANDOPAQUESTRINGFROMCAPTCHAVERIFICATION"
   * );
   * ```
   */
  captcha(flowID: string, code: string): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.CaptchaRequest = {
      flow_id: flowID,
      code: code,
    };

    return this.post("flow/verify/captcha", data);
  }

  // authn::/v1/flow/verify/email
  /**
   * @summary Verify Email Address
   * @description Verify an email address during a signup or signin flow.
   * @operationId authn_post_v1_flow_verify_email
   * @param {String} flowID - An ID for a login or signup flow 
   * @param {Object} options - Supported options:
   *   - cb_state (string): State tracking string for login callbacks
   *   - cb_code (string): A social oauth callback code
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise 
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.verify.email(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   {
   *     cb_state: "pcb_zurr3lkcwdp5keq73htsfpcii5k4zgm7",
         cb_code: "poc_fwg3ul4db1jpivexru3wyj354u9ej5e2",
   *   }
   * );
   * ```
   */
  email(
    flowID: string,
    options: AuthN.Flow.Verify.EmailOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.EmailRequest = {
      flow_id: flowID,
    };
    Object.assign(data, options);
    return this.post("flow/verify/email", data);
  }

  // authn::/v1/flow/verify/password
  /**
   * @summary Password Sign-in
   * @description Sign in with a password.
   * @operationId authn_post_v1_flow_verify_password
   * @param {String} flowID - An ID for a login or signup flow
   * @param {Object} options - Supported options:
   *   - password (string): A password
   *   - reset (boolean): Used to reset a password
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.verify.password(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   { password: "My1s+Password" }
   * );
   * ```
   */
  password(
    flowID: string,
    options: AuthN.Flow.Verify.PasswordOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.PasswordRequest = {
      flow_id: flowID,
    };

    Object.assign(data, options);
    return this.post("flow/verify/password", data);
  }

  // authn::/v1/flow/verify/social
  /**
   * @summary Social Sign-in
   * @description Signin with a social provider.
   * @operationId authn_post_v1_flow_verify_social
   * @param {String} flowID - An ID for a login or signup flow
   * @param {String} cbState - State tracking string for login callbacks
   * @param {String} cbCode - A social oauth callback code
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.verify.social(
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
    const data: AuthN.Flow.Verify.SocialRequest = {
      flow_id: flowID,
      cb_code: cbCode,
      cb_state: cbState,
    };
    return this.post("flow/verify/social", data);
  }
}
