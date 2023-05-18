import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

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
          <ul>
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
        <Typography variant="h6" mb={4}>
          Enroll MFA
        </Typography>
        <Typography component="div" variant="body1">
          {mfaEnrollContent(data?.selectedMfa || "")}
        </Typography>
        {options.showEmail && (
          <Typography variant="body2">{data.email}</Typography>
        )}
        {qrCode && (
          <div className="auth-flow-qr-code">
            <img src={qrCode} alt="TOTP QR CODE" />
          </div>
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
        {data?.mfaProviders && data?.mfaProviders?.length > 1 && (
          <Stack direction="row" mt={3} mb={3}>
            <Button variant="text" onClick={selectMfaMethod}>
              Choose another MFA method
            </Button>
          </Stack>
        )}
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
        <Stack direction="row" gap={2} mt={2}>
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
