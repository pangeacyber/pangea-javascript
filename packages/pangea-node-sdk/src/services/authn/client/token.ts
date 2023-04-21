import PangeaResponse from "../../../response.js";
import BaseService from "../../base.js";
import PangeaConfig from "../../../config.js";
import { AuthN } from "../../../types.js";

export default class ClientToken extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  /**
   * @summary Check a token
   * @description Look up a token and return its contents.
   * @param {String} token - An user token
   * @returns {Promise<PangeaResponse<AuthN.Client.Token.CheckResult>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.password.change(
   *   "yourusertoken",
   * );
   */
  check(token: string): Promise<PangeaResponse<AuthN.Client.Token.CheckResult>> {
    const data: AuthN.Client.Token.CheckRequest = {
      token: token,
    };
    return this.post("client/token/check", data);
  }
}
