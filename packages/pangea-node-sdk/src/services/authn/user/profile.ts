import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";

export default class UserProfile extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/user/profile/get
  getProfile(
    data: AuthN.User.Profile.Get.EmailRequest | AuthN.User.Profile.Get.IdentityRequest
  ): Promise<PangeaResponse<AuthN.User.Profile.GetResult>> {
    return this.post("user/profile/get", data);
  }

  // authn::/v1/user/profile/update
  update(
    data: AuthN.User.Profile.Update.EmailRequest | AuthN.User.Profile.Update.IdentityRequest
  ): Promise<PangeaResponse<AuthN.User.Profile.UpdateResult>> {
    return this.post("user/profile/update", data);
  }
}
