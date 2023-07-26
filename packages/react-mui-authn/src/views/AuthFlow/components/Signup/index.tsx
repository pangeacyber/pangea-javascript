import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, TextField, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import SocialOptions from "@src/views/AuthFlow/components/common/SocialOptions";
import Button from "@src/components/core/Button";
import PasswordField, {
  checkPassword,
} from "@src/components/fields/PasswordField";
import ErrorMessage from "../ErrorMessage";

const SignupView: FC<ViewComponentProps> = ({
  options,
  data,
  loading,
  error,
  next,
  reset,
}) => {
  const validationSchema = yup.object({
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    password: yup
      .string()
      .required("Required")
      .test(
        "password-requirements",
        "Password must meet requirements",
        (value) => {
          return checkPassword(value, data.passwordPolicy);
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
      };
      next(FlowStep.SIGNUP_PASSWORD, payload);
    },
  });

  const resetLabel = data.invite ? "Cancel" : options.resetLabel;

  return (
    <Stack gap={2}>
      <Typography variant="h6">Signup</Typography>
      <Typography variant="body2" mb={1} sx={{ wordBreak: "break-word" }}>
        Create an account with {data.email}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Stack gap={1}>
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            label="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
            autoComplete="given-name"
          />
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
            autoComplete="family-name"
          />
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
            fullWidth={true}
            disabled={loading}
          >
            Continue
          </Button>
        </Stack>
      </form>
      {data.invite && <SocialOptions data={data} options={options} />}
      {(options.showReset || data.invite) && (
        <Stack direction="row" justifyContent="center" gap={1}>
          <Button variant="text" onClick={reset}>
            {resetLabel}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default SignupView;
