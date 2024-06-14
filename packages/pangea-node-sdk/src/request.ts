import fs from "node:fs";
import { FormDataEncoder } from "form-data-encoder";
import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import promiseRetry from "promise-retry";
import PangeaConfig, { version } from "./config.js";
import { PangeaErrors } from "./errors.js";
import { AttachedFile, PangeaResponse } from "./response.js";
import {
  ConfigEnv,
  FileData,
  FileItems,
  PostOptions,
  TransferMethod,
} from "./types.js";
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

  constructor(
    serviceName: string,
    token: string,
    config: PangeaConfig,
    configID?: string
  ) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.serviceName = serviceName;
    this.token = token;
    this.config = new PangeaConfig({ ...config });
    this.setCustomUserAgent(config.customUserAgent);
    this.extraHeaders = {};
    this.configID = configID;
  }

  private checkConfigID(data: Request) {
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
  public async post<R>(
    endpoint: string,
    data: Request,
    options: PostOptions = {}
  ): Promise<PangeaResponse<R>> {
    const url = this.getUrl(endpoint);
    this.checkConfigID(data);

    let response: Response;
    const entry = options.files ? Object.entries(options.files)[0] : null;
    if (options.files && entry) {
      if (data.transfer_method === TransferMethod.POST_URL) {
        response = await this.fullPostPresignedURL(endpoint, data, entry[1]);
      } else {
        response = await this.postMultipart(endpoint, data, options.files);
      }
    } else {
      const responseType =
        data.transfer_method === TransferMethod.MULTIPART ? "buffer" : "json";
      const request = {
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        retry: { limit: this.config.requestRetries },
        responseType: responseType,
      };
      response = await this.httpPost(url, request);
    }

    return this.handleHttpResponse(response, options);
  }

  private getFilenameFromContentDisposition(
    contentDispositionHeader: string | string[] | undefined
  ): string | undefined {
    let contentDisposition = "";
    if (Array.isArray(contentDispositionHeader)) {
      contentDisposition = contentDispositionHeader[0] ?? contentDisposition;
    }

    return getHeaderField(contentDisposition, "filename", undefined);
  }

  private getFilenameFromURL(url: string): string | undefined {
    return new URL(url).pathname.split("/").pop();
  }

  public async downloadFile(url: string): Promise<AttachedFile> {
    const response = await this.httpRequest(url, {
      method: "GET",
      retry: { limit: this.config.requestRetries },
    });

    let filename = this.getFilenameFromContentDisposition(
      response.headers.get("Content-Disposition")!
    );
    if (filename === undefined) {
      filename = this.getFilenameFromURL(url);
      if (filename === undefined) {
        filename = "default_filename";
      }
    }

    const contentTypeHeader = response.headers.get("Content-Type") ?? "";
    let contentType = "application/octet-stream";
    if (Array.isArray(contentTypeHeader)) {
      contentType = contentTypeHeader[0] ?? contentType;
    }

    return new AttachedFile(
      filename,
      await response.arrayBuffer(),
      contentType
    );
  }

  private async postMultipart(
    endpoint: string,
    data: Request,
    files: FileItems
  ): Promise<Response> {
    const url = this.getUrl(endpoint);
    const form = new FormData();
    this.checkConfigID(data);

    form.append(
      "request",
      new Blob([JSON.stringify(data)], {
        type: "application/json",
      })
    );
    for (let [name, fileData] of Object.entries(files)) {
      form.append(name, await this.getFileToForm(fileData.file));
    }

    const encoder = new FormDataEncoder(form);

    const request = {
      headers: {
        ...this.getHeaders(),
        ...encoder.headers,
      },
      body: encoder.encode(),
      retry: { limit: this.config.requestRetries },
    };

    return await this.httpPost(url, request);
  }

  private async getFileToForm(file: Blob | Buffer | string) {
    if (typeof file === "string") {
      return await fileFromPath(file);
    }
    return file;
  }

  private getFileToBuffer(file: Buffer | string) {
    if (typeof file === "string") {
      return fs.readFileSync(file);
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
      throw new PangeaErrors.PangeaError(
        "Failed to request post presigned URL"
      );
    }

    const presigned_url = response.accepted_result.post_url;
    const file_details = response.accepted_result?.post_form_data;

    this.postPresignedURL(presigned_url, {
      file: fileData.file,
      file_details: file_details,
      name: fileData.name,
    });
    return response.gotResponse;
  }

  public async postPresignedURL(
    url: string,
    fileData: FileData
  ): Promise<void> {
    if (!fileData.file_details) {
      throw new PangeaErrors.PangeaError(
        "file_details should be defined to do a post"
      );
    }

    const form = new FormData();

    if (fileData.file_details) {
      for (const [key, value] of Object.entries(fileData.file_details)) {
        form.append(key, value);
      }
    }

    form.append("file", await this.getFileToForm(fileData.file));

    const response = await this.httpPost(url, {
      body: form,
      retry: { limit: this.config.requestRetries },
    });
    if (!response.ok) {
      throw new PangeaErrors.PresignedUploadError(
        `presigned POST failure: ${response.status}`,
        JSON.stringify(await response.json())
      );
    }
  }

  public async putPresignedURL(url: string, fileData: FileData): Promise<void> {
    if (fileData.file_details) {
      throw new PangeaErrors.PangeaError(
        "file_details should be undefined to do a put"
      );
    }

    const response = await this.httpRequest(url, {
      method: "PUT",
      body: this.getFileToBuffer(fileData.file),
      retry: { limit: this.config.requestRetries },
    });
    if (!response.ok) {
      throw new PangeaErrors.PresignedUploadError(
        `presigned PUT failure: ${response.status}`,
        JSON.stringify(await response.json())
      );
    }

    return;
  }

  public async requestPresignedURL(
    endpoint: string,
    data: Request
  ): Promise<PangeaResponse<any>> {
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

    const requestId = loopResponse.request_id;
    let loopError: Error = new RangeError();

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

    if (
      loopResponse.accepted_result?.post_url ||
      loopResponse.accepted_result?.put_url
    ) {
      return loopResponse;
    } else {
      throw loopError;
    }
  }

  /** Wrapper around `fetch()` POST with got-like options. */
  private async httpPost(
    url: string,
    options: {
      body: AsyncIterable<Uint8Array> | FormData | string;
      headers?: Record<string, string>;
      retry?: { limit: number };
    }
  ): Promise<Response> {
    const response = await this.httpRequest(url, {
      method: "POST",
      body: options.body,
      headers: options.headers,
    });

    if (response && response.ok) {
      return response;
    }

    // This MUST throw an error
    this.checkResponse(
      new PangeaResponse(response, await response.arrayBuffer())
    );

    // But in case it doesn't...
    return response;
  }

  private async httpRequest(
    url: string,
    options: {
      body?: AsyncIterable<Uint8Array> | Buffer | FormData | string;
      headers?: Record<string, string>;
      method: "GET" | "POST" | "PUT";
      retry?: { limit: number };
    }
  ): Promise<Response> {
    const fetchOptions: RequestInit = {
      duplex: "half",
      method: options.method,
      body: options.body,
      headers: options.headers,
    };

    return await promiseRetry(
      async (retry, _attempt) => {
        const response = await fetch(url, fetchOptions);

        // Retry on GET HTTP/404 because the existing result-polling code
        // depends on it. Note that the previous HTTP client, got, did not retry
        // POST requests by default, hence we don't do that here as well.
        if (fetchOptions.method === "GET" && response.status === 404) {
          return retry(response);
        }

        return response;
      },
      { retries: options.retry?.limit }
    );
  }

  private async handleHttpResponse<R>(
    response: Response,
    options: PostOptions = {}
  ): Promise<PangeaResponse<R>> {
    const body = await response.arrayBuffer();
    let pangeaResponse = new PangeaResponse<R>(response, body);
    if (response.status === 202 && options.pollResultSync !== false) {
      pangeaResponse = await this.handleAsync(pangeaResponse);
    }
    return this.checkResponse(pangeaResponse);
  }

  public async get<T>(
    endpoint: string,
    checkResponse: boolean = true
  ): Promise<PangeaResponse<T>> {
    const url = this.getUrl(endpoint);
    const response = await this.httpRequest(url, {
      headers: this.getHeaders(),
      method: "GET",
      retry: { limit: this.config.requestRetries },
    });
    const pangeaResponse = new PangeaResponse<T>(
      response,
      await response.arrayBuffer()
    );
    return checkResponse ? this.checkResponse(pangeaResponse) : pangeaResponse;
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

  private async handleAsync(
    pangeaResponse: PangeaResponse<any>
  ): Promise<PangeaResponse<any>> {
    if (!this.config.queuedRetryEnabled) {
      return pangeaResponse;
    }

    let retryCount = 0;
    const start = Date.now();
    const requestId = pangeaResponse.request_id;

    while (
      pangeaResponse.gotResponse?.status === 202 &&
      !this.reachTimeout(start)
    ) {
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
    let url: string;
    if (
      this.config.domain.startsWith("http://") ||
      this.config.domain.startsWith("https://")
    ) {
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

  private getHeaders(): Record<string, string> {
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

    if (response.gotResponse?.status === 503) {
      throw new PangeaErrors.ServiceTemporarilyUnavailable(
        JSON.stringify(response.body)
      );
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
        throw new PangeaErrors.ServiceNotAvailableError(
          this.serviceName,
          response
        );
      case "ProviderError":
        throw new PangeaErrors.ProviderError(response.summary, response);
      case "MissingConfigIDScope":
      case "MissingConfigID":
        throw new PangeaErrors.MissingConfigID(this.serviceName, response);
      case "ServiceNotAvailable":
        throw new PangeaErrors.ServiceNotAvailableError(
          this.serviceName,
          response
        );
      case "InvalidPayloadReceived":
        throw new PangeaErrors.InvalidPayloadReceived(
          response.summary,
          response
        );
      case "ForbiddenVaultOperation":
        throw new PangeaErrors.ForbiddenVaultOperation(
          response.summary,
          response
        );
      case "NotFound":
        throw new PangeaErrors.NotFound(
          response.gotResponse?.url !== undefined
            ? response.gotResponse.url.toString()
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
