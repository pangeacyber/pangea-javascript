import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, TextField, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import SocialOptions from "@src/views/AuthFlow/components/common/SocialOptions";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

const StartView: FC<ViewComponentProps> = ({
  options,
  data,
  loading,
  error,
  next,
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
        <Typography variant="body2" textAlign="center">
          Initializing...
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <Typography variant="h6" mb={1}>
        Log in or Sign up
      </Typography>
      {data.passwordSignup && (
        <form onSubmit={formik.handleSubmit}>
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
          />
          {error && <ErrorMessage response={error} />}
          <Stack direction="row" gap={2} mt={2}>
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
    </Stack>
  );
};

export default StartView;
