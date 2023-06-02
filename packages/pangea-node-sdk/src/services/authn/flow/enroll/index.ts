import PangeaConfig from "../../../../config.js";
import BaseService from "../../../base.js";

import FlowEnrollMFA from "./mfa.js";

export default class FlowEnroll extends BaseService {
  mfa: FlowEnrollMFA;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config, false);
    this.apiVersion = "v1";

    this.mfa = new FlowEnrollMFA(token, config);
  }
}
