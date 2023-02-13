import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

const EnrollMfaStartView = () => {
  const { callNext, reset, flowData, loading, error } = useAuthFlow();

  const validationSchema = yup.object({
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^[+]?[1-9][-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
        "Must be a valid phone number"
      ),
  });

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = {
        mfaProvider: flowData.selectedMfa,
        ...values,
      };
      callNext(FlowStep.ENROLL_MFA_START, payload);
    },
  });

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Enroll a Phone Number for SMS 2FA</Typography>
        <Typography variant="caption">{flowData.email}</Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="phoneNumber"
          name="phoneNumber"
          label="Phone Number"
          type="text"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          error={
            formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
          }
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
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

export default EnrollMfaStartView;
