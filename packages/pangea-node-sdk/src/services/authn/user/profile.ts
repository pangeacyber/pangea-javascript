import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";

export default class UserProfile extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // authn::/v1/user/profile/get
  /**
   * @summary Get user
   * @description Get user's information by identity or email.
   * @operationId authn_post_v1_user_profile_get
   * @param {Object} data - Must include either an `email` or `id`:
   *   - email (string): An email address
   *   - id (string): The identity of a user or a service
   * @returns {Promise<PangeaResponse<AuthN.User.Profile.GetResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.user.getProfile(
   *   {
   *     email: "joe.user@email.com",
   *   }
   * );
   * ```
   */
  getProfile(
    data: AuthN.User.Profile.Get.EmailRequest | AuthN.User.Profile.Get.IDRequest
  ): Promise<PangeaResponse<AuthN.User.Profile.GetResult>> {
    return this.post("user/profile/get", data);
  }

  // authn::/v1/user/profile/update
  /**
   * @summary Update user
   * @description Update user's information by identity or email.
   * @operationId authn_post_v1_user_profile_update
   * @param {Object} data - Must include either an `email` OR `id` AND `profile`:
   *   - email (string): An email address
   *   - id (string): The identity of a user or a service
   *   - profile (object): Updates to a user profile
   * @returns {Promise<PangeaResponse<AuthN.User.Profile.UpdateResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.user.profile.update(
   *   {
   *     email: "joe.user@email.com",
   *     profile: {
   *       phone: "18085550173",
   *     },
   *   }
   * );
   * ```
   */
  update(
    data: AuthN.User.Profile.Update.EmailRequest | AuthN.User.Profile.Update.IDRequest
  ): Promise<PangeaResponse<AuthN.User.Profile.UpdateResult>> {
    return this.post("user/profile/update", data);
  }
}
