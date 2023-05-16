import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Stack, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import CodeField from "@src/components/fields/CodeField";
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
      <Stack>
        <Typography variant="h6">Enter {provider} Code</Typography>
        {options.showEmail && (
          <Typography variant="caption">{data.email}</Typography>
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
            {options.submitLabel}
          </Button>
          <Button color="primary" variant="outlined" onClick={reset}>
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
