import { Management } from "@src/types.js";
import PangeaConfig from "../config.js";
import PangeaResponse from "../response.js";
import BaseService from "./base.js";

class Authorization extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authorization.access", token, config);
  }
}

class Console extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("api.console", token, config);
  }
}

/** Management API client. */
export class ManagementService {
  private authorization: Authorization;
  private console: Console;

  /**
   * Creates a new `ManagementService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ domain: "pangea_domain" });
   * const management = new ManagementService("pangea_token", config);
   * ```
   *
   * @summary Management
   */
  constructor(token: string, config: PangeaConfig) {
    this.authorization = new Authorization(token, config);
    this.console = new Console(token, config);
  }

  /**
   * @summary Retrieve an organization
   * @description Retrieve an organization
   * @operationId api.console_post_v1beta_platform_org_get
   * @param orgId An Organization Pangea ID
   */
  async getOrg(
    orgId: string
  ): Promise<PangeaResponse<Management.Organization>> {
    return await this.console.request.post("v1beta/platform/org/get", {
      id: orgId,
    } as object);
  }

  /**
   * @summary Update an organization
   * @description Update an organization
   * @operationId api.console_post_v1beta_platform_org_update
   * @param orgId An Organization Pangea ID
   * @param name The new name for the organization
   */
  async updateOrg(
    orgId: string,
    name: string
  ): Promise<PangeaResponse<Management.Organization>> {
    return await this.console.request.post("v1beta/platform/org/update", {
      id: orgId,
      name: name,
    } as object);
  }

  /**
   * @summary Retrieve a project
   * @description Retrieve a project
   * @operationId api.console_post_v1beta_platform_project_get
   * @param projectId A Project Pangea ID
   */
  async getProject(
    projectId: string
  ): Promise<PangeaResponse<Management.Project>> {
    return await this.console.request.post("v1beta/platform/project/get", {
      id: projectId,
    } as object);
  }

  /**
   * @summary List projects
   * @description List projects
   * @operationId api.console_post_v1beta_platform_project_list
   * @param orgId An Organization Pangea ID
   * @param filter Optional filter criteria
   * @param offset Optional offset for pagination
   * @param limit Optional limit for pagination
   */
  async listProjects(
    orgId: string,
    options: {
      filter?: Management.ListProjectsFilter;
      offset?: number;
      limit?: number;
    } = {}
  ): Promise<PangeaResponse<Management.ListProjectsResult>> {
    return await this.console.request.post("v1beta/platform/project/list", {
      org_id: orgId,
      ...options,
    } as object);
  }

  /**
   * @summary Create a project
   * @description Create a project
   * @operationId api.console_post_v1beta_platform_project_create
   * @param request.org_id An Organization Pangea ID
   * @param request.name The name of the project
   * @param request.geo The geographical region for the project
   * @param request.region Optional region for the project
   */
  async createProject(request: {
    org_id: string;
    name: string;
    geo: "us" | "eu";
    region?: "us-west-1" | "us-east-1" | "eu-central-1";
  }): Promise<PangeaResponse<Management.Project>> {
    return await this.console.request.post(
      "v1beta/platform/project/create",
      request
    );
  }

  /**
   * @summary Update a project
   * @description Update a project
   * @operationId api.console_post_v1beta_platform_project_update
   * @param projectId A Project Pangea ID
   * @param name The new name for the project
   */
  async updateProject(
    projectId: string,
    name: string
  ): Promise<PangeaResponse<Management.Project>> {
    return await this.console.request.post("v1beta/platform/project/update", {
      id: projectId,
      name,
    } as object);
  }

  /**
   * @summary Delete a project
   * @description Delete a project
   * @operationId api.console_post_v1beta_platform_project_delete
   * @param projectId A Project Pangea ID
   */
  async deleteProject(
    projectId: string
  ): Promise<PangeaResponse<Management.Project>> {
    return await this.console.request.post("v1beta/platform/project/delete", {
      id: projectId,
    } as object);
  }

  /**
   * @summary Create Platform Client
   * @description Create Platform Client
   * @operationId createPlatformClient
   * @param request.scope A list of space separated scope
   * @param request.token_endpoint_auth_method The authentication method for the token endpoint.
   * @param request.redirect_uris A list of allowed redirect URIs for the client.
   * @param request.grant_types A list of OAuth grant types that the client can use.
   * @param request.response_types A list of OAuth response types that the client can use.
   * @param request.client_secret_expires_in A positive time duration in seconds or null
   * @param request.client_token_expires_in A positive time duration in seconds or null
   * @param request.roles A list of roles
   */
  async createClient(request: {
    client_name: string;
    scope: string;
    token_endpoint_auth_method?: Management.AccessClientTokenAuth;
    redirect_uris?: string[];
    grant_types?: string[];
    response_types?: (string | null)[];
    client_secret_expires_in?: number;
    client_token_expires_in?: number;
    client_secret_name?: string;
    client_secret_description?: string;
    roles?: Management.AccessRole[];
  }): Promise<Management.AccessClientCreateInfo> {
    return await this.authorization.request.post(
      "v1beta/oauth/clients/register",
      request,
      { pangeaResponse: false }
    );
  }

  /**
   * @summary List platform clients
   * @description List platform clients
   * @operationId listPlatformClients
   * @param options.created_at Only records where created_at equals this value
   * @param options.created_at__gt Only records where created_at is greater than this value
   * @param options.created_at__gte Only records where created_at is greater than or equal to this value
   * @param options.created_at__lt Only records where created_at is less than this value
   * @param options.created_at__lte Only records where created_at is less than or equal to this value
   * @param options.client_id Only records where id equals this value
   * @param options.client_id__contains Only records where id includes each substring
   * @param options.client_id__in Only records where id equals one of the provided substrings
   * @param options.client_name Only records where name equals this value
   * @param options.client_name__contains Only records where name includes each substring
   * @param options.client_name__in Only records where name equals one of the provided substrings
   * @param options.scopes A list of tags that all must be present
   * @param options.updated_at Only records where updated_at equals this value
   * @param options.updated_at__gt Only records where updated_at is greater than this value
   * @param options.updated_at__gte Only records where updated_at is greater than or equal to this value
   * @param options.updated_at__lt Only records where updated_at is less than this value
   * @param options.updated_at__lte Only records where updated_at is less than or equal to this value
   * @param options.last Reflected value from a previous response to obtain the next page of results
   * @param options.order Order results asc(ending) or desc(ending)
   * @param options.order_by Which field to order results by
   * @param options.size Maximum results to include in the response
   */
  async listClients(
    options: {
      created_at?: string;
      created_at__gt?: string;
      created_at__gte?: string;
      created_at__lt?: string;
      created_at__lte?: string;
      client_id?: string;
      client_id__contains?: string[];
      client_id__in?: string[];
      client_name?: string;
      client_name__contains?: string[];
      client_name__in?: string[];
      scopes?: string[];
      updated_at?: string;
      updated_at__gt?: string;
      updated_at__gte?: string;
      updated_at__lt?: string;
      updated_at__lte?: string;
      last?: string;
      order?: "asc" | "desc";
      order_by?: "id" | "created_at" | "updated_at" | "name" | "token_type";
      size?: number;
    } = {}
  ): Promise<Management.AccessClientListResult> {
    return await this.authorization.request.get<Management.AccessClientListResult>(
      "v1beta/oauth/clients",
      {
        query: { ...options },
        pangeaResponse: false,
      }
    );
  }

  /**
   * @summary Get a platform client
   * @description Get a platform client
   * @operationId getPlatformClient
   */
  async getClient(clientId: string): Promise<Management.AccessClientInfo> {
    return await this.authorization.request.get<Management.AccessClientInfo>(
      `v1beta/oauth/clients/${clientId}`,
      {
        pangeaResponse: false,
      }
    );
  }

  /**
   * @summary Update platform client's scope
   * @description Update platform client's scope
   * @operationId updatePlatformClient
   */
  async updateClient(request: {
    client_id: string;
    options: {
      scope: string;
      token_endpoint_auth_method?: Management.AccessClientTokenAuth;
      redirect_uris?: string[];
      response_types?: (string | null)[];
      grant_types?: string[];
    };
  }): Promise<Management.AccessClientInfo>;

  /**
   * @summary Update platform client's name
   * @description Update platform client's name
   * @operationId updatePlatformClient
   */
  async updateClient(request: {
    client_id: string;
    options: {
      client_name: string;
      token_endpoint_auth_method?: Management.AccessClientTokenAuth;
      redirect_uris?: string[];
      response_types?: (string | null)[];
      grant_types?: string[];
    };
  }): Promise<Management.AccessClientInfo>;

  /**
   * @summary Update platform client's scope
   * @description Update platform client's scope
   * @operationId updatePlatformClient
   */
  async updateClient(request: {
    client_id: string;
    options: {
      scope?: string;
      client_name?: string;
      token_endpoint_auth_method?: Management.AccessClientTokenAuth;
      redirect_uris?: string[];
      response_types?: (string | null)[];
      grant_types?: string[];
    };
  }): Promise<Management.AccessClientInfo> {
    return await this.authorization.request.post<Management.AccessClientInfo>(
      `v1beta/oauth/clients/${request.client_id}`,
      request.options,
      { pangeaResponse: false }
    );
  }

  /**
   * @summary Delete platform client
   * @description Delete platform client
   * @operationId deletePlatformClient
   * @param clientId The client ID to delete
   */
  async deleteClient(clientId: string): Promise<void> {
    await this.authorization.request.delete(`v1beta/oauth/clients/${clientId}`);
  }

  /**
   * @summary Create client secret
   * @description Create client secret
   * @operationId createClientSecret
   * @param request.client_secret_expires_in A positive time duration in seconds
   */
  async createClientSecret(request: {
    client_id: string;
    client_secret_id: string;
    client_secret_expires_in?: number;
    client_secret_name?: string;
    client_secret_description?: string;
  }): Promise<Management.AccessClientSecretInfo> {
    return await this.authorization.request.post(
      `v1beta/oauth/clients/${request.client_id}/secrets`,
      request,
      { pangeaResponse: false }
    );
  }

  /**
   * @summary List client secret metadata
   * @description List client secret metadata
   * @operationId listClientSecretMetadata
   * @param request.id The client ID to list secrets for
   * @param request.created_at Only records where created_at equals this value
   * @param request.created_at__gt Only records where created_at is greater than this value
   * @param request.created_at__gte Only records where created_at is greater than or equal to this value
   * @param request.created_at__lt Only records where created_at is less than this value
   * @param request.created_at__lte Only records where created_at is less than or equal to this value
   * @param request.client_secret_name Only records where name equals this value
   * @param request.client_secret_name__contains Only records where name includes each substring
   * @param request.client_secret_name__in Only records where name equals one of the provided substrings
   * @param request.last Reflected value from a previous response to obtain the next page of results
   * @param request.order Order results asc(ending) or desc(ending)
   * @param request.order_by Which field to order results by
   * @param request.size Maximum results to include in the response
   */
  async listClientSecretMetadata(request: {
    id: string;
    created_at?: string;
    created_at__gt?: string;
    created_at__gte?: string;
    created_at__lt?: string;
    created_at__lte?: string;
    client_secret_name?: string;
    client_secret_name__contains?: string[];
    client_secret_name__in?: string[];
    last?: string;
    order?: "asc" | "desc";
    order_by?: "id" | "created_at" | "updated_at" | "client_secret_id";
    size?: number;
  }): Promise<Management.AccessClientSecretInfoListResult> {
    const { id, ...params } = request;
    return await this.authorization.request.get<Management.AccessClientSecretInfoListResult>(
      `v1beta/oauth/clients/${id}/secrets/metadata`,
      {
        query: params,
        pangeaResponse: false,
      }
    );
  }

  /**
   * @summary Revoke client secret
   * @description Revoke client secret
   * @operationId revokeClientSecret
   * @param request.id The client ID
   * @param request.client_secret_id The client secret ID to revoke
   */
  async revokeClientSecret(request: {
    id: string;
    client_secret_id: string;
  }): Promise<void> {
    await this.authorization.request.delete(
      `v1beta/oauth/clients/${request.id}/secrets/${request.client_secret_id}`
    );
  }

  /**
   * @summary Update client secret
   * @description Update client secret
   * @operationId updateClientSecret
   * @param request.id The client ID
   * @param request.client_secret_id The client secret ID to update
   * @param request.client_secret_expires_in A positive time duration in seconds
   * @param request.client_secret_name The new name for the client secret
   * @param request.client_secret_description The new description for the client secret
   */
  async updateClientSecret(request: {
    id: string;
    client_secret_id: string;
    client_secret_expires_in?: number;
    client_secret_name?: string;
    client_secret_description?: string;
  }): Promise<Management.AccessClientSecretInfo> {
    const { id, client_secret_id, ...data } = request;
    return await this.authorization.request.post<Management.AccessClientSecretInfo>(
      `v1beta/oauth/clients/${id}/secrets/${client_secret_id}`,
      data,
      { pangeaResponse: false }
    );
  }

  /**
   * @summary List client roles
   * @description List client roles
   * @operationId listClientRoles
   * @param request.id The client ID
   * @param request.resource_type Filter by resource type
   * @param request.resource_id Filter by resource ID
   * @param request.role Filter by role
   */
  async listClientRoles(request: {
    id: string;
    resource_type?: string;
    resource_id?: string;
    role?: string;
  }): Promise<Management.AccessRolesListResult> {
    const { id, ...params } = request;
    return await this.authorization.request.get<Management.AccessRolesListResult>(
      `v1beta/oauth/clients/${id}/roles`,
      {
        query: params,
        pangeaResponse: false,
      }
    );
  }

  /**
   * @summary Grant client access
   * @description Grant client access
   * @operationId grantClientRoles
   * @param request.id The client ID
   * @param request.roles A list of roles
   * @param request.scope A list of space separated scope
   */
  async grantClientAccess(request: {
    id: string;
    roles: Management.AccessRole[];
    scope: string;
  }): Promise<void> {
    const { id, ...data } = request;
    await this.authorization.request.post(
      `v1beta/oauth/clients/${id}/grant`,
      data,
      { pangeaResponse: false }
    );
  }

  /**
   * @summary Revoke client access
   * @description Revoke client access
   * @operationId revokeClientRoles
   * @param request.id The client ID
   * @param request.roles A list of roles
   * @param request.scope A list of space separated scope
   */
  async revokeClientAccess(request: {
    id: string;
    roles: Management.AccessRole[];
    scope: string;
  }): Promise<void> {
    const { id, ...data } = request;
    await this.authorization.request.post(
      `v1beta/oauth/clients/${id}/revoke`,
      data,
      { pangeaResponse: false }
    );
  }
}

export default ManagementService;
