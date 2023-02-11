import PangeaResponse from "../../response";
import BaseService from "../base";
import PangeaConfig from "../../config";
import { AuthN } from "../../types";

export default class AuthNSession extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authnsession", token, config);
    this.apiVersion = "v1";
  }

  // - path: authn::/v1/session/invalidate
  invalidate(session_id: string): Promise<PangeaResponse<{}>> {
    return this.post("session/invalidate", { session_id });
  }

  // - path: authn::/v1/session/list
  list({
    filter,
    last,
    order,
    order_by,
    size,
  }: AuthN.SessionListRequest): Promise<PangeaResponse<AuthN.SessionListResponse>> {
    const data: AuthN.SessionListRequest = {};

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
