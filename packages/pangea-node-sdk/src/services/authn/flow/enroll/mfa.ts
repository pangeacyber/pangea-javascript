import PangeaResponse from "../../../../response";
import PangeaConfig from "../../../../config";
import BaseService from "../../../base";
import { AuthN } from "../../../../types";

export default class FlowEnrollMFA extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // #   - path: authn::/v1/flow/enroll/mfa/start
  start(
    flowID: string,
    mfaProvider: AuthN.MFAProvider,
    { phone }: AuthN.Flow.Enroll.MFA.StartOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Enroll.MFA.StartRequest = {
      flow_id: flowID,
      mfa_provider: mfaProvider,
    };

    if (phone) data.phone = phone;

    return this.post("flow/enroll/mfa/start", data);
  }

  // #   - path: authn::/v1/flow/enroll/mfa/complete
  complete(
    flowID: string,
    code: string,
    { cancel }: AuthN.Flow.Enroll.MFA.CompleteOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.Enroll.MFA.CompleteRequest = {
      flow_id: flowID,
      code: code,
    };

    if (typeof cancel === "boolean") data.cancel = cancel;

    return this.post("flow/enroll/mfa/complete", data);
  }
}
