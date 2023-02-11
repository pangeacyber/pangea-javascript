import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";
import AuthNEnroll from "./enroll";
import AuthNSignup from "./signup";
import AuthNVerify from "./verify";

export default class AuthNFlow extends BaseService {
  enroll: AuthNEnroll;
  signup: AuthNSignup;
  verify: AuthNVerify;

  constructor(token: string, config: PangeaConfig) {
    super("authnflow", token, config);
    this.apiVersion = "v1";

    this.enroll = new AuthNEnroll(token, config);
    this.signup = new AuthNSignup(token, config);
    this.verify = new AuthNVerify(token, config);
  }

  // #   - path: authn::/v1/flow/complete
  complete({
    flow_id,
  }: AuthN.FlowCompleteRequest): Promise<PangeaResponse<AuthN.SessionInfoCreds>> {
    return this.post("flow/complete", { flow_id });
  }

  // #   - path: authn::/v1/flow/start
  start({
    cb_uri,
    email,
    flow_types,
  }: AuthN.FlowStartRequest): Promise<PangeaResponse<AuthN.FlowNextStepResponse>> {
    const data: AuthN.FlowStartRequest = {
      cb_uri,
    };

    if (email) data.email = email;
    if (flow_types) data.flow_types = flow_types;

    return this.post("flow/start", data);
  }
}
