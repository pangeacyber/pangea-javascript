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
  complete({
    flow_id,
    code,
    cancel,
  }: AuthN.FlowMFACompleteRequest): Promise<PangeaResponse<AuthN.FlowCompleteResponse>> {
    const data: AuthN.FlowMFACompleteRequest = {
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
  }: AuthN.FlowVerifyMFAStartRequest): Promise<PangeaResponse<AuthN.FlowCompleteResponse>> {
    return this.post("flow/verify/mfa/start", { flow_id, mfa_provider });
  }
}
