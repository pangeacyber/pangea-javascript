import PangeaResponse from "../../response";
import BaseService from "../base";
import PangeaConfig from "../../config";
import { AuthN } from "../../types";
import User from "./user";
import Flow from "./flow";
import Client from "./client";
import Session from "./session";

/**
 * AuthnService class provides methods for interacting with the AuthN Service
 * @extends BaseService
 */
export default class AuthNService extends BaseService {
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

  // authn::/v1/password/update
  /**
   * @summary Change a user's password
   * @description Change a user's password given the current password
   * @param {String} email - An email address
   * @param {String} oldSecret - The old password
   * @param {String} newSecret - The new password
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.passwordUpdate(
   *   "example@example.com",
   *   "hunter2",
   *   "My2n+Password"
   * );
   */
  passwordUpdate(email: string, oldSecret: string, newSecret: string): Promise<PangeaResponse<{}>> {
    const data: AuthN.PasswordUpdateRequest = {
      email: email,
      old_secret: oldSecret,
      new_secret: newSecret,
    };
    return this.post("password/update", data);
  }
}
