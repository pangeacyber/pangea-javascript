// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { AlertColor } from "@mui/material";
import create from "zustand";
import uniqBy from "lodash/uniqBy";
import { parseErrorFromPangea } from "../../utils";

interface AlertNotification {
  message: string;
  severity: AlertColor;
}

interface AlertStore {
  alerts: AlertNotification[];
}

export const useAlerts = create<AlertStore>((set, get) => ({
  alerts: [],
}));

export const showAlert = (
  message: string,
  options?: {
    severity?: "error" | "info" | "success";
  }
) => {
  const { severity = "error" } = options ?? {};
  if (!message) return;

  useAlerts.setState((state) => ({
    alerts: uniqBy([...state.alerts, { message, severity }], "message"),
  }));
};

export const alertOnError = (error: any) => {
  console.error(error);
  showAlert(parseErrorFromPangea(error));
};

export const clearAlerts = () => {
  useAlerts.setState(() => ({ alerts: [] }));
};
