import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { AuthZ, PangeaToken } from "@src/types.js";

/**
 * AuthZService class provides methods for interacting with the AuthZ Service
 * @extends BaseService
 */
class AuthZService extends BaseService {
  /**
   * Creates a new `AuthZService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ baseURLTemplate: "https://{SERVICE_NAME}.aws.us.pangea.cloud" });
   * const audit = new AuthZService("pangea_token", config);
   * ```
   *
   * @summary AuthZ
   */
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("authz", token, config);
  }

  /**
   * @summary Tuple Create
   * @description Create tuples in the AuthZ Service. The request will fail if there is no schema
   * or the tuples do not validate against the schema.
   * @operationId authz_post_v1_tuple_create
   * @param {AuthZ.TupleCreateRequest} request - An object representing the request to create tuples.
   *    - {AuthZ.Tuple[]} request.tuples - List of tuples to be created.
   * @returns {Promise} - A promise representing an async call to the tuple create endpoint.
   * @example
   * ```typescript
   * const response = await authz.tupleCreate({
   *   tuples: [
   *     {
   *       resource: { type: 'folder', id: 'resource1' },
   *       relation: 'editor',
   *       subject: { type: 'user', id: 'user1' },
   *     },
   *     // Add more tuples as needed
   *   ],
   * });
   * ```
   */
  tupleCreate(
    request: AuthZ.TupleCreateRequest
  ): Promise<PangeaResponse<AuthZ.TupleCreateResult>> {
    return this.post("v1/tuple/create", request);
  }

  /**
   * @summary Tuple List
   * @description List tuples in the AuthZ Service based on provided filters.
   *
   * @operationId authz_post_v1_tuple_list
   * @param {AuthZ.TupleListRequest} request - An object representing the request to list tuples.
   *    - {AuthZ.TupleListFilter} request.filter - Filter object to narrow down the list of tuples.
   *    - {number} [request.size] - Maximum results to include in the response. Minimum is `1`.
   *    - {string} [request.last] - Reflected value from a previous response to obtain the next page of results.
   *    - {AuthZ.ItemOrder} [request.order] - Order results asc(ending) or desc(ending).
   *    - {AuthZ.TupleOrderBy} [request.order_by] - Which field to order results by.
   * @returns {Promise} - A promise representing an async call to the tuple list endpoint.
   * @example
   * ```typescript
   * const response = await authz.tupleList({
   *   filter: {
   *     resource_type: 'folder',
   *     resource_id: 'resource1',
   *   },
   *   size: 10,
   * });
   * ```
   */
  tupleList(
    request: AuthZ.TupleListRequest
  ): Promise<PangeaResponse<AuthZ.TupleListResult>> {
    return this.post("v1/tuple/list", request);
  }

  /**
   * @summary Tuple Delete
   * @description Delete tuples in the AuthZ Service based on the provided criteria.
   *
   * @operationId authz_post_v1_tuple_delete
   * @param {AuthZ.TupleDeleteRequest} request - An object representing the request to delete tuples.
   *    - {AuthZ.Tuple[]} request.tuples - List of tuples to be deleted.
   * @returns {Promise} - A promise representing an async call to the tuple delete endpoint.
   * @example
   * ```typescript
   * const response = await authz.tupleDelete({
   *   tuples: [
   *     {
   *       resource: { type: 'folder', id: 'resource1' },
   *       relation: 'owner',
   *       subject: { type: 'user', id: 'user1' },
   *     },
   *     // Add more tuples to be deleted as needed
   *   ],
   * });
   * ```
   */
  tupleDelete(
    request: AuthZ.TupleDeleteRequest
  ): Promise<PangeaResponse<AuthZ.TupleDeleteResult>> {
    return this.post("v1/tuple/delete", request);
  }

  /**
   * @summary Check Authorization
   * @description Check if a subject is authorized to perform an action on a resource in the AuthZ Service.
   *
   * @operationId authz_post_v1_check
   * @param {AuthZ.CheckRequest} request - An object representing the request to check authorization.
   *    - {AuthZ.Resource} request.resource - The resource to check authorization on.
   *    - {string} request.action - The action to check authorization for.
   *    - {AuthZ.Subject} request.subject - The subject attempting the action.
   *    - {boolean} [request.debug] - Setting this value to true will provide detailed debug information.
   *    - {AuthZ.Dictionary} [request.attributes] - Additional attributes for the authorization check.
   * @returns {Promise} - A promise representing an async call to the authorization check endpoint.
   * @example
   * ```typescript
   * const response = await authz.check({
   *   resource: { type: 'folder', id: 'resource1' },
   *   action: 'read',
   *   subject: { type: 'user', id: 'user1' },
   *   debug: true,
   * });
   * ```
   */
  check(
    request: AuthZ.CheckRequest
  ): Promise<PangeaResponse<AuthZ.CheckResult>> {
    return this.post("v1/check", request);
  }

  /**
   * @summary List Resources
   * @description List resources that a subject is authorized to perform a specified action on in the AuthZ Service.
   *
   * @operationId authz_post_v1_list_resources
   * @param {AuthZ.ListResourcesRequest} request - An object representing the request to list resources.
   *    - {string} request.type - The type of the resources.
   *    - {string} request.action - The action to list resources for.
   *    - {AuthZ.Subject} request.subject - The subject attempting the action.
   * @returns {Promise} - A promise representing an async call to the list resources endpoint.
   * @example
   * ```typescript
   * const response = await authz.listResources({
   *   type: 'folder',
   *   action: 'read',
   *   subject: { type: 'user', id: 'user1' },
   * });
   * ```
   */
  listResources(
    request: AuthZ.ListResourcesRequest
  ): Promise<PangeaResponse<AuthZ.ListResourcesResult>> {
    return this.post("v1/list-resources", request);
  }

  /**
   * @summary List Subjects
   * @description List subjects that are authorized to perform a specified action on a resource in the AuthZ Service.
   *
   * @operationId authz_post_v1_list_subjects
   * @param {AuthZ.ListSubjectsRequest} request - An object representing the request to list subjects.
   *    - {AuthZ.Resource} request.resource - The resource to list subjects for.
   *    - {string} request.action - The action to list subjects for.
   * @returns {Promise} - A promise representing an async call to the list subjects endpoint.
   * @example
   * ```typescript
   * const response = await authz.listSubjects({
   *   resource: { type: 'folder', id: 'resource1' },
   *   action: 'read',
   * });
   * ```
   */
  listSubjects(
    request: AuthZ.ListSubjectsRequest
  ): Promise<PangeaResponse<AuthZ.ListSubjectsResult>> {
    return this.post("v1/list-subjects", request);
  }
}

export default AuthZService;
