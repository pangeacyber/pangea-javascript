import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

const VerifyMfaCompleteView = () => {
  const { callNext, reset, flowData, loading, error } = useAuthFlow();
  const provider = getOtpTitle(
    flowData.mfaProviders ? flowData.mfaProviders[0] : ""
  );

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
      callNext(FlowStep.VERIFY_MFA_COMPLETE, payload);
    },
  });

  const resendCode = () => {
    const payload = {
      mfaProvider: flowData.selectedMfa,
      code: "",
      cancel: true,
    };
    callNext(FlowStep.VERIFY_MFA_COMPLETE, payload);
  };
  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Enter {provider} Code</Typography>
        <Typography variant="caption">{flowData.email}</Typography>
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
          {error?.status === "MfaCodeExpired" && (
            <Button
              variant="text"
              onClick={resendCode}
              sx={{ alignSelf: "flex-start" }}
            >
              Resend Code
            </Button>
          )}
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

const getOtpTitle = (provider: string) => {
  if (provider === "sms_otp") {
    return "SMS";
  } else if (provider === "email_otp") {
    return "Email";
  } else if (provider === "totp") {
    return "TOTP App";
  } else {
    return provider;
  }
};

export default VerifyMfaCompleteView;
