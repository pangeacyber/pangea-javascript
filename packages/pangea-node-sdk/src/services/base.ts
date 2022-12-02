import PangeaConfig from "../config.js";
import PangeaRequest from "../request.js";
import PangeaResponse from "../response.js";
import { PangeaErrors } from "../errors.js";

class BaseService {
  serviceName: string;
  token: string;
  apiVersion: string;
  config: PangeaConfig;
  request: PangeaRequest;

  /*
  Required:
    - serviceName: name of the service
    - token: a token to use with the service

  Optional:
    - config: a PangeaConfig object, uses defaults if non passed
  */
  constructor(serviceName: string, token: string, config: PangeaConfig) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.serviceName = serviceName;
    this.apiVersion = "v1";
    this.token = token;

    this.config = config || new PangeaConfig();
    this.request = new PangeaRequest(this.serviceName, this.token, this.config);
  }

  async get(endpoint: string, path: string): Promise<PangeaResponse<any>> {
    const fullpath = `${this.apiVersion}/${path}`;
    return await this.request.get(endpoint, fullpath);
  }

  async post(endpoint: string, data: object): Promise<PangeaResponse<any>> {
    const fullpath = `${this.apiVersion}/${endpoint}`;
    return await this.request.post(fullpath, data);
  }
}

export default BaseService;
