import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import CodeField from "@src/components/fields/CodeField";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

interface Props extends AuthFlowComponentProps {
  otpType: string;
}

const OtpForm: FC<Props> = ({
  options,
  loading,
  error,
  data,
  update,
  restart,
  otpType,
}) => {
  const [disabled, setDisabled] = useState<boolean>(false);

  const validationSchema = yup.object({
    code: yup
      .string()
      .required("Code is required")
      .matches(/^[0-9]+$/, "Must be only digits"),
  });

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (otpType === "email_otp") {
        const payload: AuthFlow.EmailOtpParams = {
          code: values.code,
        };
        update(AuthFlow.Choice.EMAIL_OTP, payload);
      } else if (otpType === "sms_otp") {
        const payload: AuthFlow.SmsOtpParams = {
          code: values.code,
        };
        update(AuthFlow.Choice.SMS_OTP, payload);
      } else if (otpType === "totp") {
        const payload: AuthFlow.TotpParams = {
          code: values.code,
        };
        update(AuthFlow.Choice.TOTP, payload);
      } else {
        console.warn(`Invalid OTP Type: ${otpType}`);
      }
    },
  });

  const retryMessage = (otpType: string) => {
    if (
      error.status === "MfaCodeExpired" ||
      error.status === "AuthenticationFailure"
    ) {
      if (otpType === "totp") {
        return (
          <Typography variant="body2" mb={1} color="error">
            Retry with the next code
          </Typography>
        );
      } else {
        return (
          <Typography variant="body2" mb={1} color="error">
            Resend code to try again
          </Typography>
        );
      }
    }

    return null;
  };

  const sendCode = () => {
    if (otpType === "email_otp") {
      restart(AuthFlow.Choice.EMAIL_OTP);
    } else if (otpType === "sms_otp") {
      restart(AuthFlow.Choice.SMS_OTP);
    }
  };

  useEffect(() => {
    if (
      (otpType === "email_otp" && data?.emailOtp?.sent === false) ||
      (otpType === "sms_otp" && data?.smsOtp?.sent === false)
    ) {
      sendCode();
    }
  }, []);

  useEffect(() => {
    // reset the form, except on comms failure
    if (
      error.status !== "ServiceNotAvailable" ||
      error.summary === "Failed to fetch"
    ) {
      formik.resetForm();

      // disable the inputs, except for TOTP. code can't be re-entered
      if (otpType !== "totp") {
        setDisabled(true);
      }
    }
  }, [error]);

  useEffect(() => {
    setDisabled(false);
  }, [data]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap={1}>
        <CodeField
          name="code"
          formik={formik}
          field={{
            label: "Code",
          }}
          disabled={disabled}
        />
        {error && (
          <>
            <ErrorMessage response={error} />
            {retryMessage(otpType)}
          </>
        )}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center"
          gap={{ xs: 0, sm: 1 }}
        >
          {otpType !== "totp" && (
            <Button
              fullWidth
              color="secondary"
              onClick={sendCode}
              disabled={loading}
            >
              Resend code
            </Button>
          )}
          <Button color="primary" type="submit" disabled={loading} fullWidth>
            {options.otpButtonLabel}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default OtpForm;
