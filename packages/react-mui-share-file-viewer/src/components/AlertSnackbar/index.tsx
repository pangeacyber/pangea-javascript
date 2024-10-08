import { useState, useEffect, FC } from "react";

import isEmpty from "lodash/isEmpty";

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { clearAlerts, useAlerts } from "./hooks";
import { Typography } from "@mui/material";
import { AlertsSnackbarProps } from "../../types";

const AlertsSnackbar: FC<AlertsSnackbarProps> = ({
  SnackbarProps,
  AlertProps,
}) => {
  const alerts = useAlerts((state) => state.alerts);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: unknown, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    // FIXME: Just temporary clearing all notifications
    // Really each notification should have it's own timeout
    clearAlerts();
  };

  useEffect(() => {
    if (!isEmpty(alerts)) {
      setOpen(true);
    }
  }, [alerts]);

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        sx={{
          boxShadow: "0px 0px 24px 0px rgba(40, 48, 94, 0.12)",
        }}
        {...SnackbarProps}
      >
        <div>
          {alerts.map((alert, i) => (
            <Alert
              key={`alert-${i}`}
              onClose={handleClose}
              severity={alert.severity}
              variant={"filled"}
              sx={{
                width: "100%",
                marginBottom: 0.5,
                color: "#fff",
              }}
              {...AlertProps}
            >
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {alert.message}
              </Typography>
            </Alert>
          ))}
        </div>
      </Snackbar>
    </Stack>
  );
};

export default AlertsSnackbar;
