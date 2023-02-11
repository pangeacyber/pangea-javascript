import PangeaResponse from "../../response";
import BaseService from "../base";
import PangeaConfig from "../../config";
import { AuthN } from "../../types";
import AuthNUser from "./user";
import AuthNFlow from "./flow";
import AuthNClient from "./client";
import AuthNSession from "./session";

/**
 * AuthnService class provides methods for interacting with the AuthN Service
 * @extends BaseService
 */
export default class AuthNService extends BaseService {
  user: AuthNUser;
  flow: AuthNFlow;
  client: AuthNClient;
  session: AuthNSession;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.user = new AuthNUser(token, config);
    this.flow = new AuthNFlow(token, config);
    this.client = new AuthNClient(token, config);
    this.session = new AuthNSession(token, config);
  }

  // authn::/v1/password/update
  /**
   * @summary Change a user's password
   * @description Change a user's password given the current password
   * @param {String} o.email - An email address
   * @param {String} o.old_secret - The old password
   * @param {String} o.new_secret - The new password
   * @returns {Promise<PangeaResponse<{}>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.passwordUpdate(
   *   "example@example.com",
   *   "hunter2",
   *   "My2n+Password"
   * );
   */
  passwordUpdate(o: AuthN.PasswordUpdateRequest): Promise<PangeaResponse<{}>> {
    return this.post("password/update", o);
  }
}
