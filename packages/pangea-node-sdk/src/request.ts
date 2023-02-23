import got, { Options, HTTPError } from "got";
import type { Headers, Response } from "got";

import PangeaConfig, { version } from "./config.js";
import { PangeaErrors } from "./errors.js";
import { PangeaResponse, ResponseObject } from "./response.js";

const delay = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

class PangeaRequest {
  serviceName: string;
  token: string;
  config: PangeaConfig;
  extraHeaders: Object;
  customUserAgent: string;

  constructor(serviceName: string, token: string, config: PangeaConfig) {
    if (!serviceName) throw new Error("A serviceName is required");
    if (!token) throw new Error("A token is required");

    this.serviceName = serviceName;
    this.token = token;
    this.config = config;
    this.extraHeaders = {};
    this.customUserAgent = "";
  }

  async post(endpoint: string, data: object): Promise<PangeaResponse<any>> {
    const url = this.getUrl(endpoint);
    const options: Options = {
      headers: this.getHeaders(),
      json: data,
      retry: { limit: this.config.requestRetries },
      responseType: "json",
    };

    try {
      const apiCall = (await got.post(url, options)) as Response;

      if (apiCall.statusCode === 202 && this.config.queuedRetryEnabled) {
        const body = apiCall.body as ResponseObject<any>;
        const request_id = body?.request_id;
        const response = await this.handleAsync(request_id);
        return this.checkResponse(response);
      }
      return this.checkResponse(new PangeaResponse(apiCall));
    } catch (error) {
      if (error instanceof HTTPError) {
        // This MUST throw and error
        return this.checkResponse(new PangeaResponse(error.response));
      }
      // TODO: add handling of lower level errors?
      throw error;
    }
  }

  async get(endpoint: string, path: string): Promise<PangeaResponse<any>> {
    const fullPath = !path ? endpoint : `${endpoint}/${path}`;
    const url = this.getUrl(fullPath);
    const options: Options = {
      headers: this.getHeaders(),
      retry: { limit: this.config.requestRetries },
      responseType: "json",
    };

    try {
      const response = (await got.get(url, options)) as Response;
      return this.checkResponse(new PangeaResponse(response));
    } catch (error) {
      if (error instanceof HTTPError) {
        // This MUST throw and error
        return this.checkResponse(new PangeaResponse(error.response));
      }
      // TODO: add handling of lower level errors?
      throw error;
    }
  }

  async handleAsync(requestId: string): Promise<PangeaResponse<any>> {
    let retryCount = 0;

    while (retryCount < this.config.queuedRetries) {
      retryCount += 1;
      const waitTime = retryCount * retryCount * 500;

      // eslint-disable-next-line no-await-in-loop
      await delay(waitTime);
      // eslint-disable-next-line no-await-in-loop
      const response = await this.get("request", requestId);

      if (!(response.gotResponse?.statusCode === 202 && retryCount < this.config.queuedRetries)) {
        return response;
      }
    }

    console.log("This should never be reached. But it did.");
    // this should never be reached     // FIXME: Why not?
    // @ts-ignore
    return response;
  }

  setExtraHeaders(headers: any): any {
    this.extraHeaders = { ...headers };
  }

  setCustomUserAgent(userAgent: string): any {
    this.customUserAgent = userAgent;
  }

  getUrl(path: string): string {
    let url;
    if (this.config?.environment == "local") {
      url = `https://${this.config.domain}/${path}`;
    } else {
      url = `https://${this.serviceName}.${this.config.domain}/${path}`;
    }
    return url;
  }

  getHeaders(): Headers {
    const headers = {};
    const pangeaHeaders = {
      "Content-Type": "application/json",
      "User-Agent": `pangea-node/${version} ${this.customUserAgent}`,
      Authorization: `Bearer ${this.token}`,
    };

    if (Object.keys(this.extraHeaders).length > 0) {
      Object.assign(headers, this.extraHeaders);
    }
    // We want to overwrite extraHeaders if user set some of pangea headers values.
    Object.assign(headers, pangeaHeaders);
    return headers;
  }

  checkResponse(response: PangeaResponse<any>) {
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
      default:
        throw new PangeaErrors.APIError(response.status, response);
    }
  }
}

export default PangeaRequest;
