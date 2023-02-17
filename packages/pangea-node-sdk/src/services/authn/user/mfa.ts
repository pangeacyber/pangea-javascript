import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";

export default class AuthNUserMFA extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authnusermfa", token, config);
    this.apiVersion = "v1";
  }
  //   #   - path: authn::/v1/user/mfa/delete
  delete({ user_id, mfa_provider }: AuthN.User.MFA.Delete.Request): Promise<PangeaResponse<{}>> {
    return this.post("user/mfa/delete", { user_id, mfa_provider });
  }

  //   #   - path: authn::/v1/user/mfa/enroll
  enroll({
    user_id,
    mfa_provider,
    code,
  }: AuthN.User.MFA.Enroll.Request): Promise<PangeaResponse<{}>> {
    return this.post("user/mfa/enroll", { user_id, mfa_provider, code });
  }

  //   #   - path: authn::/v1/user/mfa/start
  start(
    { user_id, mfa_provider }: AuthN.User.MFA.Start.RequiredParams,
    { enroll, phone }: AuthN.User.MFA.Start.OptionalParams
  ): Promise<PangeaResponse<AuthN.User.MFA.Start.Response>> {
    const data: AuthN.User.MFA.Start.Request = {
      user_id,
      mfa_provider,
    };

    if (typeof enroll === "boolean") data.enroll = enroll;
    if (phone) data.phone = phone;

    return this.post("user/mfa/start", data);
  }

  //   #   - path: authn::/v1/user/mfa/verify
  verify({
    user_id,
    mfa_provider,
    code,
  }: AuthN.User.MFA.Verify.Request): Promise<PangeaResponse<{}>> {
    return this.post("user/mfa/verify", { user_id, mfa_provider, code });
  }
}
