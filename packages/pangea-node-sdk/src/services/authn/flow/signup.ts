import PangeaResponse from "../../../response.js";
import PangeaConfig from "../../../config.js";
import BaseService from "../../base.js";
import { AuthN } from "../../../types.js";

export default class FlowSignup extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // #   - path: authn::/v1/flow/signup/password
  password(
    flowID: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Signup.PasswordRequest = {
      flow_id: flowID,
      password: password,
      first_name: firstName,
      last_name: lastName,
    };
    return this.post("flow/signup/password", data);
  }

  // #   - path: authn::/v1/flow/signup/social
  social(
    flowID: string,
    cbState: string,
    cbCode: string
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Signup.SocialRequest = {
      flow_id: flowID,
      cb_code: cbCode,
      cb_state: cbState,
    };
    return this.post("flow/signup/social", data);
  }
}
