import { ReactNode, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Stack, TextField, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import ErrorMessage from "../ErrorMessage";

const EnrollMfaCompleteView = () => {
  const { callNext, reset, flowData, loading, error } = useAuthFlow();
  const [qrCode, setQrCode] = useState<string>("");

  const mfaEnrollContent = (provider: string): ReactNode => {
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
    if (flowData.selectedMfa === "totp" && flowData.qrCode) {
      setQrCode(flowData.qrCode);
    }
  }, [flowData.selectedMfa, flowData.qrCode]);

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
      callNext(FlowStep.ENROLL_MFA_COMPLETE, payload);
    },
  });

  // const selectMfaMethod = () => {
  //   callNext(FlowStep.ENROLL_MFA_SELECT, {});
  // };

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Enroll MFA</Typography>
        <Typography component="div" variant="body1">
          {mfaEnrollContent(flowData?.selectedMfa || "")}
        </Typography>
        <Typography variant="caption">{flowData.email}</Typography>
        {qrCode && (
          <div className="auth-flow-qr-code">
            <img src={qrCode} alt="TOTP QR CODE" />
          </div>
        )}
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="code"
          name="code"
          label="Code"
          type="text"
          value={formik.values.code}
          onChange={formik.handleChange}
          error={formik.touched.code && Boolean(formik.errors.code)}
          helperText={formik.touched.code && formik.errors.code}
        />
        {/* {flowData?.mfaProviders && flowData?.mfaProviders?.length > 1 && (
          <Stack direction="row" mt={3} mb={3}>
            <Button variant="text" onClick={selectMfaMethod}>
              Choose another way
            </Button>
          </Stack>
        )} */}
        {error && <ErrorMessage response={error} />}
        <Stack direction="row" gap={2} mt={2}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={reset}
            sx={{ alignSelf: "flex-start" }}
          >
            Reset
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default EnrollMfaCompleteView;
