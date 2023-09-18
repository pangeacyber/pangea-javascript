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
        mfaProvider: "sms_otp",
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
        <Typography variant="h6">Enroll a Phone Number for SMS 2FA</Typography>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <Stack gap={1}>
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
          {error && <ErrorMessage response={error} />}
          <Button
            color="primary"
            type="submit"
            disabled={loading}
            fullWidth={true}
          >
            {options.submitLabel}
          </Button>
        </Stack>
      </form>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={{ xs: 0, sm: 1 }}
      >
        {data?.mfaProviders && data?.mfaProviders?.length > 1 && (
          <Button variant="text" onClick={selectMfaMethod}>
            Choose another MFA method
          </Button>
        )}
        <Button variant="text" onClick={reset}>
          {options.cancelLabel}
        </Button>
      </Stack>
    </Stack>
  );
};

export default EnrollMfaStartView;
