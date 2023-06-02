import PangeaResponse from "../../../response.js";
import BaseService from "../../base.js";
import PangeaConfig from "../../../config.js";
import { AuthN } from "../../../types.js";

export default class UserMFA extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config, false);
    this.apiVersion = "v1";
  }
  // authn::/v1/user/mfa/delete
  /**
   * @summary Delete MFA Enrollment
   * @description Delete MFA enrollment for a user.
   * @operationId authn_post_v1_user_mfa_delete
   * @param {String} userID - The identity of a user or a service
   * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating
   * a user's identity
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * await authn.user.mfa.delete(
   *   "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
   *   AuthN.MFAProvider.TOTP
   * );
   * ```
   */
  delete(userID: string, mfaProvider: AuthN.MFAProvider): Promise<PangeaResponse<{}>> {
    const data: AuthN.User.MFA.DeleteRequest = {
      user_id: userID,
      mfa_provider: mfaProvider,
    };
    return this.post("user/mfa/delete", data);
  }

  // authn::/v1/user/mfa/enroll
  /**
   * @summary Enroll In MFA
   * @description Enroll in MFA for a user by proving the user has access to an MFA verification code.
   * @operationId authn_post_v1_user_mfa_enroll
   * @param {String} userID - The identity of a user or a service
   * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating
   * a user's identity
   * @param {String} code - A six digit MFA code
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * await authn.user.mfa.enroll(
   *   "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
   *   AuthN.MFAProvider.TOTP,
   *   "999999"
   * );
   * ```
   */
  enroll(
    userID: string,
    mfaProvider: AuthN.MFAProvider,
    code: string
  ): Promise<PangeaResponse<{}>> {
    const data: AuthN.User.MFA.EnrollRequest = {
      user_id: userID,
      mfa_provider: mfaProvider,
      code: code,
    };
    return this.post("user/mfa/enroll", data);
  }

  // authn::/v1/user/mfa/start
  /**
   * @summary Start MFA Verification
   * @description Start MFA verification for a user, generating a new one-time code,
   * and sending it if necessary. When enrolling TOTP, this returns the TOTP secret.
   * @operationId authn_post_v1_user_mfa_start
   * @param {String} userID - The identity of a user or a service
   * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating
   * a user's identity
   * @param {Object} options - Supported options:
   *   - enroll (boolean)
   *   - phone (string): A phone number
   * @returns {Promise<PangeaResponse<AuthN.User.MFA.StartResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.user.mfa.start(
   *   "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
   *   AuthN.MFAProvider.SMS_OTP,
   *   { phone: "1-808-555-0173" }
   * );
   * ```
   */
  start(
    userID: string,
    mfaProvider: AuthN.MFAProvider,
    options: AuthN.User.MFA.StartOptions
  ): Promise<PangeaResponse<AuthN.User.MFA.StartResult>> {
    const data: AuthN.User.MFA.StartRequest = {
      user_id: userID,
      mfa_provider: mfaProvider,
    };

    Object.assign(data, options);
    return this.post("user/mfa/start", data);
  }

  // authn::/v1/user/mfa/verify
  /**
   * @summary Verify An MFA Code
   * @description Verify that the user has access to an MFA verification code.
   * @operationId authn_post_v1_user_mfa_verify
   * @param {String} userID - The identity of a user or a service
   * @param {AuthN.MFAProvider} mfaProvider - Additional mechanism for authenticating
   * a user's identity
   * @param {String} code - A six digit MFA code
   * @returns {Promise<PangeaResponse<{}>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * await authn.user.mfa.verify(
   *   "pui_zgp532cx6opljeavvllmbi3iwmq72f7f",
   *   AuthN.MFAProvider.TOTP,
   *   "999999"
   * );
   * ```
   */
  verify(
    userID: string,
    mfaProvider: AuthN.MFAProvider,
    code: string
  ): Promise<PangeaResponse<{}>> {
    const data: AuthN.User.MFA.VerifyRequest = {
      user_id: userID,
      mfa_provider: mfaProvider,
      code: code,
    };
    return this.post("user/mfa/verify", data);
  }
}
