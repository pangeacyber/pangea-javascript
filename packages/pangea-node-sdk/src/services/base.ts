import PangeaConfig from "../config.js";
import PangeaRequest from "../request.js";
import PangeaResponse from "../response.js";

export interface BaseServiceOptions {
  isMultiConfigSupported?: boolean;
}

class BaseService {
  protected serviceName: string;
  protected isMultiConfigSupported: boolean;
  protected token: string;
  protected apiVersion: string;
  protected config: PangeaConfig;
  protected request: PangeaRequest;

  /*
  Required:
    - serviceName: name of the service
    - token: a token to use with the service

  Optional:
    - config: a PangeaConfig object, uses defaults if non passed
  */
  constructor(
    serviceName: string,
    token: string,
    config: PangeaConfig,
    options: BaseServiceOptions = {}
  ) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.serviceName = serviceName;
    this.apiVersion = "v1";
    this.token = token;

    this.isMultiConfigSupported =
      options.isMultiConfigSupported === undefined ? false : options.isMultiConfigSupported;
    this.config = new PangeaConfig({ ...config }) || new PangeaConfig();
    this.request = new PangeaRequest(
      this.serviceName,
      this.token,
      config,
      this.isMultiConfigSupported
    );
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
