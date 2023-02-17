import PangeaResponse from "../../../../response";
import PangeaConfig from "../../../../config";
import BaseService from "../../../base";
import { AuthN } from "../../../../types";

export default class AuthNVerifyMFA extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authnverifymfa", token, config);
    this.apiVersion = "v1";
  }

  // #   - path: authn::/v1/flow/verify/mfa/complete
  complete(
    { flow_id, code }: AuthN.Flow.Verify.MFA.Complete.RequiredParams,
    { cancel }: AuthN.Flow.Verify.MFA.Complete.OptionalParams
  ): Promise<PangeaResponse<AuthN.Flow.Response>> {
    const data: AuthN.Flow.Verify.MFA.Complete.Request = {
      flow_id,
      code,
    };

    if (typeof cancel === "boolean") data.cancel = cancel;

    return this.post("flow/verify/mfa/complete", data);
  }

  // #   - path: authn::/v1/flow/verify/mfa/start
  start({
    flow_id,
    mfa_provider,
  }: AuthN.Flow.Verify.MFA.Start.Request): Promise<PangeaResponse<AuthN.Flow.Response>> {
    return this.post("flow/verify/mfa/start", { flow_id, mfa_provider });
  }
}
