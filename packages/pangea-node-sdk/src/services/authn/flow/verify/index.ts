import PangeaResponse from "../../../../response.js";
import PangeaConfig from "../../../../config.js";
import BaseService from "../../../base.js";
import { AuthN } from "../../../../types.js";

import FlowVerifyMFA from "./mfa.js";

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
    options: AuthN.Flow.Verify.EmailOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.EmailRequest = {
      flow_id: flowID,
    };
    Object.assign(data, options);
    return this.post("flow/verify/email", data);
  }

  // #   - path: authn::/v1/flow/verify/password
  password(
    flowID: string,
    options: AuthN.Flow.Verify.PasswordOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.PasswordRequest = {
      flow_id: flowID,
    };

    Object.assign(data, options);
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
