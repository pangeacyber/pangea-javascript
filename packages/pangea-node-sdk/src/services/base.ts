import PangeaConfig from "@src/config.js";
import PangeaRequest from "@src/request.js";
import PangeaResponse from "@src/response.js";

class BaseService {
  protected serviceName: string;
  protected isMultiConfigSupported: boolean = false;
  protected token: string;
  protected apiVersion: string;
  protected config: PangeaConfig;
  protected request_: PangeaRequest | undefined = undefined;

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

    this.config = new PangeaConfig({ ...config }) || new PangeaConfig();
  }

  async get(endpoint: string, path: string): Promise<PangeaResponse<any>> {
    const fullpath = `${this.apiVersion}/${path}`;
    return await this.request.get(endpoint, fullpath);
  }

  async post(endpoint: string, data: object): Promise<PangeaResponse<any>> {
    const fullpath = `${this.apiVersion}/${endpoint}`;
    return await this.request.post(fullpath, data);
  }

  get request(): PangeaRequest {
    if (this.request_) {
      return this.request_;
    }

    this.request_ = new PangeaRequest(
      this.serviceName,
      this.token,
      this.config,
      this.isMultiConfigSupported
    );

    return this.request_;
  }
}

export default BaseService;
