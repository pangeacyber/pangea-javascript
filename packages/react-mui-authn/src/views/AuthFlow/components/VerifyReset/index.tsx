import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Stack, TextField, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

const ResetPasswordView: FC<ViewComponentProps> = ({
  options,
  data,
  error,
  next,
  reset,
}) => {
  const checkFlow = () => {
    // call flow get
  };

  const cancelReset = () => {
    next(FlowStep.RESET_PASSWORD, { cancel: true });
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">Reset Password</Typography>
      <Stack gap={1}>
        <Typography variant="body2">
          An email has been sent to {data.email}, click the link in the message
          to reset your password.
        </Typography>
        <Typography variant="body2">
          If you click the link in a different browser, return here and click
          the button below.
        </Typography>
      </Stack>
      <Stack gap={1}>
        <Button variant="contained" color="primary">
          Verification Complete
        </Button>
        {error && <ErrorMessage response={error} />}
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={cancelReset}>
          Cancel Reset
        </Button>
        {options.showReset && (
          <Button variant="text" onClick={reset}>
            {options.resetLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default ResetPasswordView;
