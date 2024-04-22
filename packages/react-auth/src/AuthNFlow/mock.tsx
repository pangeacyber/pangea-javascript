"use client";

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

import { APIResponse } from "~/src/types";

import { FlowState, FlowStep } from "./types";

import { delay } from "~/src/shared/utils";

export interface MockFlowContextType {
  step?: FlowStep;
  error: APIResponse | undefined;
  loading: boolean;
  flowData: FlowState;
  callNext: (endpoint: FlowStep) => void;
  reset: () => void;
}

export interface MockFlowProviderProps {
  children: ReactNode;
}

export const MockFlowContext = createContext<MockFlowContextType>(
  {} as MockFlowContextType
);

export const MockFlowProvider: FC<MockFlowProviderProps> = ({ children }) => {
  const [step, setStep] = useState<FlowStep>();
  const [error, setError] = useState<APIResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const [flowData, _setFlowState] = useState<FlowState>({});

  useEffect(() => {
    setStep(FlowStep.START);
  }, []);

  const callNext = useCallback(async (step: FlowStep) => {
    setLoading(true);
    delay(700);
    setStep(step);
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setError(undefined);
    callNext(FlowStep.START);
  }, [callNext]);

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
    <MockFlowContext.Provider value={memoData}>
      {children}
    </MockFlowContext.Provider>
  );
};

export const useMockFlow = () => {
  return useContext(MockFlowContext);
};
