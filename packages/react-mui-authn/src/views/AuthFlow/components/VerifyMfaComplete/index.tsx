import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Stack, TextField, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import ErrorMessage from "../ErrorMessage";

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

  // const resendCode = () => {
  //   const payload = {
  //     mfaProvider: flowData.selectedMfa,
  //     code: "",
  //     cancel: true,
  //   };
  //   callNext(FlowStep.VERIFY_MFA_COMPLETE, payload);
  // };

  const selectMfaMethod = () => {
    callNext(FlowStep.VERIFY_MFA_SELECT, {});
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
        {flowData?.mfaProviders && flowData?.mfaProviders?.length > 1 && (
          <Stack direction="row" mt={3} mb={3}>
            <Button variant="text" onClick={selectMfaMethod}>
              Choose another way
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
          >
            Submit
          </Button>
          {/* {error?.status === "MfaCodeExpired" && (
            <Button
              variant="text"
              onClick={resendCode}
              sx={{ alignSelf: "flex-start" }}
            >
              Resend Code
            </Button>
          )} */}
          <Button color="primary" variant="outlined" onClick={reset}>
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
    return "Authenticator App";
  } else {
    return provider;
  }
};

export default VerifyMfaCompleteView;
