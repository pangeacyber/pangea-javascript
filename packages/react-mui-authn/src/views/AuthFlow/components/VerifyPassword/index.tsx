import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Stack, TextField, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

import ErrorMessage from "../ErrorMessage";

const VerifyPasswordView = () => {
  const { callNext, reset, flowData, loading, error } = useAuthFlow();

  const validationSchema = yup.object({
    password: yup.string().required("Password is required"),
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
      callNext(FlowStep.VERIFY_PASSWORD, payload);
    },
  });

  const resetPassword = () => {
    callNext(FlowStep.VERIFY_PASSWORD, { reset: true });
  };

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Log in</Typography>
        <Typography variant="caption">{flowData.email}</Typography>
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
          <Button color="primary" variant="outlined" onClick={reset}>
            Start Over
          </Button>
        </Stack>
        <Stack direction="row" gap={2} mt={2}>
          <Button variant="text" onClick={resetPassword}>
            Forgot your password?
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default VerifyPasswordView;
