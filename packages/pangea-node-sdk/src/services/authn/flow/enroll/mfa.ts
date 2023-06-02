import PangeaResponse from "../../../../response.js";
import PangeaConfig from "../../../../config.js";
import BaseService from "../../../base.js";
import { AuthN } from "../../../../types.js";

export default class FlowEnrollMFA extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config, false);
    this.apiVersion = "v1";
  }

  // authn::/v1/flow/enroll/mfa/start
  /**
   * @summary Start MFA Enrollment
   * @description Start the process of enrolling an MFA.
   * @operationId authn_post_v1_flow_enroll_mfa_start
   * @param {String} flowID - An ID for a login or signup flow
   * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating a user's identity
   * @param {Object} options - Supported options:
   *   - phone (string): A phone number
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.enroll.mfa.start(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   AuthN.MFAProvider.SMS_OTP,
   *   { phone: "1-808-555-0173" }
   * );
   * ```
   */
  start(
    flowID: string,
    mfaProvider: AuthN.MFAProvider,
    options: AuthN.Flow.Enroll.MFA.StartOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Enroll.MFA.StartRequest = {
      flow_id: flowID,
      mfa_provider: mfaProvider,
    };

    Object.assign(data, options);
    return this.post("flow/enroll/mfa/start", data);
  }

  // authn::/v1/flow/enroll/mfa/complete
  /**
   * @summary Complete MFA Enrollment
   * @description Complete MFA enrollment by verifying a trial MFA code.
   * @operationId authn_post_v1_flow_enroll_mfa_complete
   * @param {String} flowID - An ID for a login or signup flow
   * @param {Object} options - Supported options:
   *   - code (string): A six digit MFA code
   *   - cancel (boolean)
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = authn.flow.enroll.mfa.complete(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   { code: "391423" }
   * );
   * ```
   */
  complete(
    flowID: string,
    options: AuthN.Flow.Enroll.MFA.CompleteOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Enroll.MFA.CompleteRequest = {
      flow_id: flowID,
    };

    Object.assign(data, options);

    return this.post("flow/enroll/mfa/complete", data);
  }
}
