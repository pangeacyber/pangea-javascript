import { FC, ReactElement } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Stack, TextField, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import SocialOptions from "@src/views/AuthFlow/components/common/SocialOptions";
import Button from "@src/components/core/Button";
import PasswordField from "@src/components/fields/PasswordField";
import ErrorMessage from "../ErrorMessage";

interface SignupViewProps extends ViewComponentProps {
  disclaimer?: ReactElement;
}

const SignupView: FC<SignupViewProps> = ({
  options,
  data,
  loading,
  error,
  next,
  reset,
  disclaimer,
}) => {
  const validationSchema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("First name is required"),
    password: yup.string().min(8, "Must be at least 8 characters"),
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
      <Typography variant="h6" mb={1}>
        Signup
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
        Create an account with {data.email}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="firstName"
          name="firstName"
          label="First Name"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
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
          sx={{ marginTop: 1 }}
        />
        <Box sx={{ mt: 1 }}>
          <PasswordField
            name="password"
            label="Password"
            formik={formik}
            policy={data.passwordPolicy}
          />
        </Box>
        {disclaimer && <>{disclaimer}</>}
        {error && <ErrorMessage response={error} />}
        <Stack direction="row" gap={2} mt={2}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            fullWidth={true}
            disabled={loading}
          >
            Create account
          </Button>
        </Stack>
      </form>
      {data.invite && <SocialOptions data={data} options={options} />}
      {(options.showReset || data.invite) && (
        <Stack direction="row" justifyContent="center" gap={2} mt={2}>
          <Button variant="text" onClick={reset}>
            {resetLabel}
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default SignupView;
