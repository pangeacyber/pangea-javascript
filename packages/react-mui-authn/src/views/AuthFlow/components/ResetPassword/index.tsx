import { FC } from "react";
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
  options,
  data,
  loading,
  error,
  cbParams,
  next,
  reset,
}) => {
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

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6" mb={4}>
          Reset Password
        </Typography>
        <Typography variant="body2">{data.email}</Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ mt: 1 }}>
          <PasswordField
            name="password"
            label="Password"
            formik={formik}
            policy={data.passwordPolicy}
          />
        </Box>
        {error && <ErrorMessage response={error} />}
        <Stack direction="row" gap={2} mt={2}>
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
        <Stack direction="row" justifyContent="center" gap={2}>
          <Button variant="text" onClick={cancelReset}>
            Cancel Reset
          </Button>
          <Button variant="text" onClick={reset}>
            Start Over
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default ResetPasswordView;
