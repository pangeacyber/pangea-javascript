import BaseService from "../../base";
import PangeaConfig from "../../../config";

import ClientSession from "./session";

export default class Client extends BaseService {
  session: ClientSession;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.session = new ClientSession(token, config);
  }
}
