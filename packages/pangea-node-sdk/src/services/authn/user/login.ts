import PangeaResponse from "@src/response.js";
import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import { AuthN } from "@src/types.js";

export default class UserLogin extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
  }

  // authn::/v1/user/login/password
  /**
   * @summary Login with a password
   * @description Login a user with a password and return the user's token and information.
   * @operationId authn_post_v1_user_login_password
   * @param {String} email - An email address
   * @param {String} password - The user's password
   * @param {Object} options - Supported options:
   *   -  extra_profile (object): A user profile as a collection of string properties
   * @returns {Promise<PangeaResponse<AuthN.User.Login.LoginResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.user.login.password(
   *   "joe.user@email.com",
   *   "My1s+Password",
   *   {
   *     extra_profile: {
   *       first_name: "Joe",
   *       last_name: "User",
   *     },
   *   }
   * );
   * ```
   */
  password(
    email: string,
    password: string,
    options: AuthN.User.Login.PasswordOptions = {}
  ): Promise<PangeaResponse<AuthN.User.Login.LoginResult>> {
    const data: AuthN.User.Login.PasswordRequest = {
      email: email,
      password: password,
    };
    Object.assign(data, options);

    return this.post("v1/user/login/password", data);
  }

  // authn::/v1/user/login/social
  /**
   * @summary Login with a social provider
   * @description Login a user by their social ID and return the user's token and information.
   * @operationId authn_post_v1_user_login_social
   * @param {AuthN.IDProvider} provider - Social identity provider for authenticating a user's identity
   * @param {String} email - An email address
   * @param {String} socialID - User's social ID with the provider
   * @param {Object} options - Supported options:
   *   -  extra_profile (object): A user profile as a collection of string properties
   * @returns {Promise<PangeaResponse<AuthN.User.Login.LoginResult>>} - A promise
   * representing an async call to the endpoint.
   * @example
   * ```js
   * const response = await authn.user.login.social(
   *   AuthN.IDProvider.GOOGLE,
   *   "joe.user@email.com",
   *   "My1s+Password",
   *   {
   *     extra_profile: {
   *       first_name: "Joe",
   *       last_name: "User",
   *     },
   *   }
   * );
   * ```
   */
  social(
    provider: AuthN.IDProvider,
    email: string,
    socialID: string,
    options: AuthN.User.Login.SocialOptions = {}
  ): Promise<PangeaResponse<AuthN.User.Login.LoginResult>> {
    const data: AuthN.User.Login.SocialRequest = {
      provider: provider,
      email: email,
      social_id: socialID,
    };
    Object.assign(data, options);

    return this.post("v1/user/login/social", data);
  }
}
