import got, { Options, HTTPError, ResponseType } from "got";
import type { Headers, Response } from "got";
import FormData from "form-data";
import fs from "fs";
import { FileData, FileItems, PostOptions, TransferMethod } from "./types.js";

import PangeaConfig, { version } from "./config.js";
import { ConfigEnv } from "./types.js";
import { PangeaErrors } from "./errors.js";
import { AttachedFile, PangeaResponse, ResponseObject } from "./response.js";
import { getHeaderField } from "./utils/multipart.js";

const delay = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

interface Request extends Object {
  config_id?: string;
  transfer_method?: TransferMethod;
}

class PangeaRequest {
  private serviceName: string;
  private token: string;
  private config: PangeaConfig;
  private extraHeaders: Object;
  private configID?: string;
  private userAgent: string = "";

  constructor(serviceName: string, token: string, config: PangeaConfig, configID?: string) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.serviceName = serviceName;
    this.token = token;
    this.config = new PangeaConfig({ ...config });
    this.setCustomUserAgent(config.customUserAgent);
    this.extraHeaders = {};
    this.configID = configID;
  }

  checkConfigID(data: Request) {
    if (this.configID && !data.config_id) {
      data.config_id = this.configID;
    }
  }

  /**
   * `POST` request.
   *
   * @template R Result type.
   * @param endpoint Endpoint path.
   * @param data Request body.
   * @param options Additional options.
   * @returns A `Promise` of the response.
   */
  async post<R>(
    endpoint: string,
    data: Request,
    options: PostOptions = {}
  ): Promise<PangeaResponse<R>> {
    const url = this.getUrl(endpoint);
    this.checkConfigID(data);

    let response: Response;
    let entry = options.files ? Object.entries(options.files)[0] : undefined;
    if (options.files && entry) {
      if (data.transfer_method === TransferMethod.POST_URL) {
        response = await this.fullPostPresignedURL(endpoint, data, entry[1]);
      } else {
        response = await this.postMultipart(endpoint, data, options.files);
      }
    } else {
      let responseType: ResponseType =
        data.transfer_method == TransferMethod.MULTIPART ? "buffer" : "json";
      const request = new Options({
        headers: this.getHeaders(),
        json: data,
        retry: { limit: this.config.requestRetries },
        responseType: responseType,
      });
      response = await this.httpPost(url, request);
    }

    return this.handleHttpResponse(response, options);
  }

  public async downloadFile(url: string): Promise<AttachedFile> {
    const options = new Options({
      retry: { limit: this.config.requestRetries },
      responseType: "buffer",
    });
    const response = (await got.get(url, options)) as Response;

    let contentDispositionHeader = response.headers["Content-Disposition"];
    let contentDisposition = "";
    if (Array.isArray(contentDispositionHeader)) {
      contentDisposition = contentDispositionHeader[0] ?? contentDisposition;
    }

    const contentTypeHeader = response.headers["Content-Type"] ?? "";
    let contentType = "application/octet-stream";
    if (Array.isArray(contentTypeHeader)) {
      contentType = contentTypeHeader[0] ?? contentType;
    }

    const filename = getHeaderField(contentDisposition, "filename", "defaultFilename");
    return new AttachedFile(filename, response.rawBody, contentType);
  }

  private async postMultipart(
    endpoint: string,
    data: Request,
    files: FileItems
  ): Promise<Response> {
    const url = this.getUrl(endpoint);
    const form = new FormData();
    this.checkConfigID(data);

    form.append("request", JSON.stringify(data), { contentType: "application/json" });
    for (let [name, fileData] of Object.entries(files)) {
      form.append(name, this.getFileToForm(fileData.file), {
        contentType: "application/octet-stream",
      });
    }

    const request = new Options({
      headers: this.getHeaders(),
      body: form,
      retry: { limit: this.config.requestRetries },
      responseType: "json",
    });

    return await this.httpPost(url, request);
  }

  private getFileToForm(file: Blob | Buffer | string) {
    if (typeof file === "string") {
      return fs.createReadStream(file);
    }
    return file;
  }

  private async fullPostPresignedURL(
    endpoint: string,
    data: Request,
    fileData: FileData
  ): Promise<Response> {
    const response = await this.requestPresignedURL(endpoint, data);
    if (!response.gotResponse || !response.accepted_result?.post_url) {
      throw new PangeaErrors.PangeaError("Failed to request post presigned URL");
    }

    const presigned_url = response.accepted_result.post_url;
    const file_details = response.accepted_result?.post_form_data;

    this.toPresignedURL(presigned_url, {
      file: fileData.file,
      file_details: file_details,
      name: fileData.name,
    });
    return response.gotResponse;
  }

  private async toPresignedURL(url: string, fileData: FileData) {
    const form = new FormData();

    if (fileData.file_details) {
      for (const [key, value] of Object.entries(fileData.file_details)) {
        form.append(key, value);
      }
    }

    form.append(fileData.name, this.getFileToForm(fileData.file), {
      contentType: "application/octet-stream",
    });

    const request = new Options({
      body: form,
      retry: { limit: this.config.requestRetries },
      responseType: "json",
    });

    try {
      if (fileData.file_details) {
        await this.httpPost(url, request);
      } else {
        await this.httpPut(url, request);
      }
    } catch (error) {
      if (error instanceof HTTPError) {
        throw new PangeaErrors.PresignedUploadError(
          `presigned POST failure: ${error.code}`,
          JSON.stringify(error.response.body)
        );
      }
    }
    return;
  }

  public async postPresignedURL(url: string, fileData: FileData) {
    if (!fileData.file_details) {
      throw new PangeaErrors.PangeaError("file_details should be defined to do a post");
    }

    await this.toPresignedURL(url, fileData);
  }

  public async putPresignedURL(url: string, fileData: FileData) {
    if (fileData.file_details) {
      throw new PangeaErrors.PangeaError("file_details should be undefined to do a put");
    }

    await this.toPresignedURL(url, fileData);
  }

  public async requestPresignedURL(endpoint: string, data: Request): Promise<PangeaResponse<any>> {
    let acceptedError;
    if (!data.transfer_method) {
      data.transfer_method = TransferMethod.PUT_URL;
    }

    try {
      await this.post(endpoint, data, {
        pollResultSync: false,
      });
      throw new PangeaErrors.PangeaError("This call should return 202");
    } catch (error) {
      if (!(error instanceof PangeaErrors.AcceptedRequestException)) {
        throw error;
      } else {
        acceptedError = error;
      }
    }

    return await this.pollPresignedURL(acceptedError.response);
  }

  private async pollPresignedURL(
    response: PangeaResponse<PangeaErrors.Errors>
  ): Promise<PangeaResponse<any>> {
    if (
      response.accepted_result &&
      (response.accepted_result.post_url || response.accepted_result.put_url)
    ) {
      return response;
    }
    let retryCount = 0;
    const start = Date.now();
    let loopResponse = response;

    const body = loopResponse.gotResponse?.body as ResponseObject<any>;
    const requestId = body?.request_id;
    let loopError;

    while (
      !loopResponse.accepted_result?.post_url &&
      loopResponse.accepted_result?.put_url &&
      !this.reachTimeout(start)
    ) {
      retryCount += 1;
      const waitTime = this.getDelay(retryCount, start);
      await delay(waitTime);

      try {
        loopResponse = await this.pollResult(requestId, false);
        throw new PangeaErrors.PangeaError("This call should return 202");
      } catch (error) {
        if (!(error instanceof PangeaErrors.AcceptedRequestException)) {
          throw error;
        } else {
          loopError = error;
          loopResponse = error.pangeaResponse;
        }
      }
    }

    if (loopResponse.accepted_result?.post_url || loopResponse.accepted_result?.put_url) {
      return loopResponse;
    } else {
      throw loopError;
    }
  }

  private async httpPost(url: string, request: object): Promise<Response> {
    try {
      return (await got.post(url, request)) as Response;
    } catch (error) {
      if (error instanceof HTTPError) {
        // This MUST throw an error
        this.checkResponse(new PangeaResponse(error.response));
      }
      throw error;
    }
  }

  private async httpPut(url: string, request: object): Promise<Response> {
    try {
      return (await got.put(url, request)) as Response;
    } catch (error) {
      if (error instanceof HTTPError) {
        // This MUST throw an error
        this.checkResponse(new PangeaResponse(error.response));
      }
      throw error;
    }
  }

  private async handleHttpResponse<R>(
    response: Response,
    options: PostOptions = {}
  ): Promise<PangeaResponse<R>> {
    try {
      let pangeaResponse = new PangeaResponse<R>(response);
      if (response.statusCode === 202) {
        if (options.pollResultSync !== false) {
          pangeaResponse = await this.handleAsync(pangeaResponse);
        }
        return this.checkResponse(pangeaResponse);
      }
      return this.checkResponse(pangeaResponse);
    } catch (error) {
      if (error instanceof HTTPError) {
        // This MUST throw an error
        return this.checkResponse(new PangeaResponse(error.response));
      }
      // TODO: add handling of lower level errors?
      throw error;
    }
  }

  public async get(endpoint: string, checkResponse: boolean = true): Promise<PangeaResponse<any>> {
    const url = this.getUrl(endpoint);
    const options = new Options({
      headers: this.getHeaders(),
      retry: { limit: this.config.requestRetries },
      responseType: "json",
    });

    try {
      const response = (await got.get(url, options)) as Response;
      const pangeaResponse = new PangeaResponse(response);
      return checkResponse ? this.checkResponse(pangeaResponse) : pangeaResponse;
    } catch (error) {
      if (error instanceof HTTPError) {
        // This MUST throw and error
        const pangeaResponse = new PangeaResponse(error.response);
        return checkResponse ? this.checkResponse(pangeaResponse) : pangeaResponse;
      }
      // TODO: add handling of lower level errors?
      throw error;
    }
  }

  private getDelay(retryCount: number, start: number): number {
    let delay = retryCount * retryCount * 1000;
    const now = Date.now();
    if (now + delay > start + this.config.pollResultTimeoutMs) {
      delay = start + this.config.pollResultTimeoutMs - now;
    }

    return delay;
  }

  private reachTimeout(start: number): boolean {
    const now = Date.now();
    return start + this.config.pollResultTimeoutMs <= now;
  }

  public async pollResult(
    requestId: string,
    checkResponse: boolean = true
  ): Promise<PangeaResponse<any>> {
    const path = `request/${requestId}`;
    // eslint-disable-next-line no-await-in-loop
    return await this.get(path, checkResponse);
  }

  private async handleAsync(pangeaResponse: PangeaResponse<any>): Promise<PangeaResponse<any>> {
    if (!this.config.queuedRetryEnabled) {
      return pangeaResponse;
    }

    let retryCount = 0;
    const start = Date.now();
    const body = pangeaResponse.gotResponse?.body as ResponseObject<any>;
    const requestId = body?.request_id;

    while (pangeaResponse.gotResponse?.statusCode === 202 && !this.reachTimeout(start)) {
      retryCount += 1;
      const waitTime = this.getDelay(retryCount, start);

      // eslint-disable-next-line no-await-in-loop
      await delay(waitTime);
      pangeaResponse = await this.pollResult(requestId, false);
    }
    return pangeaResponse;
  }

  public setExtraHeaders(headers: any): any {
    this.extraHeaders = { ...headers };
  }

  public setCustomUserAgent(customUserAgent: string | undefined): any {
    this.config.customUserAgent = customUserAgent;
    this.userAgent = `pangea-node/${version}`;
    if (this.config.customUserAgent) {
      this.userAgent += ` ${this.config.customUserAgent}`;
    }
  }

  public getUrl(path: string): string {
    let url;
    if (this.config.domain.startsWith("http://") || this.config.domain.startsWith("https://")) {
      url = `${this.config.domain}/${path}`;
    } else {
      const schema = this.config?.insecure === true ? "http://" : "https://";

      if (this.config?.environment == ConfigEnv.LOCAL) {
        url = `${schema}${this.config.domain}/${path}`;
      } else {
        url = `${schema}${this.serviceName}.${this.config.domain}/${path}`;
      }
    }

    return url;
  }

  private getHeaders(): Headers {
    const headers = {};
    const pangeaHeaders = {
      "User-Agent": this.userAgent,
      Authorization: `Bearer ${this.token}`,
    };

    if (Object.keys(this.extraHeaders).length > 0) {
      Object.assign(headers, this.extraHeaders);
    }
    // We want to overwrite extraHeaders if user set some of pangea headers values.
    Object.assign(headers, pangeaHeaders);
    return headers;
  }

  private checkResponse<T>(response: PangeaResponse<T>): PangeaResponse<T> {
    if (response.success) {
      return response;
    }

    if (response.gotResponse?.statusCode === 503) {
      throw new PangeaErrors.ServiceTemporarilyUnavailable(JSON.stringify(response.body));
    }

    switch (response.status) {
      case "ValidationError":
        throw new PangeaErrors.ValidationError(response.summary, response);
      case "TooManyRequests":
        throw new PangeaErrors.RateLimiteError(response.summary, response);
      case "NoCredit":
        throw new PangeaErrors.NoCreditError(response.summary, response);
      case "Unauthorized":
        throw new PangeaErrors.UnauthorizedError(this.serviceName, response);
      case "ServiceNotEnabled":
        throw new PangeaErrors.ServiceNotAvailableError(this.serviceName, response);
      case "ProviderError":
        throw new PangeaErrors.ProviderError(response.summary, response);
      case "MissingConfigIDScope":
      case "MissingConfigID":
        throw new PangeaErrors.MissingConfigID(this.serviceName, response);
      case "ServiceNotAvailable":
        throw new PangeaErrors.ServiceNotAvailableError(this.serviceName, response);
      case "InvalidPayloadReceived":
        throw new PangeaErrors.InvalidPayloadReceived(response.summary, response);
      case "ForbiddenVaultOperation":
        throw new PangeaErrors.ForbiddenVaultOperation(response.summary, response);
      case "NotFound":
        throw new PangeaErrors.NotFound(
          response.gotResponse?.requestUrl !== undefined
            ? response.gotResponse.requestUrl.toString()
            : "",
          response
        );
      case "InternalError":
        throw new PangeaErrors.InternalServerError(response);
      case "Accepted":
        throw new PangeaErrors.AcceptedRequestException(response);
      default:
        throw new PangeaErrors.APIError(response.status, response);
    }
  }
}

export default PangeaRequest;
