import PangeaResponse from "../../../../response.js";
import PangeaConfig from "../../../../config.js";
import BaseService from "../../../base.js";
import { AuthN } from "../../../../types.js";

export default class FlowVerifyMFA extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // #   - path: authn::/v1/flow/verify/mfa/complete
  complete(
    flowID: string,
    options: AuthN.Flow.Verify.MFA.CompleteOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.MFA.CompleteRequest = {
      flow_id: flowID,
    };

    Object.assign(data, options);
    return this.post("flow/verify/mfa/complete", data);
  }

  // #   - path: authn::/v1/flow/verify/mfa/start
  start(
    flowID: string,
    mfaProvider: AuthN.MFAProvider
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Verify.MFA.StartRequest = {
      flow_id: flowID,
      mfa_provider: mfaProvider,
    };

    return this.post("flow/verify/mfa/start", data);
  }
}
