import PangeaResponse from "../../../response.js";
import BaseService from "../../base.js";
import PangeaConfig from "../../../config.js";
import { AuthN } from "../../../types.js";

export default class UserMFA extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }
  //   #   - path: authn::/v1/user/mfa/delete
  delete(userID: string, mfaProvider: AuthN.MFAProvider): Promise<PangeaResponse<{}>> {
    const data: AuthN.User.MFA.DeleteRequest = {
      user_id: userID,
      mfa_provider: mfaProvider,
    };
    return this.post("user/mfa/delete", data);
  }

  //   #   - path: authn::/v1/user/mfa/enroll
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

  //   #   - path: authn::/v1/user/mfa/start
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

  //   #   - path: authn::/v1/user/mfa/verify
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
