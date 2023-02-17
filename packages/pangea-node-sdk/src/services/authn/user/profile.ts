import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";

export default class AuthNUserProfile extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authnprofile", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/user/profile/get
  // @ts-ignore we're extending BaseService which already has a get method defined
  get(
    data: AuthN.User.Profile.Get.EmailRequest | AuthN.User.Profile.Get.IdentityRequest
  ): Promise<PangeaResponse<AuthN.User.Profile.Item>> {
    return this.post("user/profile/get", data);
  }

  // authn::/v1/user/profile/update
  update(
    data: AuthN.User.Profile.Update.EmailRequest | AuthN.User.Profile.Update.IdentityRequest
  ): Promise<PangeaResponse<AuthN.User.Profile.Item>> {
    return this.post("user/profile/update", data);
  }
}
