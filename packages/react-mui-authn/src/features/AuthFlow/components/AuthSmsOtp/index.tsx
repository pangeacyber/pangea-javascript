import { FC, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import Button from "@src/components/core/Button";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import OtpForm from "../OtpForm";
import StringField from "@src/components/fields/StringField";
import ErrorMessage from "../ErrorMessage";

const AuthSmsOtp: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, error, loading, restart } = props;

  const sendCode = () => {
    restart(AuthFlow.Choice.SMS_OTP);
  };

  useEffect(() => {
    if (data.smsOtp?.sent === false && !data.smsOtp?.need_phone) {
      sendCode();
    }
  }, []);

  const validationSchema = yup.object({
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^[+]?[1-9][-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
        "Must be a valid phone number"
      ),
  });

  const formik = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload: AuthFlow.SmsOtpRestart = {
        ...values,
      };
      restart(AuthFlow.Choice.SMS_OTP, payload);
    },
  });

  if (data.smsOtp?.need_phone) {
    return (
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <Stack gap={1}>
          <Typography variant="body1">Enroll a Phone Number</Typography>
          <StringField
            name="phone"
            label="Phone Number"
            formik={formik}
            autoComplete="phone"
          />
          {error && <ErrorMessage response={error} />}
          <Button
            color="primary"
            fullWidth={true}
            disabled={loading}
            onClick={formik.submitForm}
          >
            {options.submitLabel}
          </Button>
        </Stack>
      </form>
    );
  }

  return (
    <Stack gap={1}>
      <Typography variant="body1">Enter the code sent to your phone</Typography>
      <OtpForm {...props} otpType="sms_otp" />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={sendCode} disabled={loading}>
          Resend Code
        </Button>
      </Stack>
    </Stack>
  );
};

export default AuthSmsOtp;
