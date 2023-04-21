import PangeaResponse from "../../../response.js";
import BaseService from "../../base.js";
import PangeaConfig from "../../../config.js";
import { AuthN } from "../../../types.js";
import FlowEnroll from "./enroll/index.js";
import FlowSignup from "./signup.js";
import FlowVerify from "./verify/index.js";
import FlowReset from "./reset.js";

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
  start(options: AuthN.Flow.StartOptions): Promise<PangeaResponse<AuthN.Flow.Result>> {
    const data: AuthN.Flow.StartRequest = {};

    Object.assign(data, options);
    return this.post("flow/start", data);
  }
}
