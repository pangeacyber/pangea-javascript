import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { APIResponse } from "@src/types";

import {
  FlowState,
  FlowStorage,
  FlowStep,
  FlowStart,
  FlowSignupPassword,
  FlowVerifyPassword,
  FlowVerifyCallback,
  FlowVerifyCaptcha,
  FlowMfaStart,
  FlowMfaComplete,
} from "./types";

import AuthFlowClient from "./client";
import { useAuth } from "@src/ComponentAuthProvider";

export interface AuthFlowContextType {
  step?: FlowStep;
  error: string;
  loading: boolean;
  flowData: FlowState;
  callNext: (endpoint: FlowStep, data: any) => void;
  reset: () => void;
}

export interface AuthFlowProviderProps {
  client: AuthFlowClient;
  children: ReactNode;
}

const SESSION_DATA_NAME = "pangea-authn-flow";

const AuthFlowContext = createContext<AuthFlowContextType>(
  {} as AuthFlowContextType
);

const AuthFlowProvider: FC<AuthFlowProviderProps> = ({ client, children }) => {
  const { setFlowComplete } = useAuth();
  const auth = client;

  const [step, setStep] = useState<FlowStep>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [flowData, setFlowState] = useState<FlowState>({});

  // load data from local storage, and params from URL
  useEffect(() => {
    const sessionData = getSessionData();
    const initFlowState: FlowState = {
      step: sessionData.step || FlowStep.START,
    };

    // check for callback params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const cbCode = urlParams.get("code") || "";
    const cbState = urlParams.get("state") || null;

    if (sessionData.step) {
      initFlowState.flowId = sessionData.flow_id;
      initFlowState.recaptchaKey = sessionData.recaptcha_key;
      initFlowState.qrCode = sessionData.qr_code;
      initFlowState.selectedMfa = sessionData.selected_mfa;
      initFlowState.mfaProviders = sessionData.mfa_providers;
      initFlowState.email = sessionData.email;

      setFlowState(initFlowState);
    }

    setStep(initFlowState.step);

    // set auth client state from session
    auth.initState(initFlowState);

    /*
     * Start state and callback handling
     */

    // social signup with callback
    if (initFlowState.step === FlowStep.START && cbCode && cbState) {
      callNext(FlowStep.SIGNUP_SOCIAL, { cbCode: cbCode, cbState: cbState });
    }
    // fetch social providers
    else if (initFlowState.step === FlowStep.START) {
      callNext(FlowStep.START, {});
    }
    // social login with callback
    else if (
      initFlowState.step === FlowStep.VERIFY_SOCIAL &&
      cbCode &&
      cbState
    ) {
      callNext(FlowStep.VERIFY_SOCIAL, { cbCode: cbCode, cbState: cbState });
    }
    // verify email with callback
    else if (
      initFlowState.step === FlowStep.VERIFY_EMAIL &&
      cbCode &&
      cbState
    ) {
      callNext(FlowStep.VERIFY_EMAIL, { cbCode: cbCode, cbState: cbState });
    }

    // eslint-disable-next-line
  }, []);

  const callNext = useCallback(
    async (step: FlowStep, payload: any) => {
      setLoading(true);

      switch (step) {
        case undefined:
          // authenticated state
          break;
        case FlowStep.START:
          startHandler(payload);
          break;
        case FlowStep.SIGNUP_PASSWORD:
          signupPasswordHandler(payload);
          break;
        case FlowStep.SIGNUP_SOCIAL:
          signupSocialHandler(payload);
          break;
        case FlowStep.VERIFY_PASSWORD:
          verifyPasswordHandler(payload);
          break;
        case FlowStep.VERIFY_SOCIAL:
          verifySocialHandler(payload);
          break;
        case FlowStep.VERIFY_EMAIL:
          verifyEmailHandler(payload);
          break;
        case FlowStep.VERIFY_CAPTCHA:
          verifyCaptchaHandler(payload);
          break;
        case FlowStep.ENROLL_MFA_START:
          enrollMfaStartHandler(payload);
          break;
        case FlowStep.ENROLL_MFA_COMPLETE:
          enrollMfaCompleteHandler(payload);
          break;
        case FlowStep.VERIFY_MFA_START:
          verifyMfaStartHandler(payload);
          break;
        case FlowStep.VERIFY_MFA_COMPLETE:
          verifyMfaCompleteHandler(payload);
          break;
        default:
          // invalid state
          console.log("Invalid Flow State", step);
      }

      setLoading(false);

      // eslint-disable-next-line
    },
    [flowData]
  );

  const getSessionData = (): FlowStorage => {
    const storedData = localStorage.getItem(SESSION_DATA_NAME);

    if (storedData) {
      const session: FlowStorage = JSON.parse(storedData);
      return session;
    }

    return {};
  };

  const updateSessionData = useCallback((data: FlowState) => {
    const sessionData = getSessionData();

    sessionData.step = data.step;
    sessionData.flow_id = data.flowId;
    sessionData.email = data.email;
    sessionData.selected_mfa = data.selectedMfa;
    sessionData.mfa_providers = data.mfaProviders;
    sessionData.recaptcha_key = data.recaptchaKey;
    sessionData.qr_code = data.qrCode;

    const dataString = JSON.stringify(sessionData);
    localStorage.setItem(SESSION_DATA_NAME, dataString);
  }, []);

  const deleteSessionData = () => {
    localStorage.removeItem(SESSION_DATA_NAME);
  };

  const startHandler = async (payload: FlowStart) => {
    const { success, response } = await auth.start(payload);

    updateFlowState(success, response);
  };

  const signupPasswordHandler = async (payload: FlowSignupPassword) => {
    const { success, response } = await auth.signupPassword(payload);

    updateFlowState(success, response);
  };

  const signupSocialHandler = async (payload: FlowVerifyCallback) => {
    const { success, response } = await auth.signupSocial(payload);

    updateFlowState(success, response);
  };

  const verifyPasswordHandler = async (payload: FlowVerifyPassword) => {
    const { success, response } = await auth.verifyPassword(payload);

    updateFlowState(success, response);
  };

  const verifySocialHandler = async (payload: FlowVerifyCallback) => {
    const { success, response } = await auth.verifySocial(payload);

    updateFlowState(success, response);
  };

  const verifyEmailHandler = async (payload: FlowVerifyCallback) => {
    const { success, response } = await auth.verifyEmail(payload);

    updateFlowState(success, response);
  };

  const verifyCaptchaHandler = async (payload: FlowVerifyCaptcha) => {
    const { success, response } = await auth.verifyCaptcha(payload);

    updateFlowState(success, response);
  };

  const enrollMfaStartHandler = async (payload: FlowMfaStart) => {
    const { success, response } = await auth.enrollMfaStart(payload);

    updateFlowState(success, response);
  };

  const enrollMfaCompleteHandler = async (payload: FlowMfaComplete) => {
    const { success, response } = await auth.enrollMfaComplete(payload);

    updateFlowState(success, response);
  };

  const verifyMfaStartHandler = async (payload: FlowMfaStart) => {
    const { success, response } = await auth.verifyMfaStart(payload);

    updateFlowState(success, response);
  };

  const verifyMfaCompleteHandler = async (payload: FlowMfaComplete) => {
    const { success, response } = await auth.verifyMfaComplete(payload);

    updateFlowState(success, response);
  };

  const reset = useCallback(() => {
    auth.reset();
    setError("");
    callNext(FlowStep.START, {});
  }, [auth, callNext]);

  /*
    Common response utility
  */
  const updateFlowState = (success: boolean, response: APIResponse) => {
    if (success) {
      setError("");
      setStep(auth.state.step);
      setFlowState({ ...auth.state });

      // TODO: find a better way to check if complete was called
      if (
        auth.state.step === undefined &&
        response.result?.active_token?.token
      ) {
        deleteSessionData();
        setFlowComplete(response);
      } else {
        updateSessionData(auth.state);
      }
    } else {
      setError(response.summary);
      console.log("Error", response.summary);
    }
  };

  const memoData = useMemo(
    () => ({
      step,
      error,
      loading,
      flowData,
      callNext,
      reset,
    }),
    [step, error, loading, flowData, callNext, reset]
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

export default AuthFlowProvider;
