import PangeaConfig from "@src/config.js";
import BaseService from "@src/services/base.js";

import FlowEnrollMFA from "./mfa.js";

export default class FlowEnroll extends BaseService {
  mfa: FlowEnrollMFA;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);

    this.mfa = new FlowEnrollMFA(token, config);
  }
}
