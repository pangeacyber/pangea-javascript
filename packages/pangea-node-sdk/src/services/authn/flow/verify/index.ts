import PangeaResponse from "../../../../response";
import PangeaConfig from "../../../../config";
import BaseService from "../../../base";
import { AuthN } from "../../../../types";

import AuthNVerifyMFA from "./mfa";

export default class AuthNVerify extends BaseService {
  mfa: AuthNVerifyMFA;

  constructor(token: string, config: PangeaConfig) {
    super("authnverify", token, config);
    this.apiVersion = "v1";

    this.mfa = new AuthNVerifyMFA(token, config);
  }

  // #   - path: authn::/v1/flow/verify/captcha
  captcha({
    flow_id,
    code,
  }: AuthN.FlowVerifyCaptchaRequest): Promise<PangeaResponse<AuthN.FlowCompleteResponse>> {
    return this.post("flow/verify/captcha", { flow_id, code });
  }

  // #   - path: authn::/v1/flow/verify/email
  email({
    flow_id,
    cb_state,
    cb_code,
  }: AuthN.FlowSignupRequest): Promise<PangeaResponse<AuthN.FlowCompleteResponse>> {
    return this.post("flow/verify/email", { flow_id, cb_state, cb_code });
  }

  // #   - path: authn::/v1/flow/verify/password
  password({
    flow_id,
    password,
  }: AuthN.FlowVerifyPasswordRequest): Promise<PangeaResponse<AuthN.FlowCompleteResponse>> {
    return this.post("flow/verify/password", { flow_id, password });
  }

  // #   - path: authn::/v1/flow/verify/social
  social({
    flow_id,
    cb_state,
    cb_code,
  }: AuthN.FlowSignupRequest): Promise<PangeaResponse<AuthN.FlowCompleteResponse>> {
    return this.post("flow/verify/social", { flow_id, cb_state, cb_code });
  }
}
