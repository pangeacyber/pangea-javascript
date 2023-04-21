import PangeaResponse from "../../../response.js";
import BaseService from "../../base.js";
import PangeaConfig from "../../../config.js";
import { AuthN } from "../../../types.js";

export default class UserPassword extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/user/password/reset
  reset(data: AuthN.User.Password.ResetRequest): Promise<PangeaResponse<{}>> {
    return this.post("user/password/reset", data);
  }
}
