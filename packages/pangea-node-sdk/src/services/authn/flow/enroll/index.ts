import PangeaConfig from "../../../../config";
import BaseService from "../../../base";

import FlowEnrollMFA from "./mfa";

export default class FlowEnroll extends BaseService {
  mfa: FlowEnrollMFA;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.mfa = new FlowEnrollMFA(token, config);
  }
}
