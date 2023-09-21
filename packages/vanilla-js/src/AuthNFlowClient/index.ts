import axios, { AxiosResponse } from "axios";
import cloneDeep from "lodash/cloneDeep";

import AuthNClient from "../AuthNClient";

import { APIResponse, ClientConfig, ClientResponse } from "../types";

import {
  AuthNFlowOptions,
  FlowEndpoint,
  FlowData,
  FlowStartRequest,
  FlowParamsRequest,
  FlowBaseRequest,
  StartParams,
  SocialParams,
  PasswordParams,
  CaptchaParams,
  EmailOtpParams,
  SmsOtpParams,
  TotpParams,
  AgreementsParams,
  EmailParams,
  FlowChoice,
  FlowResult,
  ChoiceResponse,
  SocialResponse,
  AgreementData,
  MagiclinkParams,
  ProfileParams,
} from "./types";

const DEFAULT_FLOW_OPTIONS = {
  signin: true,
  signup: true,
};

const DEFAULT_FLOW_DATA: FlowData = {
  flow_id: "",
  flow_type: [],
  phase: "",
  email: "",
  flow_choices: [],
  auth_choices: [],
  social_choices: [],
  agreements: [],
  choice_map: {},
};

const API_FLOW_BASE = "flow";

export class AuthNFlowClient extends AuthNClient {
  state: FlowData;
  options: AuthNFlowOptions;
  error: APIResponse | null;

  constructor(config: ClientConfig, options?: AuthNFlowOptions) {
    super(config);

    this.options = {
      ...DEFAULT_FLOW_OPTIONS,
      ...options,
    };

    this.state = {
      ...DEFAULT_FLOW_DATA,
    };

    this.error = null;
  }

  initState(flowState: Partial<FlowData>) {
    this.state = {
      ...this.state,
      ...flowState,
    };
  }

  /*
    AuthN Flow state start and complete functions
  */

  async start(data?: StartParams): Promise<ClientResponse> {
    const path = `${API_FLOW_BASE}/${FlowEndpoint.START}`;
    const flowTypes = [];

    if (this.options.signup) {
      flowTypes.push("signup");
    }
    if (this.options.signin) {
      flowTypes.push("signin");
    }

    const payload: FlowStartRequest = {
      cb_uri: this.config.callbackUri || "",
      flow_types: flowTypes,
    };

    if (data?.email) {
      payload.email = data.email;
    }

    return await this.post(path, payload);
  }

  async restart(): Promise<ClientResponse> {
    const path = `${API_FLOW_BASE}/${FlowEndpoint.RESTART}`;
    const payload: FlowBaseRequest = {
      flow_id: this.state.flow_id,
    };

    return await this.post(path, payload);
  }

  async complete(): Promise<ClientResponse> {
    const path = `${API_FLOW_BASE}/${FlowEndpoint.COMPLETE}`;
    const payload: FlowBaseRequest = {
      flow_id: this.state.flow_id,
    };

    return await this.post(path, payload);
  }

  /*
    AuthN Flow general update function and specific state wrappers
  */

  async update(
    choice: FlowChoice,
    data: ChoiceResponse
  ): Promise<ClientResponse> {
    const path = `${API_FLOW_BASE}/${FlowEndpoint.UPDATE}`;

    const payload: FlowParamsRequest = {
      flow_id: this.state.flow_id,
      choice: choice,
      data: data,
    };

    return await this.post(path, payload);
  }

  // get the state of a flow_id
  async getFlowState(): Promise<ClientResponse> {
    return await this.update(FlowChoice.GET_STATUS, {});
  }

  // set the email associated with a flow_id
  async setEmail(data: EmailParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.SET_EMAIL, data);
  }

  async verifyEmail(data: MagiclinkParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.VERIFY_EMAIL, data);
  }

  async verifySocial(data: SocialParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.VERIFY_SOCIAL, data);
  }

  async verifyPassword(data: PasswordParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.VERIFY_PASSWORD, data);
  }

  async setPassword(data: PasswordParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.SET_PASSWORD, data);
  }

  async resetPassword(): Promise<ClientResponse> {
    return await this.update(FlowChoice.RESET_PASSWORD, {});
  }

  async verifyCaptcha(data: CaptchaParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.VERIFY_CAPTCHA, data);
  }

  async emailOtp(data: EmailOtpParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.EMAIL_OTP, data);
  }

  async smsOtp(data: SmsOtpParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.SMS_OTP, data);
  }

  async totp(data: TotpParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.TOTP, data);
  }

  async magiclink(data: MagiclinkParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.MAGICLINK, data);
  }

  async acceptAgreement(data: AgreementsParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.ACCEPT_AGREEMENT, data);
  }

  async updateProfile(data: ProfileParams): Promise<ClientResponse> {
    return await this.update(FlowChoice.UPDATE_PROFILE, data);
  }

  // reset state to default
  async reset() {
    return await this.restart();
  }

  /*
    API Request functions
  */
  async post(endpoint: string, payload: any): Promise<ClientResponse> {
    try {
      let response: AxiosResponse = await axios.post(
        this.getUrl(endpoint),
        payload,
        this.getOptions()
      );

      if (response.status === 202) {
        response = await this.handleAsync(response);
      }

      const success = this.processResponse(response.data);

      return { success, response: response.data };
    } catch (err) {
      return { success: false, response: this.getError(err) };
    }
  }

  processResponse(response: APIResponse): boolean {
    let success = response.status === "Success";

    // update state data if call was sucessful and updateState is true
    if (success) {
      this.state = cloneDeep(response.result);

      // initial parsed data variables
      this.state.auth_choices = [];
      this.state.social_choices = [];
      this.state.agreements = [];
      this.state.choice_map = {};

      // parse flow_choices into groups and choice_map
      response.result?.flow_choices?.forEach((choice: FlowResult) => {
        switch (choice.choice) {
          case "social":
            const socialData = choice.data as SocialResponse;
            this.state.social_choices.push(socialData);
            this.state.choice_map[
              `${choice.choice}_${socialData.social_provider}`
            ] = socialData;
            break;
          case "password":
          case "email_otp":
          case "sms_otp":
          case "totp":
          case "magiclink":
            this.state.auth_choices.push(choice.choice);
            this.state.choice_map[choice.choice] = choice.data;
            break;
          case "agreements":
            this.state.agreements.push(choice.data as AgreementData);
            break;
          case "set_email":
          case "set_password":
          case "captcha":
          case "profile":
          case "reset_password":
          case "verify_email":
            this.state.choice_map[choice.choice] = choice.data;
            break;
        }
      });
      this.error = null;
    } else {
      this.error = response;
    }

    return success;
  }
}

export default AuthNFlowClient;
