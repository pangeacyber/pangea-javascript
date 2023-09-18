import BaseService from "@src/services/base.js";
import PangeaConfig from "@src/config.js";
import PangeaResponse from "@src/response.js";
import { AuthN } from "@src/types.js";

export default class Agreements extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("authn", token, config);
    this.apiVersion = "v1";
  }

  // TODO: Docs
  create(
    request: AuthN.Agreements.CreateRequest
  ): Promise<PangeaResponse<AuthN.Agreements.CreateResult>> {
    return this.post("agreements/create", request);
  }

  // TODO: Docs
  delete(
    request: AuthN.Agreements.DeleteRequest
  ): Promise<PangeaResponse<AuthN.Agreements.DeleteResult>> {
    return this.post("agreements/delete", request);
  }

  // TODO: Docs
  update(
    request: AuthN.Agreements.UpdateRequest
  ): Promise<PangeaResponse<AuthN.Agreements.UpdateRequest>> {
    return this.post("agreements/update", request);
  }

  // TODO: Docs
  list(
    request: AuthN.Agreements.ListRequest
  ): Promise<PangeaResponse<AuthN.Agreements.ListResult>> {
    return this.post("agreements/list", request);
  }
}
