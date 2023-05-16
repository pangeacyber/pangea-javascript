import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Stack, TextField, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";

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
    password: yup.string().min(8, "Must be at least 8 characters"),
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

  // TODO: This should be a separate flow state
  if (!cbParams) {
    return (
      <Stack gap={2}>
        <Stack>
          <Typography variant="h6">Reset Password</Typography>
          {options.showEmail && (
            <Typography variant="caption">{data.email}</Typography>
          )}
        </Stack>
        <Typography variant="body1">
          An email message has been sent to your inbox, click the link to reset
          your password.
        </Typography>
        {error && <ErrorMessage response={error} />}
        <Stack direction="row" gap={2} mt={2}>
          <Button variant="contained" color="secondary" onClick={cancelReset}>
            Cancel Reset
          </Button>
          {options.showReset && (
            <Button variant="outlined" color="secondary" onClick={reset}>
              {options.resetLabel}
            </Button>
          )}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Reset Password</Typography>
        <Typography variant="caption">{data.email}</Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
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
            Submit
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={cancelReset}
            sx={{ alignSelf: "flex-start" }}
          >
            Cancel Reset
          </Button>
          <Button color="primary" variant="outlined" onClick={reset}>
            Start Over
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default ResetPasswordView;
