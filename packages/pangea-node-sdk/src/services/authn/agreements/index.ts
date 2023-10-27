import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import PangeaResponse from "@src/response.js";
import { AuthN } from "@src/types.js";

export default class Agreements extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
  }

  /**
   * @summary Create an agreement
   * @description Create an agreement.
   * @operationId authn_post_v2_agreements_create
   * @param {AuthN.Agreements.CreateRequest} request
   * @returns {Promise<PangeaResponse<AuthN.Agreements.CreateResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/agreements#/v2/agreements/create).
   * @example
   * ```js
   * const response = await authn.agreements.create({
   *   type: AuthN.Agreements.AgreementType.EULA,
   *   name: "EULA_V1",
   *   text: "You agree to behave yourself while logged in.",
   * });
   * ```
   */
  create(
    request: AuthN.Agreements.CreateRequest
  ): Promise<PangeaResponse<AuthN.Agreements.CreateResult>> {
    return this.post("v2/agreements/create", request);
  }

  /**
   * @summary Delete an agreement
   * @description Delete an agreement.
   * @operationId authn_post_v2_agreements_delete
   * @param {AuthN.Agreements.DeleteRequest} request
   * @returns {Promise<PangeaResponse<AuthN.Agreements.DeleteResult>>} - A PangeaResponse
   * with an empty object.
   * @example
   * ```js
   * await authn.agreements.delete({
   *   type: AuthN.Agreements.AgreementType.EULA,
   *   id: "peu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
   * });
   * ```
   */
  delete(
    request: AuthN.Agreements.DeleteRequest
  ): Promise<PangeaResponse<AuthN.Agreements.DeleteResult>> {
    return this.post("v2/agreements/delete", request);
  }

  /**
   * @summary Update agreement
   * @description Update agreement.
   * @operationId authn_post_v2_agreements_update
   * @param {AuthN.Agreements.UpdateRequest} request
   * @returns {Promise<PangeaResponse<AuthN.Agreements.UpdateRequest>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/agreements#/v2/agreements/update).
   * @example
   * ```js
   * const response = await authn.agreements.update({
   *   type: AuthN.Agreements.AgreementType.EULA,
   *   id: "peu_wuk7tvtpswyjtlsx52b7yyi2l7zotv4a",
   *   text: "You agree to behave yourself while logged in. Don't be evil.",
   *   active: true,
   * });
   * ```
   */
  update(
    request: AuthN.Agreements.UpdateRequest
  ): Promise<PangeaResponse<AuthN.Agreements.UpdateRequest>> {
    return this.post("v2/agreements/update", request);
  }

  /**
   * @summary List agreements
   * @description List agreements.
   * @operationId authn_post_v2_agreements_list
   * @param {AuthN.Agreements.ListRequest} request
   * @returns {Promise<PangeaResponse<AuthN.Agreements.ListResult>>} - A promise
   * representing an async call to the endpoint. Available response fields can be found in our
   * [API Documentation](https://pangea.cloud/docs/api/authn/agreements#/v2/agreements/list).
   * @example
   * ```js
   * const response = await authn.agreements.list();
   * ```
   */
  list(
    request?: AuthN.Agreements.ListRequest
  ): Promise<PangeaResponse<AuthN.Agreements.ListResult>> {
    return this.post("v2/agreements/list", request ?? {});
  }
}
