import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

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
        {error && <Box sx={{ color: "red" }}>{error.summary}</Box>}
        <Stack direction="row" gap={2} my={2}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            Submit
          </Button>
          <Button
            variant="text"
            onClick={reset}
            sx={{ alignSelf: "flex-start" }}
          >
            Start Over
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default VerifyPasswordView;
