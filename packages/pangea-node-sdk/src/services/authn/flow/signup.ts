import PangeaResponse from "../../../response";
import PangeaConfig from "../../../config";
import BaseService from "../../base";
import { AuthN } from "../../../types";

export default class AuthNSignup extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authnsignup", token, config);
    this.apiVersion = "v1";
  }

  // #   - path: authn::/v1/flow/signup/password
  password({
    flow_id,
    password,
    first_name,
    last_name,
  }: AuthN.Flow.Signup.Password.Request): Promise<PangeaResponse<AuthN.Flow.Response>> {
    return this.post("flow/signup/password", { flow_id, password, first_name, last_name });
  }

  // #   - path: authn::/v1/flow/signup/social
  social({
    flow_id,
    cb_state,
    cb_code,
  }: AuthN.Flow.Signup.Social.Request): Promise<PangeaResponse<AuthN.Flow.Response>> {
    return this.post("flow/signup/social", { flow_id, cb_state, cb_code });
  }
}
