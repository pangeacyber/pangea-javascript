import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import User from "./user/index.js";
import Flow from "./flow/index.js";
import Client from "./client/index.js";
import Session from "./session.js";

/**
 * AuthnService class provides methods for interacting with the AuthN Service
 * @extends BaseService
 */
class AuthNService extends BaseService {
  user: User;
  flow: Flow;
  client: Client;
  session: Session;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.user = new User(token, config);
    this.flow = new Flow(token, config);
    this.client = new Client(token, config);
    this.session = new Session(token, config);
  }
}

export default AuthNService;
