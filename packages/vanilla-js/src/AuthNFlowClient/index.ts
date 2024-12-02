import cloneDeep from "lodash/cloneDeep";
import valuesIn from "lodash/valuesIn";

import { AuthNClient } from "../AuthNClient";

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
  scopes: [],
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

  /**
   * Initialize the application state
   *
   * @param flowState an object containing the intial flow state
   * */
  initState(flowState: Partial<AuthFlow.StateData>) {
    this.state = {
      ...this.state,
      ...flowState,
    };
  }

  /*
    AuthN Flow state start and complete functions
  */

  /**
   * Start a new login/signup flow
   *
   * @param data parameters for the start call
   * @returns a Promise that yields a ClientResponse object
   * */
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
      ...data,
    };

    return await this._post(path, payload);
  }

  /**
   * Call restart for a flow choice
   *
   * @param data parameters for the restart call
   * @returns a Promise that yields a ClientResponse object
   * */
  async restart(
    choice: AuthFlow.RestartChoice,
    data?:
      | AuthFlow.SmsOtpRestart
      | AuthFlow.MagiclinkRestart
      | AuthFlow.EmailOtpRestart
  ): Promise<ClientResponse> {
    const path = `${API_FLOW_BASE}/${AuthFlow.Endpoint.RESTART}`;
    const payload: AuthFlow.RestartRequest = {
      flow_id: this.state.flowId,
      choice: choice,
      data: data || {},
    };

    return await this._post(path, payload);
  }

  /**
   * Complete a login/signup flow
   *
   * @param device_id an optional string
   * @returns a Promise that yields a ClientResponse object
   * */
  async complete(device_id: string = ""): Promise<ClientResponse> {
    const path = `${API_FLOW_BASE}/${AuthFlow.Endpoint.COMPLETE}`;
    const payload: AuthFlow.CompleteRequest = {
      flow_id: this.state.flowId,
    };

    if (device_id) {
      payload.device_id = device_id;
    }

    return await this._post(path, payload);
  }

  /*
    AuthN Flow choice update functions
  */

  /**
   * Get the current flow state from AuthN
   *
   * @returns a Promise that yields a ClientResponse object
   * */
  async getFlowState(): Promise<ClientResponse> {
    const payload: AuthFlow.StatusRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.NONE,
      data: {},
    };
    return await this._update(payload);
  }

  /**
   * Set the email associated with a flow_id
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async setEmail(data: AuthFlow.EmailParams): Promise<ClientResponse> {
    const payload: AuthFlow.SetEmailRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SET_EMAIL,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Set the username associated with a flow_id
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async setUsername(data: AuthFlow.UsernameParams): Promise<ClientResponse> {
    const payload: AuthFlow.SetUsernameRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SET_USERNAME,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Set the phone number associated with a flow_id
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async setPhone(data: AuthFlow.PhoneParams): Promise<ClientResponse> {
    const payload: AuthFlow.SetPhoneRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SET_PHONE,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to verify an email
   *
   * @returns a Promise that yields a ClientResponse object
   * */
  async verifyEmail(): Promise<ClientResponse> {
    const payload: AuthFlow.VerifyEmailRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.VERIFY_EMAIL,
      data: {},
    };

    return await this._update(payload);
  }

  /**
   * Call update to verify a social login
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async verifySocial(data: AuthFlow.SocialParams): Promise<ClientResponse> {
    const payload: AuthFlow.SocialRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SOCIAL,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to verify a SAML login
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async verifySaml(data: AuthFlow.SamlParams): Promise<ClientResponse> {
    const payload: AuthFlow.SamlRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SAML,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to verify a password
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async verifyPassword(data: AuthFlow.PasswordParams): Promise<ClientResponse> {
    const payload: AuthFlow.PasswordRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.PASSWORD,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to set a password
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async setPassword(data: AuthFlow.PasswordParams): Promise<ClientResponse> {
    const payload: AuthFlow.SetPasswordRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SET_PASSWORD,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to start a password reset flow
   *
   * @returns a Promise that yields a ClientResponse object
   * */
  async resetPassword(): Promise<ClientResponse> {
    const payload: AuthFlow.ResetPasswordRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.RESET_PASSWORD,
      data: {},
    };

    return await this._update(payload);
  }

  /**
   * Call update to verify a captcha
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async verifyCaptcha(data: AuthFlow.CaptchaParams): Promise<ClientResponse> {
    const payload: AuthFlow.CaptchaRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.CAPTCHA,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to verify an email OTP code
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async emailOtp(data: AuthFlow.EmailOtpParams): Promise<ClientResponse> {
    const payload: AuthFlow.EmailOtpRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.EMAIL_OTP,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to verify an SMS OTP code
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async smsOtp(data: AuthFlow.SmsOtpParams): Promise<ClientResponse> {
    const payload: AuthFlow.SmsOtpRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.SMS_OTP,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to verify a TOTP code
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async totp(data: AuthFlow.TotpParams): Promise<ClientResponse> {
    const payload: AuthFlow.TotpRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.TOTP,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to accept an agreement
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
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

  /**
   * Call update to set profile data
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async updateProfile(data: AuthFlow.ProfileParams): Promise<ClientResponse> {
    const payload: AuthFlow.ProfileRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.PROFILE,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to send a passkey
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async sendPasskey(data: AuthFlow.PasswordParams): Promise<ClientResponse> {
    const payload: AuthFlow.PasskeyRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.PASSKEY,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Call update to save OAuth consent
   *
   * @param data parameters for the update call
   * @returns a Promise that yields a ClientResponse object
   * */
  async oauthConsent(data: AuthFlow.ConsentParams): Promise<ClientResponse> {
    const payload: AuthFlow.ConsentRequest = {
      flow_id: this.state.flowId,
      choice: AuthFlow.Choice.CONSENT,
      data: data,
    };

    return await this._update(payload);
  }

  /**
   * Reset internal state to default
   * */
  reset() {
    this.state = {
      ...DEFAULT_FLOW_DATA,
    };
  }

  /** @hidden */
  async _post(path: string, payload: any): Promise<ClientResponse> {
    const { response } = await this.post(path, payload);

    const success = this.processResponse(response);

    return { success, response };
  }

  /** @hidden */
  async _update(payload: any): Promise<ClientResponse> {
    const path = this.getUpdatePath();

    return await this._post(path, payload);
  }

  /**
   * Return the path for a flow API call
   *
   * @returns the path to the flow upate endpoint
   * */
  getUpdatePath(): string {
    return `${API_FLOW_BASE}/${AuthFlow.Endpoint.UPDATE}`;
  }

  /**
   * Process the API Flow Response
   *
   * @param response an APIResponse object
   * @returns a boolean success status
   * */
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

      // initial parsed data variables
      this.state.authChoices = [];
      this.state.socialChoices = [];
      this.state.samlChoices = [];
      this.state.socialProviderMap = {};
      this.state.samlProviderMap = {};
      this.state.callbackStateMap = {};
      this.state.agreements = [];
      this.state.scopes = [];

      if (result.username) {
        this.state.username = result.username;
      }

      if (result.email) {
        this.state.email = result.email;
      }

      if (result.phone) {
        this.state.phone = result.phone;
      }

      if (result.flow_phase === "phase_completed") {
        this.state.complete = true;
      }

      if (result.disclaimer) {
        this.state.disclaimer = result.disclaimer;
      }

      if (result.conditional_mfa) {
        this.state.conditionalMfa = result.conditional_mfa;
      }

      // default to "email" username_format
      this.state.usernameFormat = !!result.username_format
        ? result.username_format
        : AuthFlow.UsernameFormat.EMAIL;

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
          case AuthFlow.Choice.SET_USERNAME:
            this.state.setUsername = choice.data;
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
          case AuthFlow.Choice.CONSENT:
            this.state.scopes = choice.data?.scopes || [];
            break;
          default:
            console.warn("Unknown choice: ", choice);
        }

        // map social state to provider name
        if (this.state.socialChoices?.length > 0) {
          this.state.socialChoices.forEach((p: AuthFlow.SocialResponse) => {
            this.state.callbackStateMap[p.state] =
              `social:${p.social_provider}`;
          });
        }

        // map saml state to provider name
        if (this.state.samlChoices?.length > 0) {
          this.state.samlChoices.forEach((p: AuthFlow.SamlResponse) => {
            this.state.callbackStateMap[p.state] =
              `saml:${p.provider_id}:${p.provider_name}`;
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
