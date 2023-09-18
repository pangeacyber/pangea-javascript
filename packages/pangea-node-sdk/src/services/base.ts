import PangeaConfig from "@src/config.js";
import PangeaRequest from "@src/request.js";
import PangeaResponse from "@src/response.js";
import { PostOptions } from "@src/types.js";

class BaseService {
  protected serviceName: string;
  protected token: string;
  protected apiVersion: string;
  protected config: PangeaConfig;
  protected request_: PangeaRequest | undefined = undefined;
  protected configID?: string;

  /*
  Required:
    - serviceName: name of the service
    - token: a token to use with the service

  Optional:
    - config: a PangeaConfig object, uses defaults if non passed
  */
  constructor(serviceName: string, token: string, config: PangeaConfig, configID?: string) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.serviceName = serviceName;
    this.apiVersion = "v1";
    this.token = token;
    this.configID = configID;

    this.config = new PangeaConfig({ ...config }) || new PangeaConfig();
  }

  async get(endpoint: string): Promise<PangeaResponse<any>> {
    const fullpath = `${this.apiVersion}/${endpoint}`;
    return await this.request.get(fullpath);
  }

  async post(
    endpoint: string,
    data: object,
    options: PostOptions = {}
  ): Promise<PangeaResponse<any>> {
    const fullpath = `${this.apiVersion}/${endpoint}`;
    return await this.request.post(fullpath, data, options);
  }

  async postMultipart(
    endpoint: string,
    data: object,
    filepath: string,
    options: PostOptions = {}
  ): Promise<PangeaResponse<any>> {
    const fullpath = `${this.apiVersion}/${endpoint}`;
    return await this.request.postMultipart(fullpath, data, filepath, options);
  }

  async pollResult(request_id: string): Promise<PangeaResponse<any>> {
    return await this.request.pollResult(request_id, true);
  }

  get request(): PangeaRequest {
    if (this.request_) {
      return this.request_;
    }

    this.request_ = new PangeaRequest(this.serviceName, this.token, this.config, this.configID);

    return this.request_;
  }
}

export default BaseService;
