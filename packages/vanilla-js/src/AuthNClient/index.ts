import { ClientConfig, APIResponse, ClientResponse } from "../types";
import { delay } from "@src/utils";

const API_VERSION = "v2";

export class AuthNClient {
  config: ClientConfig;

  constructor(config: ClientConfig, useJwt: boolean = false) {
    if (!config.clientToken) throw new Error("A token is required");
    if (!config.domain) throw new Error("A domain is required");

    if (!config.callbackUri && typeof window !== "undefined") {
      config.callbackUri = window.location.origin;
    }

    this.config = {
      ...config,
    };
  }

  /**
    General AuthN functions
  */

  /** Logs out the user for a given token */
  async logout(userToken: string): Promise<ClientResponse> {
    const path = "client/session/logout";
    const data = { token: userToken };

    return await this.post(path, data);
  }

  /** Validate a user token */
  async validate(userToken: string): Promise<ClientResponse> {
    const path = "client/token/check";
    const payload = { token: userToken };

    return await this.post(path, payload);
  }

  /** Exchange a code for active and session tokens */
  async userinfo(code: string): Promise<ClientResponse> {
    const path = "client/userinfo";
    const payload = { code: code };

    return await this.post(path, payload);
  }

  /** Refresh a user token */
  async refresh(
    userToken: string,
    refreshToken: string
  ): Promise<ClientResponse> {
    const path = "client/session/refresh";
    const payload = { user_token: userToken, refresh_token: refreshToken };
    return await this.post(path, payload);
  }

  /** Fetch public JWKS information  */
  async jwks(): Promise<ClientResponse> {
    const path = "client/jwks";
    return await this.post(path, {});
  }

  /**
    API Request functions
  */

  /**
   * Performs a POST request to an AuthN endpoint
   *
   * @param endpoint the partial path of the API call
   * @param payload a JSON data object
   * @returns a promise that will return a `ClientResponse`
   * */
  async post(endpoint: string, payload: any): Promise<ClientResponse> {
    try {
      let response: any = await fetch(this.getUrl(endpoint), {
        method: "POST",
        body: JSON.stringify(payload),
        ...this.getOptions(),
      });

      if (response.status === 202) {
        response = await this.handleAsync(response);
      }

      const json = await response.json();
      const success = json.status === "Success";

      return { success, response: json };
    } catch (err) {
      return { success: false, response: this.getError(err) };
    }
  }

  /**
   * Performs a GET request to an AuthN endpoint, used only for handling async requests
   *
   * @param endpoint the partial path of the API call
   * @returns a Promise that will return a Response
   * */
  async get(endpoint: string): Promise<Response> {
    try {
      const response: any = await fetch(this.getUrl(endpoint, undefined), {
        method: "GET",
        ...this.getOptions(),
      });

      return response;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Handle async retries
   *
   * @param response a Response from a previous call that returned a 202
   * @returns a  Promise that will return a Response
   * */
  async handleAsync(response: Response): Promise<Response> {
    const data = await response.json();
    const endpoint = `request/${data?.request_id}`;
    const maxRetries = 3;
    let retryCount = 1;

    while (response.status === 202 && retryCount <= maxRetries) {
      retryCount += 1;
      const waitTime = retryCount * retryCount * 1000;

      // eslint-disable-next-line no-await-in-loop
      await delay(waitTime);
      response = await this.get(endpoint);
    }

    return response;
  }

  /**
   * Construct the URL to an AuthN service endpoint
   *
   * @param endpoint the partial path of the API call
   * @param version (optional) an API version number, defaults to an empty string
   * @returns a full URL to an API endpoint
   * */
  getUrl(endpoint: string, version: string = ""): string {
    const protocol = this.config.domain.match(/^local\.?host(:\d{2,5})?$/)
      ? "http"
      : "https";

    let version_ = `${API_VERSION}/`;
    if (version) {
      version_ = `${version}/`;
    } else if (version === undefined) {
      version_ = "";
    }

    return `${protocol}://authn.${this.config.domain}/${version_}${endpoint}`;
  }

  /**
   * Get HTTP request headers
   *
   * @returns an object containing Content-type and Authorization headers
   * */
  getOptions(): any {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.clientToken}`,
      },
    };

    return options;
  }

  /**
   * Return a formatted error message
   *
   * @param error an error object
   * @returns an APIResponse object containing the error message
   * */
  getError(error: any): APIResponse {
    const message = {
      status: "Error",
      summary: "",
      result: {},
    };

    message.summary = error.message;
    message.result = error.cause;

    return message;
  }
}
