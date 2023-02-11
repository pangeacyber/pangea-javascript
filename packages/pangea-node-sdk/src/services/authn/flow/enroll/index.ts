import PangeaConfig from "../../../../config";
import BaseService from "../../../base";

import AuthNEnrollMFA from "./mfa";

export default class AuthNEnroll extends BaseService {
  mfa: AuthNEnrollMFA;

  constructor(token: string, config: PangeaConfig) {
    super("authnenroll", token, config);
    this.apiVersion = "v1";

    this.mfa = new AuthNEnrollMFA(token, config);
  }
}
