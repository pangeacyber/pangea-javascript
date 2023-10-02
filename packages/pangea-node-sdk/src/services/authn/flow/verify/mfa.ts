import PangeaResponse from "@src/response.js";
import PangeaConfig from "@src/config.js";
import BaseService from "@src/services/base.js";
import { AuthN } from "@src/types.js";

export default class FlowVerifyMFA extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
  }

  // authn::/v1/flow/verify/mfa/complete
  /**
   * @summary Complete MFA Verification
   * @description Complete MFA verification.
   * @operationId authn_post_v1_flow_verify_mfa_complete
   * @param {String} flowID - An ID for a login or signup flow
   * @param {Object} options - Supported options:
   *   - code (string): A six digit MFA code
   *   - cancel (boolean)
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.verify.mfa.complete(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   { code: "391423" }
   * );
   * ```
   */
  complete(
    flowID: string,
    options: AuthN.Flow.Verify.MFA.CompleteOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.MFA.CompleteRequest = {
      flow_id: flowID,
    };

    Object.assign(data, options);
    return this.post("v1/flow/verify/mfa/complete", data);
  }

  // authn::/v1/flow/verify/mfa/start
  /**
   * @summary Start MFA Verification
   * @description Start the process of MFA verification.
   * @operationId authn_post_v1_flow_verify_mfa_start
   * @param {String} flowID - An ID for a login or signup flow
   * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for
   * authenticating a user's identity
   * @returns {Promise<PangeaResponse<AuthN.Flow.Result>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.flow.verify.mfa.start(
   *   "pfl_dxiqyuq7ndc5ycjwdgmguwuodizcaqhh",
   *   AuthN.MFAProvider.TOTP
   * );
   * ```
   */
  start(
    flowID: string,
    mfaProvider: AuthN.MFAProvider
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.MFA.StartRequest = {
      flow_id: flowID,
      mfa_provider: mfaProvider,
    };

    return this.post("v1/flow/verify/mfa/start", data);
  }
}
