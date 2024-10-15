import PangeaConfig from "@src/config.js";
import PangeaRequest from "@src/request.js";
import PangeaResponse, { AttachedFile } from "@src/response.js";
import { PostOptions, PangeaToken } from "@src/types.js";

class BaseService {
  protected serviceName: string;
  protected token: string;
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
  constructor(
    serviceName: string,
    token: PangeaToken,
    config: PangeaConfig,
    configID?: string
  ) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.serviceName = serviceName;
    if (typeof token === "string") {
      this.token = token;
    } else {
      if (token.type !== "pangea_token")
        throw new Error(
          `Token passed as vault secret is not of type 'pangea_token', but of type '${token.type}'`
        );
      if (!token.enabled)
        throw new Error(
          "Token passed as vault secret is not currently enabled"
        );

      const currentVersion = token.item_versions[0];
      if (!currentVersion)
        throw new Error(
          "Token passed as vault secret does not have a current version"
        );
      if (currentVersion.state !== "active")
        throw new Error("Token passed as vault secret is not currently active");
      if (!currentVersion.secret)
        throw new Error(
          "Vault secret field is not populated, cannot pass as token"
        );
      this.token = currentVersion.secret;
    }
    this.configID = configID;

    this.config = new PangeaConfig({ ...config }) || new PangeaConfig();
  }

  async get(endpoint: string): Promise<PangeaResponse<any>> {
    return await this.request.get(endpoint);
  }

  /**
   * `POST` request.
   *
   * @internal
   * @template R Result type.
   * @param endpoint Endpoint path.
   * @param data Request body.
   * @param options Additional options.
   * @returns A `Promise` of the response.
   */
  protected async post<R>(
    endpoint: string,
    data: object,
    options: PostOptions = {}
  ): Promise<PangeaResponse<R>> {
    return await this.request.post(endpoint, data, options);
  }

  async downloadFile(url: string): Promise<AttachedFile> {
    return await this.request.downloadFile(url);
  }

  async pollResult<R = any>(request_id: string): Promise<PangeaResponse<R>> {
    return await this.request.pollResult(request_id, true);
  }

  get request(): PangeaRequest {
    if (this.request_) {
      return this.request_;
    }

    this.request_ = new PangeaRequest(
      this.serviceName,
      this.token,
      this.config,
      this.configID
    );
    return this.request_;
  }
}

export default BaseService;
