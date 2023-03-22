import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";

const StartView: FC<ViewComponentProps> = ({ options }) => {
  const { callNext, flowData, loading, error } = useAuthFlow();

  const socialLogin = (redirect: string) => {
    window.location.href = redirect;
  };

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        ...values,
      };
      callNext(FlowStep.START, payload);
    },
  });

  return (
    <Stack gap={2}>
      <Typography variant="h6">Log in or signup</Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
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
        </Stack>
      </form>
      {flowData.passwordSignup && flowData.socialSignup && <Divider />}
      {flowData.socialSignup?.redirect_uri && (
        <Stack gap={2}>
          {Object.keys(flowData.socialSignup.redirect_uri).map((provider) => {
            const redirect = flowData.socialSignup.redirect_uri[provider];
            return (
              <div key={provider}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    socialLogin(redirect);
                  }}
                >
                  Continue with {provider}
                </Button>
              </div>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default StartView;
