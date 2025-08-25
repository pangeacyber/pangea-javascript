import type { PangeaResponse } from "@src/response.js";
import { BaseService } from "@src/services/base.js";
import type { PangeaConfig } from "@src/config.js";
import type { AuthN, PangeaToken } from "@src/types.js";

export class Group extends BaseService {
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("authn", token, config);
  }

  /**
   * @summary Create a new group
   * @description Create a new group
   * @operationId authn_post_v2_group_create
   */
  async create(input: {
    name: string;
    type: string;
    description?: string;
    attributes?: Record<string, string>;
  }): Promise<PangeaResponse<AuthN.GroupInfo>> {
    return await this.post("v2/group/create", input);
  }

  /**
   * @summary Delete a group
   * @description Delete a group
   * @operationId authn_post_v2_group_delete
   */
  async delete(id: string): Promise<PangeaResponse<{}>> {
    return await this.post("v2/group/delete", { id });
  }

  /**
   * @summary Get group information
   * @description Look up a group by ID and return its information
   * @operationId authn_post_v2_group_get
   */
  async get(id: string): Promise<PangeaResponse<AuthN.GroupInfo>> {
    return await this.post("v2/group/get", { id });
  }

  /**
   * @summary List groups
   * @description Look up groups by name, type, or attributes
   */
  async list(input: {
    filter?: AuthN.GroupsFilter;
    last?: string;
    order?: "asc" | "desc";
    order_by?: "id" | "created_at" | "updated_at" | "name" | "type";
    size?: number;
  }): Promise<PangeaResponse<AuthN.GroupList>> {
    return await this.post("v2/group/list", input);
  }

  /**
   * @summary List of users assigned to a group
   * @description Return a list of ids for users assigned to a group
   * @operationId authn_post_v2_group_user_list
   */
  async listUsers(input: {
    id: string;
    last?: string;
    size?: number;
  }): Promise<PangeaResponse<AuthN.GroupUserList>> {
    return await this.post("v2/group/user/list", input);
  }

  /**
   * @summary Update group information
   * @description Update group information
   * @operationId authn_post_v2_group_update
   */
  async update(input: {
    id: string;
    name?: string;
    description?: string;
    type?: string;
    attributes?: Record<string, string>;
  }): Promise<PangeaResponse<AuthN.GroupInfo>> {
    return await this.post("v2/group/update", input);
  }
}
