import { FC, ReactElement } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, TextField, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import SocialOptions from "@src/views/AuthFlow/components/common/SocialOptions";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

interface StartViewProps extends ViewComponentProps {
  disclaimer?: ReactElement;
}

const StartView: FC<StartViewProps> = ({
  options,
  data,
  loading,
  error,
  next,
  disclaimer,
}) => {
  const validationSchema = yup.object({
    email: yup.string().email("Enter a valid email").required("Required"),
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

  if (loading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "200px" }}
      >
        <Typography variant="body2">Initializing...</Typography>
      </Stack>
    );
  } else if (!data.passwordSignup && !(data.socialSignup?.length > 0)) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "200px" }}
      >
        <Typography variant="body2">Initializing...</Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <Typography variant="h6">Log in or Sign up</Typography>
      {data.passwordSignup && (
        <form onSubmit={formik.handleSubmit}>
          <Stack gap={1}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              autoCapitalize="none"
              autoCorrect="off"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              autoComplete="email"
            />
            {error && <ErrorMessage response={error} />}

            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={loading}
              fullWidth={true}
            >
              Continue with email
            </Button>
          </Stack>
        </form>
      )}
      <SocialOptions data={data} options={options} />
      {disclaimer && <>{disclaimer}</>}
    </Stack>
  );
};

export default StartView;
