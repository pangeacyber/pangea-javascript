import PangeaResponse from "../../../response";
import BaseService from "../../base";
import PangeaConfig from "../../../config";
import { AuthN } from "../../../types";

export default class ClientSession extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // - path: authn::/v1/client/session/invalidate
  invalidate(token: string, sessionID: string): Promise<PangeaResponse<{}>> {
    const data: AuthN.Client.Session.InvalidateRequest = {
      token: token,
      session_id: sessionID,
    };

    return this.post("client/session/invalidate", data);
  }

  // - path: authn::/v1/client/session/list
  list(
    token: string,
    { filter, last, order, order_by, size }: AuthN.Client.Session.ListOptions
  ): Promise<PangeaResponse<AuthN.Session.ListResult>> {
    const data: AuthN.Client.Session.ListRequest = {
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
    refreshToken: string,
    { user_token }: AuthN.Client.Session.RefreshOptions
  ): Promise<PangeaResponse<AuthN.Client.Session.RefreshResult>> {
    const data: AuthN.Client.Session.RefreshRequest = {
      refresh_token: refreshToken,
    };

    if (user_token) data.user_token = user_token;

    return this.post("client/session/refresh", data);
  }
}
