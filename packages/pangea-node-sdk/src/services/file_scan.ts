import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import {
  FileData,
  FileScan,
  PostOptions,
  TransferMethod,
  FileItems,
} from "@src/types.js";
import { getFileUploadParams } from "@src/utils/utils.js";
import { PangeaErrors } from "@src/errors.js";
import PangeaRequest from "@src/request.js";

export class FileScanService extends BaseService {
  /**
   * Creates a new `FileScanService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ domain: "pangea_domain" });
   * const client = new FileScanService("pangea_token", config);
   * ```
   *
   * @summary File Scan
   */
  constructor(token: string, config: PangeaConfig) {
    super("file-scan", token, config);
  }

  /**
   * @summary Scan
   * @description Scan a file for malicious content.
   * @operationId file_scan_post_v1_scan
   * @param {FileScan.ScanRequest} request
   * @param {string} filepath
   * @param {FileScan.Options} options
   * @returns {Promise} - A promise representing an async call to the check endpoint
   * @example
   * ```js
   * const request = { verbose: true, raw: true, provider: "crowdstrike" };
   * const response = await client.fileScan(request, "./path/to/file.pdf");
   * ```
   */
  fileScan(
    request: FileScan.ScanRequest,
    file?: string | FileData, // This param is optional. It should be null when using the source_url method
    options: FileScan.Options = {
      pollResultSync: true,
    }
  ): Promise<PangeaResponse<FileScan.ScanResult>> {
    let fsData = {} as FileScan.ScanFileParams;

    if (request.transfer_method === TransferMethod.PUT_URL) {
      throw new PangeaErrors.PangeaError(
        `${request.transfer_method} not supported in this function. Use getUploadURL() instead.`
      );
    }

    let postFile: FileData | undefined = undefined;
    let files: FileItems | undefined = undefined;

    if (typeof file === "string") {
      postFile = {
        name: "file",
        file: file,
      };
    } else {
      postFile = file;
    }

    if (postFile) {
      files = {
        file: postFile,
      };
    }

    const postOptions: PostOptions = {
      pollResultSync: options.pollResultSync,
      files: files,
    };

    if (
      (!request.transfer_method ||
        request.transfer_method === TransferMethod.POST_URL) &&
      postFile
    ) {
      fsData = getFileUploadParams(postFile.file);
    }

    const fullRequest: FileScan.ScanFullRequest = {
      ...fsData,
      ...request,
    };
    return this.post("v1/scan", fullRequest, postOptions);
  }

  // TODO: Docs
  async requestUploadURL(
    request: FileScan.ScanRequest,
    options: {
      params?: FileScan.ScanFileParams;
    } = {}
  ): Promise<PangeaResponse<FileScan.ScanResult>> {
    if (
      request.transfer_method === TransferMethod.POST_URL &&
      !options.params
    ) {
      throw new PangeaErrors.PangeaError(
        `If transfer_method is ${TransferMethod.POST_URL} need to set options.params`
      );
    }

    let fsParams = {} as FileScan.ScanFileParams;
    if (request.transfer_method === TransferMethod.POST_URL && options.params) {
      fsParams = options.params;
    }

    const fullRequest: FileScan.ScanFullRequest = {
      ...fsParams,
      ...request,
    };

    return await this.request.requestPresignedURL("v1/scan", fullRequest);
  }
}

export class FileScanUploader {
  protected serviceName: string = "FileScanFileUploader";
  protected request_: PangeaRequest | undefined = undefined;

  constructor() {}

  private get request(): PangeaRequest {
    if (this.request_) {
      return this.request_;
    }

    this.request_ = new PangeaRequest(
      this.serviceName,
      "unusedtoken",
      new PangeaConfig()
    );
    return this.request_;
  }

  // TODO: Docs
  public async uploadFile(
    url: string,
    fileData: FileData,
    options: {
      transfer_method?: TransferMethod;
    }
  ) {
    if (
      !options.transfer_method ||
      options.transfer_method === TransferMethod.PUT_URL
    ) {
      await this.request.putPresignedURL(url, fileData);
    } else if (options.transfer_method === TransferMethod.POST_URL) {
      await this.request.postPresignedURL(url, fileData);
    }
  }
}
