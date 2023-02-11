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
  start({
    flow_id,
    mfa_provider,
    phone,
  }: AuthN.FlowEnrollMFAStartRequest): Promise<PangeaResponse<AuthN.FlowNextStepResponse>> {
    const data: AuthN.FlowEnrollMFAStartRequest = {
      flow_id,
      mfa_provider,
    };

    if (phone) data.phone = phone;

    return this.post("flow/enroll/mfa/start", data);
  }

  // #   - path: authn::/v1/flow/enroll/mfa/complete
  complete({
    flow_id,
    code,
    cancel,
  }: AuthN.FlowMFACompleteRequest): Promise<PangeaResponse<AuthN.FlowNextStepResponse>> {
    const data: AuthN.FlowMFACompleteRequest = {
      flow_id,
      code,
    };

    if (typeof cancel === "boolean") data.cancel = cancel;

    return this.post("flow/enroll/mfa/complete", data);
  }
}
