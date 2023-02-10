import axios, { AxiosResponse } from "axios";

import { AuthNConfig, APIResponse } from "@src/types";

interface ClientResponse {
  success: boolean;
  response: APIResponse;
}

const API_VERSION = "v1";

class AuthNClient {
  config: AuthNConfig;

  constructor(config: AuthNConfig) {
    if (!config.token) throw new Error("A token is required");
    if (!config.domain) throw new Error("A domain is required");

    if (!config.callbackUri) config.callbackUri = window.location.origin;

    this.config = {
      ...config,
    };
  }

  /*
    General AuthN functions
  */

  async logout(userToken: string): Promise<ClientResponse> {
    const path = "client/session/logout";
    const data = { token: userToken };

    return await this.post(path, data);
  }

  async validate(userToken: string): Promise<ClientResponse> {
    const path = "client/token/check";
    const payload = { token: userToken };

    return await this.post(path, payload);
  }

  async userinfo(code: string): Promise<ClientResponse> {
    const path = "client/userinfo";
    const payload = { code: code };

    return await this.post(path, payload);
  }

  /*
    API Request functions
  */
  async post(endpoint: string, payload: any): Promise<ClientResponse> {
    try {
      const response: AxiosResponse = await axios.post(
        this.getUrl(endpoint),
        payload,
        this.getOptions()
      );
      const success = response.data?.status === "Success";

      return { success, response: response.data };
    } catch (err) {
      return { success: false, response: this.getError(err) };
    }
  }

  getUrl(endpoint: string): string {
    return `https://authn.${this.config.domain}/${API_VERSION}/${endpoint}`;
  }

  getOptions(): any {
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.token}`,
      },
    };

    return options;
  }

  getError(error: any): APIResponse {
    const message = {
      status: "Error",
      summary: "",
      result: {},
    };

    if (axios.isAxiosError(error) && error.response) {
      message.status = error.response.data.status;
      message.summary = error.response.data.summary;
      message.result = error.response.data.result;
    } else if (error.request) {
      message.summary = `${error.request.status} ${error.request.statusText}`;
      message.result = error.reqest;
    } else {
      message.summary = "Unhandled error";
      message.result = error;
      console.log("Unhandled error", error);
    }

    return message;
  }
}

export default AuthNClient;
