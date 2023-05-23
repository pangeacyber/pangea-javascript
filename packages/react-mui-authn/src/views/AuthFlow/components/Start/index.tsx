import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Stack, TextField, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import { getProviderIcon, getProviderLabel } from "@src/views/AuthFlow/utils";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

interface Provider {
  provider: string;
  redirect_uri: string;
}

const StartView: FC<ViewComponentProps> = ({
  options,
  data,
  loading,
  error,
  next,
}) => {
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
      next(FlowStep.START, payload);
    },
  });

  return (
    <Stack gap={2}>
      <Typography variant="h6" mb={3}>
        Log in or signup
      </Typography>
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
        <Stack direction="row" gap={2} mt={2} mb={2}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth={true}
          >
            Continue with email
            {/* {options.submitLabel} */}
          </Button>
        </Stack>
      </form>
      {data.socialSignup?.length > 0 && (
        <Stack gap={2}>
          {data.socialSignup.map((provider: Provider) => {
            return (
              <Button
                variant="contained"
                color="secondary"
                fullWidth={true}
                onClick={() => {
                  socialLogin(provider.redirect_uri);
                }}
                key={provider.provider}
              >
                {options.showSocialIcons && (
                  <>
                    {getProviderIcon(provider.provider)}
                    <Box component="span" sx={{ marginRight: 1 }} />
                  </>
                )}
                Continue with {getProviderLabel(provider.provider)}
              </Button>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default StartView;
