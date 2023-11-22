import {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import cloneDeep from "lodash/cloneDeep";

import {
  APIResponse,
  AuthNFlowClient,
  AuthNFlowOptions,
  CallbackParams,
  AuthFlow,
} from "@pangeacyber/vanilla-js";
import { AuthConfig } from "@src/types";
import { AuthFlowComponentProps, FlowPhase, SessionData } from "./types";

export interface AuthFlowProviderProps {
  config: AuthConfig;
  options?: AuthNFlowOptions;
  children: JSX.Element;
}

const SESSION_DATA_NAME = "pangea-flow-session";

export const AuthFlowContext = createContext<AuthFlowComponentProps>(
  {} as AuthFlowComponentProps
);

export const AuthFlowProvider: FC<AuthFlowProviderProps> = ({
  config,
  options,
  children,
}) => {
  const [phase, setPhase] = useState<string>("");
  const [error, setError] = useState<APIResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<AuthFlow.StateData>();
  const [cbParams, setCbParams] = useState<CallbackParams>();
  const [invite, setInvite] = useState<boolean>(false);

  const isStart = useRef<boolean>(true);
  const client = useMemo(() => {
    return new AuthNFlowClient(config, options);
  }, []);

  useEffect(() => {
    start({ email: config?.email });
  }, []);

  const getSessionData = (): SessionData => {
    const storedData = localStorage.getItem(SESSION_DATA_NAME);

    if (storedData) {
      const session: SessionData = JSON.parse(storedData);
      return session;
    }

    return {};
  };

  const updateSessionData = useCallback(
    (phase: FlowPhase, data: Partial<AuthFlow.StateData>) => {
      const sessionData = getSessionData();
      const newData = {
        ...sessionData,
        flow_id: data.flowId,
        email: data.email,
        phase: phase,
        invite: invite,
        callbackState: { ...data.callbackStateMap },
      };

      const dataString = JSON.stringify(newData);
      localStorage.setItem(SESSION_DATA_NAME, dataString);
    },
    []
  );

  const deleteSessionData = () => {
    localStorage.removeItem(SESSION_DATA_NAME);
  };

  const start = async (payload: AuthFlow.StartParams) => {
    const sessionData = getSessionData();

    setInvite(!!config?.email || !!sessionData.invite);

    // get callback state and code if set
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const cbState = urlParams.get("state") || "";
    const cbCode = urlParams.get("code") || "";
    const cbFlowId = urlParams.get("flow") || "";
    const flowId = config.flowId || sessionData.flow_id;

    if (cbState && cbCode) {
      setCbParams({ state: cbState, code: cbCode });
    }

    if (flowId) {
      client.initState({
        flowId: flowId,
        phase: sessionData.phase,
      });

      if (!!cbFlowId && cbFlowId !== sessionData.flow_id) {
        setPhase(FlowPhase.FLOW_RETURN);
      } else if (
        cbCode &&
        sessionData.callbackState &&
        sessionData.callbackState[cbState]
      ) {
        const providerData = sessionData.callbackState[cbState];
        setLoading(true);

        if (providerData.startsWith("social:")) {
          const socialName = providerData.replace("social:", "");
          const payload: AuthFlow.SocialParams = {
            social_provider: socialName,
            uri: window.location.toString(),
          };

          const { success, response } = await client.verifySocial(payload);
          updateFlowState(success, response);
        } else if (providerData.startsWith("saml:")) {
          const samlData = providerData.replace("saml:", "");
          const [providerId] = samlData.split(":", 1);
          const providerName = samlData.replace(`${providerId}:`, "");

          const payload: AuthFlow.SamlParams = {
            provider_id: providerId,
            provider_name: providerName,
            uri: window.location.toString(),
          };

          const { success, response } = await client.verifySaml(payload);
          updateFlowState(success, response);
        }

        setLoading(false);
      } else {
        getState();
      }
    } else {
      setLoading(true);

      const { success, response } = await client.start(payload);
      updateFlowState(success, response);

      setLoading(false);
      isStart.current = false;
    }
  };

  const getState = async () => {
    setLoading(true);

    const { success, response } = await client.getFlowState();

    if (!success && response?.status === "InvalidFlow") {
      reset();
    } else {
      updateFlowState(success, response);
    }
    setLoading(false);
  };

  const restart = useCallback(
    async (choice: AuthFlow.RestartChoice, data?: AuthFlow.SmsOtpRestart) => {
      setLoading(true);

      const { success, response } = await client.restart(choice, data);
      updateFlowState(success, response);

      setLoading(false);
    },
    [client]
  );

  const reset = useCallback(() => {
    // remove the 'flow' parameter if it's set and update the URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("flow")) {
      urlParams.delete("flow");

      const newUrl = `${window.location.protocol}//${window.location.host}${
        window.location.pathname
      }?${urlParams.toString()}`;
      window.history.replaceState({}, document.title, newUrl);
    }

    deleteSessionData();
    client.reset();
    start({});
  }, [client]);

  const update = useCallback(
    async (step: AuthFlow.Choice, payload: any) => {
      setLoading(true);

      switch (step) {
        case AuthFlow.Choice.NONE:
          getState();
          break;
        case AuthFlow.Choice.SET_EMAIL:
          setEmailHandler(payload);
          break;
        case AuthFlow.Choice.PASSWORD:
          verifyPasswordHandler(payload);
          break;
        case AuthFlow.Choice.SET_PASSWORD:
          setPasswordHandler(payload);
          break;
        case AuthFlow.Choice.CAPTCHA:
          captchaHandler(payload);
          break;
        case AuthFlow.Choice.PROFILE:
          profileHandler(payload);
          break;
        case AuthFlow.Choice.VERIFY_EMAIL:
          verifyEmailHandler();
          break;
        case AuthFlow.Choice.SOCIAL:
          verifySocial(payload);
          break;
        case AuthFlow.Choice.EMAIL_OTP:
          verifyEmailOtp(payload);
          break;
        case AuthFlow.Choice.SMS_OTP:
          verifySmsOtp(payload);
          break;
        case AuthFlow.Choice.TOTP:
          verifyTotp(payload);
          break;
        case AuthFlow.Choice.AGREEMENTS:
          acceptAgreement(payload);
          break;
        case AuthFlow.Choice.RESET_PASSWORD:
          resetPassword();
          break;
        default:
          // invalid state
          console.log("Invalid Flow State", step);
      }

      setLoading(false);
    },
    [client]
  );

  const setEmailHandler = async (payload: AuthFlow.EmailParams) => {
    const { success, response } = await client.setEmail(payload);

    updateFlowState(success, response);
  };

  const verifyPasswordHandler = async (payload: AuthFlow.PasswordParams) => {
    const { success, response } = await client.verifyPassword(payload);

    updateFlowState(success, response);
  };

  const setPasswordHandler = async (payload: AuthFlow.PasswordParams) => {
    const { success, response } = await client.setPassword(payload);

    updateFlowState(success, response);
  };

  const captchaHandler = async (payload: AuthFlow.CaptchaParams) => {
    const { success, response } = await client.verifyCaptcha(payload);

    updateFlowState(success, response);
  };

  const profileHandler = async (payload: AuthFlow.ProfileParams) => {
    const { success, response } = await client.updateProfile(payload);

    updateFlowState(success, response);
  };

  const verifyEmailHandler = async () => {
    const { success, response } = await client.verifyEmail();

    updateFlowState(success, response);
  };

  const verifySocial = async (payload: AuthFlow.SocialParams) => {
    const { success, response } = await client.verifySocial(payload);

    updateFlowState(success, response);
  };

  const verifySaml = async (payload: AuthFlow.SamlParams) => {
    const { success, response } = await client.verifySaml(payload);

    updateFlowState(success, response);
  };

  const verifyEmailOtp = async (payload: AuthFlow.EmailOtpParams) => {
    const { success, response } = await client.emailOtp(payload);

    updateFlowState(success, response);
  };

  const verifySmsOtp = async (payload: AuthFlow.SmsOtpParams) => {
    const { success, response } = await client.smsOtp(payload);

    updateFlowState(success, response);
  };

  const verifyTotp = async (payload: AuthFlow.TotpParams) => {
    const { success, response } = await client.totp(payload);

    updateFlowState(success, response);
  };

  const acceptAgreement = async (payload: AuthFlow.AgreementsParams) => {
    const { success, response } = await client.acceptAgreement(payload);

    updateFlowState(success, response);
  };

  const resetPassword = async () => {
    const { success, response } = await client.resetPassword();

    updateFlowState(success, response);
  };

  /*
    Common response utility
  */
  const updateFlowState = (success: boolean, response: APIResponse) => {
    if (success) {
      isStart.current = false;
      setData({ ...cloneDeep(client.state), invite: invite });
      setError(undefined);

      let nextPhase: FlowPhase = FlowPhase.INIT;

      if (client.state.complete) {
        nextPhase = FlowPhase.COMPLETE;
      } else if (client.state?.setEmail) {
        nextPhase = FlowPhase.START;
      } else if (client.state.setPassword) {
        nextPhase = FlowPhase.SET_PASSWORD;
      } else if (client.state.provisional) {
        nextPhase = FlowPhase.PROVISIONAL;
      } else if (
        client.state.resetPassword &&
        client.state.resetPassword?.sent
      ) {
        nextPhase = FlowPhase.RESET_PASSWORD;
      } else if (
        client.state.profile?.fields &&
        client.state.profile?.fields?.length > 0
      ) {
        nextPhase = FlowPhase.PROFILE;
      } else if (client.state.agreements?.length > 0) {
        nextPhase = FlowPhase.AGREEMENTS;
      } else if (client.state.verifyEmail) {
        nextPhase = FlowPhase.VERIFY_EMAIL;
      } else if (client.state.captcha) {
        nextPhase = FlowPhase.CAPTCHA;
      } else if (
        client.state.email &&
        client.state.flowType.includes("signup")
      ) {
        nextPhase = FlowPhase.SIGNUP;
      } else if (
        (client.state.email && client.state.flowType.includes("signin")) ||
        client.state.flowType.includes("one_time")
      ) {
        nextPhase = FlowPhase.LOGIN;
      }

      updateSessionData(nextPhase, client.state);
      setPhase(nextPhase);
    } else {
      if (response.status === "IncorrectAuthenticationProvider") {
        setPhase(FlowPhase.INVALID_AUTH_METHOD);
      } else if (response.status === "NotMatchExpectedEmail") {
        setPhase(FlowPhase.MISMATCH_EMAIL);
      } else if (response.status === "DisabledUser") {
        setPhase(FlowPhase.ERROR);
      } else if (isStart.current) {
        setPhase(FlowPhase.ERROR);
      }
      setError(response);
    }
  };

  const memoData = useMemo(
    () => ({
      phase,
      error,
      loading,
      data,
      cbParams,
      update,
      restart,
      reset,
    }),
    [phase, error, loading, data, cbParams, update, restart, reset]
  );

  return (
    <AuthFlowContext.Provider value={memoData}>
      {children}
    </AuthFlowContext.Provider>
  );
};

export const useAuthFlow = () => {
  return useContext(AuthFlowContext);
};
