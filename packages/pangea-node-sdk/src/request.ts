import got, { Options, HTTPError } from "got";
import type { Headers, Response } from "got";
import FormData from "form-data";
import fs from "fs";
import { PostOptions } from "./types.js";

import PangeaConfig, { version } from "./config.js";
import { ConfigEnv } from "./types.js";
import { PangeaErrors } from "./errors.js";
import { PangeaResponse, ResponseObject } from "./response.js";

const delay = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

interface Request extends Object {
  config_id?: string;
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

  async post(
    endpoint: string,
    data: Request,
    options: PostOptions = {}
  ): Promise<PangeaResponse<any>> {
    const url = this.getUrl(endpoint);
    this.checkConfigID(data);
    const request = new Options({
      headers: this.getHeaders(),
      json: data,
      retry: { limit: this.config.requestRetries },
      responseType: "json",
    });

    return await this.doPost(url, request, options);
  }

  async postMultipart(
    endpoint: string,
    data: Request,
    filepath: string,
    options: PostOptions = {}
  ): Promise<PangeaResponse<any>> {
    const url = this.getUrl(endpoint);
    const form = new FormData();
    this.checkConfigID(data);

    form.append("request", JSON.stringify(data), { contentType: "application/json" });
    form.append("upload", fs.createReadStream(filepath), {
      contentType: "application/octet-stream",
    });

    const request = new Options({
      headers: this.getHeaders(),
      body: form,
      retry: { limit: this.config.requestRetries },
      responseType: "json",
    });

    return await this.doPost(url, request, options);
  }

  private async doPost(
    url: string,
    request: object,
    options: PostOptions = {}
  ): Promise<PangeaResponse<any>> {
    try {
      const apiCall = (await got.post(url, request)) as Response;

      let pangeaResponse = new PangeaResponse(apiCall);
      if (pangeaResponse.gotResponse?.statusCode === 202 && this.config.queuedRetryEnabled) {
        if (options.pollResultSync) {
          pangeaResponse = await this.handleAsync(pangeaResponse);
        }

        return this.checkResponse(pangeaResponse);
      }
      return this.checkResponse(pangeaResponse);
    } catch (error) {
      if (error instanceof HTTPError) {
        // This MUST throw and error
        return this.checkResponse(new PangeaResponse(error.response));
      }
      // TODO: add handling of lower level errors?
      throw error;
    }
  }

  async get(endpoint: string, checkResponse: boolean = true): Promise<PangeaResponse<any>> {
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

  async pollResult(requestId: string, checkResponse: boolean = true): Promise<PangeaResponse<any>> {
    const path = `request/${requestId}`;
    // eslint-disable-next-line no-await-in-loop
    return await this.get(path, checkResponse);
  }

  async handleAsync(pangeaResponse: PangeaResponse<any>): Promise<PangeaResponse<any>> {
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

  setExtraHeaders(headers: any): any {
    this.extraHeaders = { ...headers };
  }

  setCustomUserAgent(customUserAgent: string | undefined): any {
    this.config.customUserAgent = customUserAgent;
    this.userAgent = `pangea-node/${version}`;
    if (this.config.customUserAgent) {
      this.userAgent += ` ${this.config.customUserAgent}`;
    }
  }

  getUrl(path: string): string {
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

  getHeaders(): Headers {
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

  private checkResponse(response: PangeaResponse<any>) {
    if (response.success) {
      return response;
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
