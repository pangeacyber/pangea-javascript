import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";

export default class AuthNUserProfile extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authnprofile", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/user/profile/get
  /**
   * @summary Get user
   * @description Get user's information by identity or email
   * @param {String} o.identity - An identity of a user or a service
   * @param {String} o.email - An email address
   * @returns {Promise<PangeaResponse<AuthN.UserProfile>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.user.profile.get({
   *   email: "joe.user@email.com",
   * });
   */ // @ts-ignore we're extending BaseService which already has a get method defined
  get(o: AuthN.UserProfileGetRequest = {}): Promise<PangeaResponse<AuthN.UserProfile>> {
    return this.post("user/profile/get", o);
  }

  // authn::/v1/user/profile/update
  /**
   * @summary Update user
   * @description Update user's information by identity or email
   * @param {String} o.identity - The identity of a user or a service
   * @param {String} o.email - An email address
   * @param {Boolean | null} o.require_mfa - New require_mfa value
   * @param {String | null} o.mfa_value - New MFA provider setting
   * @param {String | null} o.mfa_provider - New MFA provider setting
   * @param {Object} o.profile - Updates to a user profile
   * @returns {Promise<PangeaResponse<AuthN.UserProfile>>} - A promise representing an async call to the endpoint
   * @example
   * const response = await authn.user.profile.update({
   *   email: "joe.user@email.com",
   *   profile: {
   *     "phone": "18085967873",
   *     "deleteme": null,
   *   },
   * });
   */
  update(o: AuthN.UserProfileUpdateRequest): Promise<PangeaResponse<AuthN.UserProfile>> {
    return this.post("user/profile/update", o);
  }
}
