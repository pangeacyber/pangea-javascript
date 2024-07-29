import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import User from "./user/index.js";
import Flow from "./flow/index.js";
import Client from "./client/index.js";
import Session from "./session.js";
import Agreements from "./agreements/index.js";
import { PangeaToken } from "@src/types.js";

/**
 * AuthnService class provides methods for interacting with the AuthN Service
 * @extends BaseService
 */
class AuthNService extends BaseService {
  user: User;
  flow: Flow;
  client: Client;
  session: Session;
  agreements: Agreements;

  /**
   * Creates a new `AuthNService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ domain: "pangea_domain" });
   * const authn = new AuthNService("pangea_token", config);
   * ```
   *
   * @summary AuthN
   */
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("authn", token, config);

    this.user = new User(token, config);
    this.flow = new Flow(token, config);
    this.client = new Client(token, config);
    this.session = new Session(token, config);
    this.agreements = new Agreements(token, config);
  }
}

export default AuthNService;
