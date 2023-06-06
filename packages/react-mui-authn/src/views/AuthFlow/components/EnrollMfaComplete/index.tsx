import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Stack, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import CodeField from "@src/components/fields/CodeField";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

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
      <Stack>
        <Typography variant="h6" mb={1}>
          Enroll MFA
        </Typography>
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
        <CodeField
          name="code"
          formik={formik}
          field={{
            label: "Code",
          }}
        />
        {error && <ErrorMessage response={error} />}
        <Stack direction="row" gap={2} mt={2}>
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
        <Stack direction="row" justifyContent="center" gap={2} mt={2}>
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
      </form>
    </Stack>
  );
};

export default EnrollMfaCompleteView;
