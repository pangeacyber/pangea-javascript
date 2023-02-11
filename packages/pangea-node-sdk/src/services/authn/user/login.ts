import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";

export default class AuthNUserLogin extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authnuserlogin", token, config);
    this.apiVersion = "v1";
  }

  // `/v1/user/login/password`
  password({
    email,
    password,
    extra_profile,
  }: AuthN.UserLoginPasswordRequest): Promise<PangeaResponse<AuthN.SessionInfoCreds>> {
    const data: AuthN.UserLoginPasswordRequest = {
      email,
      password,
    };

    if (typeof extra_profile === "object" && extra_profile !== null) {
      data.extra_profile = extra_profile;
    }

    return this.post("user/login/password", data);
  }

  // `/v1/user/login/social`
  social({
    provider,
    email,
    social_id,
    extra_profile,
  }: AuthN.UserLoginSocialRequest): Promise<PangeaResponse<AuthN.SessionInfoCreds>> {
    const data: AuthN.UserLoginSocialRequest = {
      provider,
      email,
      social_id,
    };

    if (typeof extra_profile === "object" && extra_profile !== null) {
      data.extra_profile = extra_profile;
    }

    return this.post("user/login/social", data);
  }
}
