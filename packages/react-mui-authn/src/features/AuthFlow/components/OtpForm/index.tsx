import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack } from "@mui/material";

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
  otpType,
}) => {
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

  useEffect(() => {
    formik.resetForm();
  }, [error, data]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap={1}>
        <CodeField
          name="code"
          formik={formik}
          field={{
            label: "Code",
          }}
        />
        {error && <ErrorMessage response={error} />}
        <Button
          color="primary"
          type="submit"
          disabled={loading}
          fullWidth={true}
        >
          {options.otpButtonLabel}
        </Button>
      </Stack>
    </form>
  );
};

export default OtpForm;
