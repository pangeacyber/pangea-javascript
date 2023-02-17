import PangeaResponse from "../../../../response";
import PangeaConfig from "../../../../config";
import BaseService from "../../../base";
import { AuthN } from "../../../../types";

import FlowVerifyMFA from "./mfa";

export default class FlowVerify extends BaseService {
  mfa: FlowVerifyMFA;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.mfa = new FlowVerifyMFA(token, config);
  }

  // #   - path: authn::/v1/flow/verify/captcha
  captcha(flowID: string, code: string): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.CaptchaRequest = {
      flow_id: flowID,
      code: code,
    };

    return this.post("flow/verify/captcha", data);
  }

  // #   - path: authn::/v1/flow/verify/email
  email(
    flowID: string,
    cbState: string,
    cbCode: string
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.EmailRequest = {
      flow_id: flowID,
      cb_code: cbCode,
      cb_state: cbState,
    };
    return this.post("flow/verify/email", data);
  }

  // #   - path: authn::/v1/flow/verify/password
  password(flowID: string, password: string): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.PasswordRequest = {
      flow_id: flowID,
      password: password,
    };
    return this.post("flow/verify/password", data);
  }

  // #   - path: authn::/v1/flow/verify/social
  social(
    flowID: string,
    cbState: string,
    cbCode: string
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.SocialRequest = {
      flow_id: flowID,
      cb_code: cbCode,
      cb_state: cbState,
    };
    return this.post("flow/verify/social", data);
  }
}
