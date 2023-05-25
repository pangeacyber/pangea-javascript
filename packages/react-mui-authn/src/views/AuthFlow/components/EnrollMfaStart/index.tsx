import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, TextField, Typography } from "@mui/material";

import { FlowStep } from "@pangeacyber/react-auth";

import { ViewComponentProps } from "@src/views/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";

const EnrollMfaStartView: FC<ViewComponentProps> = ({
  options,
  data,
  loading,
  error,
  next,
  reset,
}) => {
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
        mfaProvider: data.selectedMfa,
        ...values,
      };
      next(FlowStep.ENROLL_MFA_START, payload);
    },
  });

  const selectMfaMethod = () => {
    next(FlowStep.ENROLL_MFA_SELECT, { cancel: false });
  };

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6" mb={3}>
          Enroll a Phone Number for SMS 2FA
        </Typography>
        {options.showEmail && (
          <Typography variant="body2">{data.email}</Typography>
        )}
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
        {data?.mfaProviders && data?.mfaProviders?.length > 1 && (
          <Stack direction="row" mt={3} mb={3}>
            <Button variant="text" onClick={selectMfaMethod}>
              Choose another MFA method
            </Button>
          </Stack>
        )}
        {error && <ErrorMessage response={error} />}
        <Stack direction="row" gap={2} mt={2}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth={true}
          >
            {options.submitLabel}
          </Button>
        </Stack>
        <Stack direction="row" justifyContent="center" gap={2} mt={2}>
          {options.showReset && (
            <Button variant="text" onClick={reset}>
              {options.resetLabel}
            </Button>
          )}
        </Stack>
      </form>
    </Stack>
  );
};

export default EnrollMfaStartView;
