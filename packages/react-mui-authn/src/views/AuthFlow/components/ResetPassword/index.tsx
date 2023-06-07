import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Stack, TextField, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";
import PasswordField, {
  checkPassword,
} from "@src/components/fields/PasswordField";

const ResetPasswordView: FC<ViewComponentProps> = ({
  data,
  loading,
  error,
  next,
  reset,
}) => {
  const [status, setStatus] = useState<any>();
  const validationSchema = yup.object({
    password: yup
      .string()
      .required("Required")
      .test(
        "password-requirements",
        "Password must meet requirements",
        checkPassword
      ),
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
      next(FlowStep.RESET_PASSWORD, payload);
    },
  });

  const cancelReset = () => {
    next(FlowStep.RESET_PASSWORD, { cancel: true });
  };

  useEffect(() => {
    setStatus(error);
  }, [error]);

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Reset Password</Typography>
        <Typography variant="body2">{data.email}</Typography>
      </Stack>
      <form
        onSubmit={formik.handleSubmit}
        onFocus={() => {
          setStatus(undefined);
        }}
      >
        <Stack gap={1}>
          <PasswordField
            name="password"
            label="Password"
            formik={formik}
            policy={data.passwordPolicy}
          />
          {error && <ErrorMessage response={error} />}
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth={true}
          >
            Submit
          </Button>
        </Stack>
      </form>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        <Button variant="text" onClick={cancelReset}>
          Cancel Reset
        </Button>
        <Button variant="text" onClick={reset}>
          Start Over
        </Button>
      </Stack>
    </Stack>
  );
};

export default ResetPasswordView;
