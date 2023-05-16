import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";
import GoogleIcon from "@src/components/Icons/google";
import GitHubIcon from "@src/components/Icons/github";
import MicrosoftIcon from "@src/components/Icons/microsoft";
import FacebookIcon from "@src/components/Icons/facebook";

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case "google":
      return <GoogleIcon />;
    case "github":
      return <GitHubIcon />;
    case "microsoftonline":
      return <MicrosoftIcon />;
    case "facebook":
      return <FacebookIcon />;
    default:
      return <></>;
  }
};

const getProviderLabel = (provider: string) => {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "microsoftonline":
      return "Microsoft";
    case "facebook":
      return "Facebook";
    default:
      return provider;
  }
};

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
      {data.passwordSignup && data.socialSignup && <Divider />}
      {data.socialSignup?.redirect_uri && (
        <Stack gap={2}>
          {Object.keys(data.socialSignup.redirect_uri).map((provider) => {
            const redirect = data.socialSignup.redirect_uri[provider];
            return (
              <Button
                variant="outlined"
                fullWidth={true}
                onClick={() => {
                  socialLogin(redirect);
                }}
                key={provider}
              >
                {options.showSocialIcons && (
                  <>
                    {getProviderIcon(provider)}
                    <Box component="span" sx={{ marginRight: 1 }} />
                  </>
                )}
                Continue with {getProviderLabel(provider)}
              </Button>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default StartView;
