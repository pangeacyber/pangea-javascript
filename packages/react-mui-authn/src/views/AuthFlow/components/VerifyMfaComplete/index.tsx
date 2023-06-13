import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import CodeField from "@src/components/fields/CodeField";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";
import { getOtpTitle } from "@src/views/AuthFlow/utils";

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
      .matches(/^[0-9]+$/, "Must be only digits"),
    // Skip checking length validation. As it is auto-check by enforcing 6 input boxes
    // .length(6, "Code must be 6 digits"),
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
      <Typography variant="h6">Enter {provider} Code</Typography>
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
            Choose another way
          </Button>
        )}
        <Button variant="text" onClick={reset}>
          {options.resetLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default VerifyMfaCompleteView;
