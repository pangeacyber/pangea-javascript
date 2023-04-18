import PangeaResponse from "../../response.js";
import BaseService from "../base.js";
import PangeaConfig from "../../config.js";
import { AuthN } from "../../types.js";

export default class Session extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // - path: authn::/v1/session/invalidate
  invalidate(sessionID: string): Promise<PangeaResponse<{}>> {
    return this.post("session/invalidate", { session_id: sessionID });
  }

  // - path: authn::/v1/session/list
  list({
    filter,
    last,
    order,
    order_by,
    size,
  }: AuthN.Session.ListRequest): Promise<PangeaResponse<AuthN.Session.ListResult>> {
    const data: AuthN.Session.ListRequest = {};

    if (filter) data.filter = filter;
    if (last) data.last = last;
    if (order) data.order = order;
    if (order_by) data.order_by = order_by;
    if (typeof size === "number") data.size = size;

    return this.post("session/list", data);
  }

  // - path: authn::/v1/session/logout
  logout(user_id: string): Promise<PangeaResponse<{}>> {
    return this.post("session/logout", { user_id });
  }
}
