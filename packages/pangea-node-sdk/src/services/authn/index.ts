import BaseService from "../base";
import PangeaConfig from "../../config";
import User from "./user";
import Flow from "./flow";
import Client from "./client";
import Session from "./session";
import Password from "./password";

/**
 * AuthnService class provides methods for interacting with the AuthN Service
 * @extends BaseService
 */
export default class AuthNService extends BaseService {
  user: User;
  flow: Flow;
  client: Client;
  session: Session;
  password: Password;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.user = new User(token, config);
    this.flow = new Flow(token, config);
    this.client = new Client(token, config);
    this.session = new Session(token, config);
    this.password = new Password(token, config);
  }
}
