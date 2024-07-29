import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN, PangeaToken } from "@src/types.js";

export default class UserProfile extends BaseService {
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("authn", token, config);
  }

  /**
   * @summary Get user
   * @description Get user's information by identity or email.
   * @operationId authn_post_v2_user_profile_get
   * @param data Must include one of `email`, `id`, or `username`:
   *   - email (string): An email address.
   *   - id (string): The identity of a user or a service.
   *   - username (string): A username.
   * @returns A promise representing an async call to the endpoint. Available
   * response fields can be found in our [API Documentation](https://pangea.cloud/docs/api/authn/user#/v2/user/profile/get).
   * @example
   * ```js
   * const response = await authn.user.profile.getProfile(
   *   {
   *     email: "joe.user@email.com",
   *   }
   * );
   * ```
   */
  getProfile(
    data:
      | AuthN.User.Profile.Get.EmailRequest
      | AuthN.User.Profile.Get.IDRequest
      | AuthN.User.Profile.Get.UsernameRequest
  ): Promise<PangeaResponse<AuthN.User.Profile.GetResult>> {
    return this.post("v2/user/profile/get", data);
  }

  /**
   * @summary Update user
   * @description Update user's information by identity or email.
   * @operationId authn_post_v2_user_profile_update
   * @param data Must include `profile` and one of `email`, id`, or `username`:
   *   - email (string): An email address.
   *   - id (string): The identity of a user or a service.
   *   - username (string): A username.
   *   - profile (object): Updates to a user profile.
   * @returns A promise representing an async call to the endpoint. Available
   * response fields can be found in our [API Documentation](https://pangea.cloud/docs/api/authn/user#/v2/user/profile/update).
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
    data:
      | AuthN.User.Profile.Update.EmailRequest
      | AuthN.User.Profile.Update.IDRequest
      | AuthN.User.Profile.Update.UsernameRequest
  ): Promise<PangeaResponse<AuthN.User.Profile.UpdateResult>> {
    return this.post("v2/user/profile/update", data);
  }
}
