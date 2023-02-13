import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

const EnrollMfaCompleteView = () => {
  const { callNext, reset, flowData, loading, error } = useAuthFlow();
  const [qrCode, setQrCode] = useState<string>("");

  const mfaEnrollTitle = (provider: string): string => {
    switch (provider) {
      case "sms_otp":
        return "Enter the code sent to your phone";
      case "email_otp":
        return "Enter the code sent to your email";
      case "totp":
        return "Scan the QR Code below, then enter the code from your app";
      default:
        return "Enter the code";
    }
  };

  console.log("flowData", flowData);
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

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">
          {mfaEnrollTitle(flowData?.selectedMfa || "")}
        </Typography>
        <Typography variant="caption">{flowData.email}</Typography>
        {qrCode && (
          <div className="auth-flow-qr-code">
            <img src={qrCode} alt="TOTP QR CODE" />
          </div>
        )}
        {qrCode}
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
        {error && <Box sx={{ color: "red" }}>{error.summary}</Box>}
        <Stack direction="row" gap={2} my={2}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            Submit
          </Button>
          <Button
            variant="text"
            onClick={reset}
            sx={{ alignSelf: "flex-start" }}
          >
            Start Over
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default EnrollMfaCompleteView;
