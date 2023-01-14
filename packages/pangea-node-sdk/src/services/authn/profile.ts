import PangeaResponse from "../../response";
import BaseService from "../base";
import PangeaConfig from "../../config";
import { AuthN } from "../../types";
import { schema } from "../../utils/validation";

export default class AuthNProfile extends BaseService {
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
   * const response = await authn.userProfileGet({
   *   email: "joe.user@email.com",
   * });
   */ // @ts-ignore we're extending BaseService which already has a get method defined
  get(o: AuthN.UserProfileGetRequest = {}): Promise<PangeaResponse<AuthN.UserProfile>> {
    const valid = schema.object().shape({
      identity: schema.optional().string(o.identity),
      email: schema.optional().string(o.email),
    });

    if (!valid.identity) {
      throw "userProfileGet was called without supplying a valid identity";
    }
    if (!valid.email) {
      throw "userProfileGet was called without supplying a valid email";
    }

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
   * const response = await authn.userProfileUpdate({
   *   email: "joe.user@email.com",
   *   profile: {
   *     "phone": "18085967873",
   *     "deleteme": null,
   *   },
   * });
   */
  update(o: AuthN.UserProfileUpdateRequest): Promise<PangeaResponse<AuthN.UserProfile>> {
    const valid = schema.object().shape({
      identity: schema.optional().string(o.identity) || schema.optional().null(o.identity),
      email: schema.optional().string(o.email) || schema.optional().null(o.email),
      require_mfa:
        schema.optional().boolean(o.require_mfa) || schema.optional().null(o.require_mfa),
      mfa_value: schema.optional().string(o.mfa_value) || schema.optional().null(o.mfa_value),
      mfa_provider:
        schema.optional().string(o.mfa_provider) || schema.optional().null(o.mfa_provider),
      // No need to run validation on o.profile
      // since it's an object with a shape of any key value pair
    });

    if (!valid.identity) {
      throw "userProfileUpdate was called without supplying a valid identity";
    }
    if (!valid.email) {
      throw "userProfileUpdate was called without supplying a valid email";
    }
    if (!valid.require_mfa) {
      throw "userProfileUpdate was called without supplying a valid require_mfa";
    }
    if (!valid.mfa_value) {
      throw "userProfileUpdate was called without supplying a valid mfa_value";
    }
    if (!valid.mfa_provider) {
      throw "userProfileUpdate was called without supplying a valid mfa_provider";
    }

    return this.post("user/profile/update", o);
  }
}
