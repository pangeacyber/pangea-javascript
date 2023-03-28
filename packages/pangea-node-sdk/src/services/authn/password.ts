import PangeaResponse from "../../response";
import BaseService from "../base";
import PangeaConfig from "../../config";
import { AuthN } from "../../types";

export default class Password extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
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
  update(email: string, oldSecret: string, newSecret: string): Promise<PangeaResponse<{}>> {
    const data: AuthN.Password.UpdateRequest = {
      email: email,
      old_secret: oldSecret,
      new_secret: newSecret,
    };
    return this.post("password/update", data);
  }
}
