import PangeaResponse from "../../../response";
import PangeaConfig from "../../../config";
import BaseService from "../../base";
import { AuthN } from "../../../types";

export default class FlowReset extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  password(
    flowID: string,
    password: string,
    options: AuthN.Flow.Reset.PasswordOptions = {}
  ): Promise<PangeaResponse<AuthN.Flow.Reset.PasswordResult>> {
    const data: AuthN.Flow.Reset.PasswordRequest = {
      flow_id: flowID,
      password: password,
    };
    Object.assign(data, options);
    return this.post("flow/reset/password", data);
  }
}
