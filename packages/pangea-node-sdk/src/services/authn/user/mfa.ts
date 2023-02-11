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
  delete({
    user_id,
    mfa_provider,
  }: {
    user_id: string;
    mfa_provider: AuthN.MFAProvider;
  }): Promise<PangeaResponse<{}>> {
    return this.post("user/mfa/delete", { user_id, mfa_provider });
  }

  //   #   - path: authn::/v1/user/mfa/enroll
  enroll({
    user_id,
    mfa_provider,
    code,
  }: {
    user_id: string;
    mfa_provider: AuthN.MFAProvider;
    code: string;
  }): Promise<PangeaResponse<{}>> {
    return this.post("user/mfa/enroll", { user_id, mfa_provider, code });
  }

  //   #   - path: authn::/v1/user/mfa/start
  start({
    user_id,
    mfa_provider,
    enroll,
    phone,
  }: AuthN.UserMFAStartRequest): Promise<PangeaResponse<AuthN.UserMFAStartResponse>> {
    const data: AuthN.UserMFAStartRequest = {
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
  }: {
    user_id: string;
    mfa_provider: AuthN.MFAProvider;
    code: string;
  }): Promise<PangeaResponse<{}>> {
    return this.post("user/mfa/verify", { user_id, mfa_provider, code });
  }
}
