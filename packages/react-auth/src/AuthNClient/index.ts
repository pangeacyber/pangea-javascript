import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { AuthConfig, APIResponse, ClientResponse } from "~/src/types";

const API_VERSION = "v2";

export class AuthNClient {
  config: AuthConfig;

  // @ts-expect-error TODO: is `useJwt` supposed to be used here?
  constructor(config: AuthConfig, useJwt: boolean = false) {
    if (!config.clientToken) throw new Error("A token is required");
    if (!config.domain) throw new Error("A domain is required");

    if (!config.callbackUri && typeof window !== "undefined") {
      config.callbackUri = window.location.origin;
    }

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

  async refresh(
    userToken: string,
    refreshToken: string
  ): Promise<ClientResponse> {
    const path = "client/session/refresh";
    const payload = { user_token: userToken, refresh_token: refreshToken };
    return await this.post(path, payload);
  }

  async jwks(): Promise<ClientResponse> {
    const path = "client/jwks";
    return await this.post(path, {});
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
    const protocol = this.config.domain.match(/^local\.?host(:\d{2,5})?$/)
      ? "http"
      : "https";
    return `${protocol}://authn.${this.config.domain}/${API_VERSION}/${endpoint}`;
  }

  getOptions(): AxiosRequestConfig<unknown> {
    return {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "pangea-react-auth/PACKAGE_VERSION",
        Authorization: `Bearer ${this.config.clientToken}`,
      },
    };
  }

  getError(error: any): APIResponse {
    const message = {
      status: "Error",
      summary: "",
      result: {},
    };

    if (axios.isAxiosError(error) && error.response) {
      const response = error.response as AxiosResponse;
      message.status = response?.data?.status;
      message.summary = response?.data?.summary;
      message.result = response?.data?.result;
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
