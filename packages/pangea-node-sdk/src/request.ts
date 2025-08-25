import { Buffer } from "node:buffer";
import fs from "node:fs";
import { URL } from "node:url";

import { FormDataEncoder } from "form-data-encoder";
import { File, FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import urlJoin from "proper-url-join";

import { PangeaConfig, version } from "./config.js";
import { PangeaErrors } from "./errors.js";
import { AttachedFile, PangeaResponse } from "./response.js";
import { FileData, FileItems, PostOptions, TransferMethod } from "./types.js";
import { getHeaderField } from "./utils/multipart.js";

const INITIAL_RETRY_DELAY = 0.5;
const MAX_RETRY_DELAY = 8.0;
const RETRYABLE_HTTP_CODES = new Set([500, 502, 503, 504]);

const delay = async (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

type RequestOptions = {
  body?: AsyncIterable<Uint8Array> | Buffer | FormData | string;
  headers?: Record<string, string | null>;
  method: "GET" | "POST" | "PUT";
  url: URL;

  /**
   * The maximum number of times that the client will retry a request in case of
   * a temporary failure.
   *
   * @default 3
   */
  maxRetries?: number;
};

interface Request extends Object {
  config_id?: string;
  transfer_method?: TransferMethod;
}

export class PangeaRequest {
  private serviceName: string;
  private token: string;
  private config: PangeaConfig;
  private extraHeaders: Record<string, string>;
  private configID?: string;
  private userAgent: string = "";

  constructor(
    serviceName: string,
    token: string,
    config: PangeaConfig,
    configID?: string
  ) {
    if (!serviceName) {
      throw new Error("A serviceName is required");
    }
    if (!token) {
      throw new Error("A token is required");
    }

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

    let response: Response | PangeaResponse<R>;
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
        body: JSON.stringify(data),
        maxRetries: this.config.requestRetries,
        responseType,
        url,
      };
      response = await this.httpPost(request);
    }

    return this.handleHttpResponse(response, options);
  }

  private getFilenameFromContentDisposition(
    contentDispositionHeader: string | string[] | null
  ): string | null {
    if (contentDispositionHeader === null) {
      return null;
    }

    const contentDisposition = Array.isArray(contentDispositionHeader)
      ? (contentDispositionHeader[0] ?? "")
      : contentDispositionHeader;

    return getHeaderField(contentDisposition, "filename", null);
  }

  private getFilenameFromURL(url: URL): string | undefined {
    return url.pathname.split("/").pop();
  }

  public async downloadFile(url: URL): Promise<AttachedFile> {
    const response = await this.httpRequest({
      method: "GET",
      maxRetries: this.config.requestRetries,
      url,
    });

    const filename =
      this.getFilenameFromContentDisposition(
        response.headers.get("Content-Disposition")
      ) ??
      this.getFilenameFromURL(url) ??
      "default_filename";

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
    for (const [name, fileData] of Object.entries(files)) {
      form.append(name, await this.getFileToForm(fileData.file));
    }

    const encoder = new FormDataEncoder(form);

    const request = {
      headers: encoder.headers,
      body: encoder.encode(),
      maxRetries: this.config.requestRetries,
      url,
    };

    return await this.httpPost(request);
  }

  private async getFileToForm(
    file: Blob | Buffer | string
  ): Promise<Blob | File> {
    if (typeof file === "string") {
      return await fileFromPath(file, "file");
    }
    if (Buffer.isBuffer(file)) {
      return new Blob([file]);
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
  ): Promise<PangeaResponse<any>> {
    const response = await this.requestPresignedURL(endpoint, data);
    if (response.success && response.gotResponse) {
      return response;
    }

    if (!response.gotResponse || !response.accepted_result?.post_url) {
      throw new PangeaErrors.PangeaError(
        "Failed to request post presigned URL"
      );
    }

    const presigned_url = response.accepted_result.post_url;
    const file_details = response.accepted_result?.post_form_data;

    this.postPresignedURL(new URL(presigned_url), {
      file: fileData.file,
      file_details,
      name: "file",
    });
    return response;
  }

  public async postPresignedURL(url: URL, fileData: FileData): Promise<void> {
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

    // Right now, only accept the file with name "file"
    form.append("file", await this.getFileToForm(fileData.file), "file");

    const response = await this.httpPost({
      body: form,
      headers: {
        Authorization: null,
        "Content-Type": null,
      },
      maxRetries: this.config.requestRetries,
      url,
    });
    if (!response.ok) {
      throw new PangeaErrors.PresignedUploadError(
        `presigned POST failure: ${response.status}`,
        await response.text()
      );
    }
  }

  public async putPresignedURL(url: URL, fileData: FileData): Promise<void> {
    if (fileData.file_details) {
      throw new PangeaErrors.PangeaError(
        "file_details should be undefined to do a put"
      );
    }

    const response = await this.httpRequest({
      method: "PUT",
      body: this.getFileToBuffer(fileData.file),
      headers: {
        Authorization: null,
        "Content-Type": "application/octet-stream",
      },
      maxRetries: this.config.requestRetries,
      url,
    });
    if (!response.ok) {
      throw new PangeaErrors.PresignedUploadError(
        `presigned PUT failure: ${response.status}`,
        await response.text()
      );
    }

    return;
  }

  public async requestPresignedURL(
    endpoint: string,
    data: Request
  ): Promise<PangeaResponse<any>> {
    let acceptedError: PangeaErrors.AcceptedRequestException;
    if (!data.transfer_method) {
      data.transfer_method = TransferMethod.PUT_URL;
    }

    try {
      return await this.post(endpoint, data, {
        pollResultSync: false,
      });
    } catch (error) {
      if (error instanceof PangeaErrors.AcceptedRequestException) {
        acceptedError = error;
      } else {
        throw error;
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
    let loopError: Error = new RangeError("Loop error");

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
        if (error instanceof PangeaErrors.AcceptedRequestException) {
          loopError = error;
          loopResponse = error.pangeaResponse;
        } else {
          throw error;
        }
      }
    }

    if (
      loopResponse.accepted_result?.post_url ||
      loopResponse.accepted_result?.put_url
    ) {
      return loopResponse;
    }
    throw loopError;
  }

  /** Wrapper around `fetch()` POST with got-like options. */
  private async httpPost(
    options: Omit<RequestOptions, "method">
  ): Promise<Response> {
    const response = await this.httpRequest({
      method: "POST",
      body: options.body,
      headers: options.headers,
      url: options.url,
    });

    if (response?.ok) {
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
    options: RequestOptions,
    retriesRemaining: number | null = null,
    retryOfRequestIds: Set<string> = new Set()
  ): Promise<Response> {
    const maxRetries = options.maxRetries ?? 3;
    if (retriesRemaining === null) {
      retriesRemaining = maxRetries;
    }

    const fetchOptions: RequestInit = {
      duplex: "half",
      method: options.method,
      // @ts-expect-error difference in `FormData` types between undici-types
      // and formdata-node.
      body: options.body,
      headers: this.getHeaders({ options, retryOfRequestIds }),
    };

    const response = await fetch(options.url, fetchOptions);

    if (!response.ok) {
      // Include GET HTTP/404 for retries because the existing result-polling
      // code depends on that.
      const shouldRetry =
        (fetchOptions.method === "GET" && response.status === 404) ||
        (fetchOptions.method === "POST" &&
          RETRYABLE_HTTP_CODES.has(response.status));
      if (retriesRemaining && shouldRetry) {
        const requestId = response.headers.get("x-request-id");
        if (requestId) {
          retryOfRequestIds.add(requestId);
        }
        return this.retryRequest(options, retriesRemaining, retryOfRequestIds);
      }
    }

    return response;
  }

  private async retryRequest(
    options: RequestOptions,
    retriesRemaining: number,
    retryOfRequestIds: Set<string>
  ) {
    const maxRetries = options.maxRetries ?? 3;
    const timeoutMs = this.calculateDefaultRetryTimeoutMs(
      retriesRemaining,
      maxRetries
    );
    await delay(timeoutMs);
    return this.httpRequest(options, retriesRemaining - 1, retryOfRequestIds);
  }

  private calculateDefaultRetryTimeoutMs(
    retriesRemaining: number,
    maxRetries: number
  ): number {
    const numRetries = maxRetries - retriesRemaining;
    const sleepSeconds = Math.min(
      INITIAL_RETRY_DELAY * 2 ** numRetries,
      MAX_RETRY_DELAY
    );
    const jitter = 1 - Math.random() * 0.25;
    return sleepSeconds * jitter * 1000;
  }

  private async handleHttpResponse<R>(
    response: Response | PangeaResponse<R>,
    options: PostOptions = {}
  ): Promise<PangeaResponse<R>> {
    let pangeaResponse =
      response instanceof PangeaResponse
        ? response
        : new PangeaResponse<R>(response, await response.arrayBuffer());
    if (
      pangeaResponse.status === "Accepted" &&
      options.pollResultSync !== false
    ) {
      pangeaResponse = await this.handleAsync(pangeaResponse);
    }
    return this.checkResponse(pangeaResponse);
  }

  public async get<T>(
    endpoint: string,
    checkResponse: boolean = true
  ): Promise<PangeaResponse<T>> {
    const url = this.getUrl(endpoint);
    const response = await this.httpRequest({
      method: "GET",
      maxRetries: this.config.requestRetries,
      url,
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

  public async pollResult<R>(
    requestId: string,
    checkResponse: boolean = true
  ): Promise<PangeaResponse<R>> {
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

  public setExtraHeaders(headers: Record<string, string>): void {
    this.extraHeaders = { ...headers };
  }

  public setCustomUserAgent(customUserAgent: string | undefined): any {
    this.config.customUserAgent = customUserAgent;
    this.userAgent = `pangea-node/${version}`;
    if (this.config.customUserAgent) {
      this.userAgent += ` ${this.config.customUserAgent}`;
    }
  }

  public getUrl(path: string): URL {
    return new URL(
      urlJoin(
        this.config.baseUrlTemplate.replace("{SERVICE_NAME}", this.serviceName),
        path
      )
    );
  }

  private getHeaders({
    options,
    retryOfRequestIds,
  }: {
    options: RequestOptions;
    retryOfRequestIds: Set<string>;
  }): Headers {
    const headers = options.headers ?? {};

    const pangeaHeaders: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      "User-Agent": this.userAgent,
    };
    if (retryOfRequestIds.size) {
      pangeaHeaders["X-Pangea-Retried-Request-Ids"] =
        Array.from(retryOfRequestIds).join(",");
    }

    const combinedHeaders = {
      ...this.extraHeaders,
      ...pangeaHeaders,
      ...headers,
    };

    // Dedupe headers and remove any with null values.
    const seenHeaders = new Set<string>();
    const resultHeaders = new Headers();
    for (const [name, value] of Object.entries(combinedHeaders)) {
      const lowerName = name.toLowerCase();
      if (!seenHeaders.has(lowerName)) {
        seenHeaders.add(lowerName);
        resultHeaders.delete(name);
      }

      if (value === null) {
        resultHeaders.delete(name);
      } else {
        resultHeaders.append(name, value);
      }
    }

    return resultHeaders;
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
        throw new PangeaErrors.RateLimitError(response.summary, response);
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
