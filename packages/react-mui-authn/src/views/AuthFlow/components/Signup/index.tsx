import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Stack, TextField, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";

const SignupView: FC<ViewComponentProps> = ({ options }) => {
  const { callNext, reset, flowData, loading, error } = useAuthFlow();

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
      callNext(FlowStep.SIGNUP_PASSWORD, payload);
    },
  });

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Signup</Typography>
        {options.showEmail && (
          <Typography variant="caption">{flowData.email}</Typography>
        )}
      </Stack>
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
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ marginTop: 1 }}
        />
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
          {options.showReset && (
            <Button color="primary" variant="outlined" onClick={reset}>
              {options.resetLabel}
            </Button>
          )}
        </Stack>
      </form>
    </Stack>
  );
};

export default SignupView;
