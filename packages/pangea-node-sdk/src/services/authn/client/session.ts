import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";

export default class AuthNClientSession extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authnclientsession", token, config);
    this.apiVersion = "v1";
  }

  // - path: authn::/v1/client/session/invalidate
  invalidate({
    token,
    session_id,
  }: AuthN.Client.Session.Invalidate.Request): Promise<PangeaResponse<{}>> {
    return this.post("client/session/invalidate", { token, session_id });
  }

  // - path: authn::/v1/client/session/list
  list(
    token: string,
    { filter, last, order, order_by, size }: AuthN.Client.Session.List.OptionalParams
  ): Promise<PangeaResponse<AuthN.Session.List.Response>> {
    const data: AuthN.Client.Session.List.Request = {
      token,
    };

    if (filter) data.filter = filter;
    if (last) data.last = last;
    if (order) data.order = order;
    if (order_by) data.order_by = order_by;
    if (typeof size === "number") data.size = size;

    return this.post("client/session/list", data);
  }

  // - path: authn::/v1/client/session/logout
  logout(token: string): Promise<PangeaResponse<{}>> {
    return this.post("client/session/logout", { token });
  }

  // - path: authn::/v1/client/session/refresh
  refresh(
    refresh_token: string,
    { user_token }: AuthN.Client.Session.Refresh.OptionalParams
  ): Promise<PangeaResponse<AuthN.Client.Session.Refresh.Response>> {
    const data: AuthN.Client.Session.Refresh.Request = {
      refresh_token,
    };

    if (user_token) data.user_token = user_token;

    return this.post("client/session/refresh", data);
  }
}
