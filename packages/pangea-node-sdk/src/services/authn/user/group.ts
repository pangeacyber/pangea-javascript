import type { PangeaResponse } from "@src/response.js";
import BaseService from "@src/services/base.js";
import type PangeaConfig from "@src/config.js";
import type { AuthN, PangeaToken } from "@src/types.js";

export class UserGroup extends BaseService {
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("authn", token, config);
  }

  /**
   * @summary Assign groups to a user
   * @description Add a list of groups to a specified user
   * @operationId authn_post_v2_user_group_assign
   */
  async assign(input: {
    id: string;
    group_ids: readonly string[];
  }): Promise<PangeaResponse<{}>> {
    return await this.post("v2/user/group/assign", input);
  }

  /**
   * @summary Remove a group assigned to a user
   * @description Remove a group assigned to a user
   * @operationId authn_post_v2_user_group_remove
   */
  async remove(input: {
    id: string;
    group_id: string;
  }): Promise<PangeaResponse<{}>> {
    return await this.post("v2/user/group/remove", input);
  }

  /**
   * @summary List of groups assigned to a user
   * @description Return a list of ids for groups assigned to a user
   * @operationId authn_post_v2_user_group_list
   */
  async list(id: string): Promise<PangeaResponse<AuthN.GroupList>> {
    return await this.post("v2/user/group/list", { id });
  }
}
