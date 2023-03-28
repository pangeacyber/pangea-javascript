import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";
import FlowEnroll from "./enroll";
import FlowSignup from "./signup";
import FlowVerify from "./verify";
import FlowReset from "./reset";

export default class Flow extends BaseService {
  enroll: FlowEnroll;
  signup: FlowSignup;
  verify: FlowVerify;
  reset: FlowReset;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.enroll = new FlowEnroll(token, config);
    this.signup = new FlowSignup(token, config);
    this.verify = new FlowVerify(token, config);
    this.reset = new FlowReset(token, config);
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
    options: AuthN.Flow.StartOptions
  ): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.StartRequest = {
      cb_uri: cbURI,
    };

    Object.assign(data, options);
    return this.post("flow/start", data);
  }
}
