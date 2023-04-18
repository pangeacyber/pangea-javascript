import BaseService from "../../base.js";
import PangeaConfig from "../../../config.js";
import PangeaResponse from "../../../response.js";
import { AuthN } from "../../../types.js";

import ClientSession from "./session.js";
import ClientPassword from "./password.js";

export default class Client extends BaseService {
  session: ClientSession;
  password: ClientPassword;

  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";

    this.session = new ClientSession(token, config);
    this.password = new ClientPassword(token, config);
  }

  // authn::/v1/client/userinfo
  /**
   * @summary Get User (client token)
   * @description Retrieve the logged in user's token and information
   * @param {String} code - A one-time ticket
   * @returns {Promise<PangeaResponse<AuthN.Client.UserinfoResult>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.client.userinfo(
   *   "yourusercode",
   * );
   */
  userinfo(code: string): Promise<PangeaResponse<AuthN.Client.UserinfoResult>> {
    const data: AuthN.Client.UserinfoRequest = {
      code: code,
    };
    return this.post("client/userinfo", data);
  }
}
