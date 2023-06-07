import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";
import Button from "@src/components/core/Button";
import PasswordField from "@src/components/fields/PasswordField";

const VerifyPasswordView: FC<ViewComponentProps> = ({
  options,
  data,
  loading,
  error,
  next,
  reset,
}) => {
  const [status, setStatus] = useState<any>();
  const validationSchema = yup.object({
    password: yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
      };
      next(FlowStep.VERIFY_PASSWORD, payload);
    },
  });

  const resetPassword = () => {
    next(FlowStep.VERIFY_PASSWORD, { reset: true });
  };

  useEffect(() => {
    setStatus(error);
  }, [error]);

  return (
    <Stack gap={2}>
      <Typography variant="h6">Welcome back!</Typography>
      <Stack gap={1}>
        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
          Enter password for {data.email}
        </Typography>
        <form
          onSubmit={formik.handleSubmit}
          onFocus={() => {
            setStatus(undefined);
          }}
        >
          <Stack gap={1}>
            <PasswordField name="password" label="Password" formik={formik} />
            {status && <ErrorMessage response={status} />}
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={loading}
              fullWidth={true}
            >
              Sign in
            </Button>
          </Stack>
        </form>
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={resetPassword}>
          Forgot your password?
        </Button>
        {options.showReset && (
          <Button variant="text" onClick={reset}>
            {options.resetLabel}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default VerifyPasswordView;
