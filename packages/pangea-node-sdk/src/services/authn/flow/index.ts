import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";
import FlowEnroll from "./enroll";
import FlowSignup from "./signup";
import FlowVerify from "./verify";

export default class Flow extends BaseService {
  enroll: FlowEnroll;
  signup: FlowSignup;
  verify: FlowVerify;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.enroll = new FlowEnroll(token, config);
    this.signup = new FlowSignup(token, config);
    this.verify = new FlowVerify(token, config);
  }

  // #   - path: authn::/v1/flow/complete
  complete(flowID: string): Promise<PangeaResponse<AuthN.Flow.CompleteResult>> {
    const data: AuthN.Flow.CompleteRequest = {
      flow_id: flowID,
    };
    return this.post("flow/complete", data);
  }

  // #   - path: authn::/v1/flow/start
  start(
    cbURI: string,
    { email, flow_types }: AuthN.Flow.StartOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.StartRequest = {
      cb_uri: cbURI,
    };

    if (email) data.email = email;
    if (flow_types) data.flow_types = flow_types;

    return this.post("flow/start", data);
  }
}
