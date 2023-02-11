import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";

import AuthNClientSession from "./session";

export default class AuthNClient extends BaseService {
  session: AuthNClientSession;

  constructor(token: string, config: PangeaConfig) {
    super("authnclient", token, config);
    this.apiVersion = "v1";

    this.session = new AuthNClientSession(token, config);
  }
}
