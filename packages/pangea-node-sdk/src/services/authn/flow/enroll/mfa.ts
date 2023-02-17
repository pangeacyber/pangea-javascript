import PangeaResponse from "../../../../response";
import PangeaConfig from "../../../../config";
import BaseService from "../../../base";
import { AuthN } from "../../../../types";

export default class AuthNEnrollMFA extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authnenrollmfa", token, config);
    this.apiVersion = "v1";
  }

  // #   - path: authn::/v1/flow/enroll/mfa/start
  start(
    { flow_id, mfa_provider }: AuthN.Flow.Enroll.MFA.Start.RequiredParams,
    { phone }: AuthN.Flow.Enroll.MFA.Start.OptionalParams
  ): Promise<PangeaResponse<AuthN.Flow.Response>> {
    const data: AuthN.Flow.Enroll.MFA.Start.Request = {
      flow_id,
      mfa_provider,
    };

    if (phone) data.phone = phone;

    return this.post("flow/enroll/mfa/start", data);
  }

  // #   - path: authn::/v1/flow/enroll/mfa/complete
  complete(
    { flow_id, code }: AuthN.Flow.Enroll.MFA.Complete.RequiredParams,
    { cancel }: AuthN.Flow.Enroll.MFA.Complete.OptionalParams
  ): Promise<PangeaResponse<AuthN.Flow.Response>> {
    const data: AuthN.Flow.Enroll.MFA.Complete.Request = {
      flow_id,
      code,
    };

    if (typeof cancel === "boolean") data.cancel = cancel;

    return this.post("flow/enroll/mfa/complete", data);
  }
}
