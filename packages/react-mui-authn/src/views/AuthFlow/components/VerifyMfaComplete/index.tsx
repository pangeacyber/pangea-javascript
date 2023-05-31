import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import CodeField from "@src/components/fields/CodeField";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

const VerifyMfaCompleteView: FC<ViewComponentProps> = ({
  options,
  data,
  loading,
  error,
  next,
  reset,
}) => {
  const provider = getOtpTitle(data.mfaProviders ? data.mfaProviders[0] : "");

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
      next(FlowStep.VERIFY_MFA_COMPLETE, payload);
    },
  });

  // const resendCode = () => {
  //   const payload = {
  //     mfaProvider: data.selectedMfa,
  //     code: "",
  //     cancel: true,
  //   };
  //   callNext(FlowStep.VERIFY_MFA_COMPLETE, payload);
  // };

  const selectMfaMethod = () => {
    next(FlowStep.VERIFY_MFA_SELECT, { cancel: true });
  };

  return (
    <Stack gap={2}>
      <Typography variant="h6" mb={1}>
        Enter {provider} Code
      </Typography>
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
              Choose another way
            </Button>
          )}
          <Button variant="text" onClick={reset}>
            {options.resetLabel}
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
