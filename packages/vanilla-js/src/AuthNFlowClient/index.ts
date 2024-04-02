import cloneDeep from "lodash/cloneDeep";
import valuesIn from "lodash/valuesIn";

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
  samlChoices: [],
  samlProviderMap: {},
  callbackStateMap: {},
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

    if (data?.device_id) {
      payload.device_id = data.device_id;
    }

    return await this._post(path, payload);
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

    return await this._post(path, payload);
  }

  async complete(): Promise<ClientResponse> {
    const path = `${API_FLOW_BASE}/${AuthFlow.Endpoint.COMPLETE}`;
    const payload: AuthFlow.CompleteRequest = {
      flow_id: this.state.flowId,
    };

    return await this._post(path, payload);
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

  async setPhone(data: AuthFlow.PhoneParams): Promise<ClientResponse> {
    const payload: AuthFlow.SetPhoneRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SET_PHONE,
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

  async verifySaml(data: AuthFlow.SamlParams): Promise<ClientResponse> {
    const payload: AuthFlow.SamlRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SAML,
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

  async sendPasskey(data: AuthFlow.PasswordParams): Promise<ClientResponse> {
    const payload: AuthFlow.PasskeyRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.PASSKEY,
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

  // post wrapper to process response
  async _post(path: string, payload: any): Promise<ClientResponse> {
    const { response } = await this.post(path, payload);

    const success = this.processResponse(response);

    return { success, response };
  }

  // convienence method for update calls
  async _update(payload: any): Promise<ClientResponse> {
    const path = this.getUpdatePath();

    return await this._post(path, payload);
  }

  getUpdatePath(): string {
    return `${API_FLOW_BASE}/${AuthFlow.Endpoint.UPDATE}`;
  }

  processResponse(response: APIResponse): boolean {
    let success = response.status === "Success";

    // update state data if call was sucessful and updateState is true
    if (success) {
      const result = response.result || {};

      // reset state to default
      this.state = { ...DEFAULT_FLOW_DATA };

      this.state.flowId = result.flow_id || "";
      this.state.flowType = result.flow_type ? [...result.flow_type] : [];
      this.state.flowChoices = cloneDeep(response.result.flow_choices);
      this.state.phase = result.flow_phase;

      if (result.email) {
        this.state.email = result.email;
      }

      if (result.phone) {
        this.state.phone = result.phone;
      }

      if (result.flow_phase === "phase_completed") {
        this.state.complete = true;
      }

      // initial parsed data variables
      this.state.authChoices = [];
      this.state.socialChoices = [];
      this.state.samlChoices = [];
      this.state.socialProviderMap = {};
      this.state.samlProviderMap = {};
      this.state.callbackStateMap = {};
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
          case AuthFlow.Choice.SAML:
            const samlData = choice.data;
            this.state.samlChoices.push(samlData);
            this.state.samlProviderMap[samlData.provider_id] = samlData;
            break;
          case AuthFlow.Choice.PASSKEY:
            this.state.passkey = choice.data;
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
            this.state.agreements = valuesIn(choice.data.agreements);
            break;
          case AuthFlow.Choice.CAPTCHA:
            this.state.captcha = choice.data;
            break;
          case AuthFlow.Choice.SET_EMAIL:
            if (result.flow_phase === "phase_one_time") {
              this.state.authChoices.push(choice.choice);
            }
            this.state.setEmail = choice.data;
            break;
          case AuthFlow.Choice.SET_PHONE:
            if (result.flow_phase === "phase_one_time") {
              this.state.authChoices.push(choice.choice);
            }
            this.state.setPhone = choice.data;
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
          case AuthFlow.Choice.PROVISIONAL:
            this.state.provisional = choice.data;
            break;
          default:
            console.warn("Unknown choice: ", choice);
        }

        // map social state to provider name
        if (this.state.socialChoices?.length > 0) {
          this.state.socialChoices.forEach((p: AuthFlow.SocialResponse) => {
            this.state.callbackStateMap[
              p.state
            ] = `social:${p.social_provider}`;
          });
        }

        // map saml state to provider name
        if (this.state.samlChoices?.length > 0) {
          this.state.samlChoices.forEach((p: AuthFlow.SamlResponse) => {
            this.state.callbackStateMap[
              p.state
            ] = `saml:${p.provider_id}:${p.provider_name}`;
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
