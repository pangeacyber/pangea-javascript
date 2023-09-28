import axios, { AxiosResponse } from "axios";
import cloneDeep from "lodash/cloneDeep";

import AuthNClient from "../AuthNClient";

import { APIResponse, ClientConfig, ClientResponse } from "../types";

import { AuthNFlowOptions, AuthFlow } from "./types";

const DEFAULT_FLOW_OPTIONS = {
  signin: true,
  signup: true,
};

const DEFAULT_FLOW_DATA: AuthFlow.StateData = {
  flowId: "",
  flowType: [],
  phase: "",
  email: "",
  flowChoices: [],
  authChoices: [],
  socialChoices: [],
  socialProviderMap: {},
  socialStateMap: {},
  agreements: [],
};

const API_FLOW_BASE = "flow";

export class AuthNFlowClient extends AuthNClient {
  state: AuthFlow.StateData;
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

  initState(flowState: Partial<AuthFlow.StateData>) {
    this.state = {
      ...this.state,
      ...flowState,
    };
  }

  /*
    AuthN Flow state start and complete functions
  */

  async start(data?: AuthFlow.StartParams): Promise<ClientResponse> {
    const path = `${API_FLOW_BASE}/${AuthFlow.Endpoint.START}`;
    const flowTypes = [];

    if (this.options.signup) {
      flowTypes.push("signup");
    }
    if (this.options.signin) {
      flowTypes.push("signin");
    }

    const payload: AuthFlow.StartRequest = {
      cb_uri: this.config.callbackUri || "",
      flow_types: flowTypes,
    };

    if (data?.email) {
      payload.email = data.email;
    }

    return await this.post(path, payload);
  }

  async restart(
    choice: AuthFlow.RestartChoice,
    data?: AuthFlow.SmsOtpRestart
  ): Promise<ClientResponse> {
    const path = `${API_FLOW_BASE}/${AuthFlow.Endpoint.RESTART}`;
    const payload: AuthFlow.RestartRequest = {
      flow_id: this.state.flowId,
      choice: choice,
      data: data || {},
    };

    return await this.post(path, payload);
  }

  async complete(): Promise<ClientResponse> {
    const path = `${API_FLOW_BASE}/${AuthFlow.Endpoint.COMPLETE}`;
    const payload: AuthFlow.CompleteRequest = {
      flow_id: this.state.flowId,
    };

    return await this.post(path, payload);
  }

  /*
    AuthN Flow choice update functions
  */

  // get the state of a flow_id
  async getFlowState(): Promise<ClientResponse> {
    const payload: AuthFlow.StatusRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.NONE,
      data: {},
    };
    return await this._update(payload);
  }

  // set the email associated with a flow_id
  async setEmail(data: AuthFlow.EmailParams): Promise<ClientResponse> {
    const payload: AuthFlow.SetEmailRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SET_EMAIL,
      data: data,
    };

    return await this._update(payload);
  }

  async verifyEmail(): Promise<ClientResponse> {
    const payload: AuthFlow.VerifyEmailRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.VERIFY_EMAIL,
      data: {},
    };

    return await this._update(payload);
  }

  async verifySocial(data: AuthFlow.SocialParams): Promise<ClientResponse> {
    const payload: AuthFlow.SocialRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SOCIAL,
      data: data,
    };

    return await this._update(payload);
  }

  async verifyPassword(data: AuthFlow.PasswordParams): Promise<ClientResponse> {
    const payload: AuthFlow.PasswordRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.PASSWORD,
      data: data,
    };

    return await this._update(payload);
  }

  async setPassword(data: AuthFlow.PasswordParams): Promise<ClientResponse> {
    const payload: AuthFlow.SetPasswordRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SET_PASSWORD,
      data: data,
    };

    return await this._update(payload);
  }

  async resetPassword(): Promise<ClientResponse> {
    const payload: AuthFlow.ResetPasswordRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.RESET_PASSWORD,
      data: {},
    };

    return await this._update(payload);
  }

  async verifyCaptcha(data: AuthFlow.CaptchaParams): Promise<ClientResponse> {
    const payload: AuthFlow.CaptchaRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.CAPTCHA,
      data: data,
    };

    return await this._update(payload);
  }

  async emailOtp(data: AuthFlow.EmailOtpParams): Promise<ClientResponse> {
    const payload: AuthFlow.EmailOtpRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.EMAIL_OTP,
      data: data,
    };

    return await this._update(payload);
  }

  async smsOtp(data: AuthFlow.SmsOtpParams): Promise<ClientResponse> {
    const payload: AuthFlow.SmsOtpRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SMS_OTP,
      data: data,
    };

    return await this._update(payload);
  }

  async totp(data: AuthFlow.TotpParams): Promise<ClientResponse> {
    const payload: AuthFlow.TotpRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.TOTP,
      data: data,
    };

    return await this._update(payload);
  }

  async magiclink(data: AuthFlow.MagiclinkParams): Promise<ClientResponse> {
    const payload: AuthFlow.MagiclinkRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.MAGICLINK,
      data: data,
    };

    return await this._update(payload);
  }

  async acceptAgreement(
    data: AuthFlow.AgreementsParams
  ): Promise<ClientResponse> {
    const payload: AuthFlow.AgreementsRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.AGREEMENTS,
      data: data,
    };

    return await this._update(payload);
  }

  async updateProfile(data: AuthFlow.ProfileParams): Promise<ClientResponse> {
    const payload: AuthFlow.ProfileRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.PROFILE,
      data: data,
    };

    return await this._update(payload);
  }

  // reset state to default
  reset() {
    this.state = {
      ...DEFAULT_FLOW_DATA,
    };
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

  // post wrapper for update calls
  async _update(payload: any): Promise<ClientResponse> {
    const path = this.getUpdatePath();

    return await this.post(path, payload);
  }

  getUpdatePath(): string {
    return `${API_FLOW_BASE}/${AuthFlow.Endpoint.UPDATE}`;
  }

  processResponse(response: APIResponse): boolean {
    let success = response.status === "Success";

    // update state data if call was sucessful and updateState is true
    if (success) {
      const result = response.result || {};

      if (result.flow_phase === "phase_completed") {
        this.state.complete = true;
      }

      // reset state to default
      this.state = { ...DEFAULT_FLOW_DATA };

      this.state.flowId = result.flow_id || "";
      this.state.flowType = result.flow_type ? [...result.flow_type] : [];
      this.state.flowChoices = cloneDeep(response.result.flow_choices);
      this.state.phase = result.flow_phase;

      if (result.email) {
        this.state.email = result.email;
      }

      // initial parsed data variables
      this.state.authChoices = [];
      this.state.socialChoices = [];
      this.state.socialProviderMap = {};
      this.state.socialStateMap = {};
      this.state.agreements = [];

      if (result.disclaimer) {
        this.state.disclaimer = result.disclaimer;
      }

      // parse flow_choices into groups and choice_map
      response.result?.flow_choices?.forEach((choice: AuthFlow.Result) => {
        switch (choice.choice) {
          case AuthFlow.Choice.SOCIAL:
            const socialData = choice.data;
            this.state.socialChoices.push(socialData);
            this.state.socialProviderMap[socialData.social_provider] =
              socialData;
            break;
          case AuthFlow.Choice.PASSWORD:
            this.state.password = choice.data;
            this.state.authChoices.push(choice.choice);
            break;
          case AuthFlow.Choice.EMAIL_OTP:
            this.state.emailOtp = choice.data;
            this.state.authChoices.push(choice.choice);
            break;
          case AuthFlow.Choice.SMS_OTP:
            this.state.smsOtp = choice.data;
            this.state.authChoices.push(choice.choice);
            break;
          case AuthFlow.Choice.TOTP:
            this.state.totp = choice.data;
            this.state.authChoices.push(choice.choice);
            break;
          case AuthFlow.Choice.MAGICLINK:
            this.state.magiclink = choice.data;
            this.state.authChoices.push(choice.choice);
            break;
          case AuthFlow.Choice.AGREEMENTS:
            this.state.agreements = choice.data.agreements.slice();
            break;
          case AuthFlow.Choice.CAPTCHA:
            this.state.captcha = choice.data;
            break;
          case AuthFlow.Choice.SET_EMAIL:
            this.state.setEmail = choice.data;
            break;
          case AuthFlow.Choice.SET_PASSWORD:
            this.state.setPassword = choice.data;
            break;
          case AuthFlow.Choice.PROFILE:
            this.state.profile = choice.data;
            break;
          case AuthFlow.Choice.RESET_PASSWORD:
            this.state.resetPassword = choice.data;
            break;
          case AuthFlow.Choice.VERIFY_EMAIL:
            this.state.verifyEmail = choice.data;
            break;
        }

        // map social state to provider name
        if (this.state.socialChoices?.length > 0) {
          this.state.socialChoices.forEach((p: AuthFlow.SocialResponse) => {
            this.state.socialStateMap[p.state] = p.social_provider;
          });
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
