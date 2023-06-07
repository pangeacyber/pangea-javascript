import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Stack, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import CodeField from "@src/components/fields/CodeField";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";
import { getOtpTitle } from "@src/views/AuthFlow/utils";

const EnrollMfaCompleteView: FC<ViewComponentProps> = ({
  options,
  data,
  loading,
  error,
  next,
  reset,
}) => {
  const [qrCode, setQrCode] = useState<string>("");

  const mfaEnrollContent = (provider: string) => {
    switch (provider) {
      case "sms_otp":
        return <p>Enter the code sent to your phone</p>;
      case "email_otp":
        return <p>Enter the code sent to your email</p>;
      case "totp":
        return (
          <ul style={{ listStyle: "circle" }}>
            <li>Open the Authenticator app</li>
            <li>Scan the QR Code below in the app</li>
            <li>Enter the code from your Authenticator app</li>
          </ul>
        );
      default:
        return <p>Enter the code</p>;
    }
  };

  useEffect(() => {
    if (data.selectedMfa === "totp" && data.qrCode) {
      setQrCode(data.qrCode);
    }
  }, [data.selectedMfa, data.qrCode]);

  const validationSchema = yup.object({
    code: yup
      .string()
      .required("Code is required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .length(6, "Code must be 6 digits"),
  });

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        code: values.code,
      };
      next(FlowStep.ENROLL_MFA_COMPLETE, payload);
    },
  });

  const selectMfaMethod = () => {
    next(FlowStep.ENROLL_MFA_SELECT, { cancel: true });
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6">
        Enroll {getOtpTitle(data?.selectedMfa)} MFA
      </Typography>
      <Stack gap={1}>
        <Typography component="div" variant="body2">
          {mfaEnrollContent(data?.selectedMfa || "")}
        </Typography>
        {qrCode && (
          <Box className="auth-flow-qr-code" sx={{ textAlign: "center" }}>
            <img src={qrCode} alt="TOTP QR CODE" />
          </Box>
        )}
      </Stack>
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
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth={true}
          >
            {options.submitLabel}
          </Button>
        </Stack>
      </form>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        {data?.mfaProviders && data?.mfaProviders?.length > 1 && (
          <Button variant="text" onClick={selectMfaMethod}>
            Choose another MFA method
          </Button>
        )}
        {options.showReset && (
          <Button variant="text" onClick={reset}>
            {options.resetLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default EnrollMfaCompleteView;
