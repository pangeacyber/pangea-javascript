import { FC } from "react";
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
  const validationSchema = yup.object({
    password: yup.string().required("Password is required"),
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

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6" mb={1}>
          Welcome back!
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "left", wordBreak: "break-word" }}
        >
          Enter password for {data.email}
        </Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <PasswordField name="password" label="Password" formik={formik} />
        {error && <ErrorMessage response={error} />}
        <Stack direction="row" gap={2} mt={2}>
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
        <Stack direction="row" justifyContent="center" gap={2} mt={2}>
          <Button variant="text" onClick={resetPassword}>
            Forgot your password?
          </Button>
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

export default VerifyPasswordView;
