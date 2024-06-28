import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { cleanPhoneNumber, validatePhoneNumber } from "@src/utils";
import Button from "@src/components/core/Button";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import StringField from "@src/components/fields/StringField";
import { BodyText } from "@src/components/core/Text";
import ErrorMessage from "../ErrorMessage";

const AuthOnetimePhone: FC<AuthFlowComponentProps> = (props) => {
  const { options, error, loading, update } = props;

  const validationSchema = yup.object({
    phone: yup
      .string()
      .required("Phone number is required")
      .test("ValidPhoneNumber", "Must be a valid phone number", (value) =>
        validatePhoneNumber(value)
      ),
  });

  const formik = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload: AuthFlow.PhoneParams = {
        phone: cleanPhoneNumber(values.phone),
      };
      update(AuthFlow.Choice.SET_PHONE, payload);
    },
  });

  return (
    <Stack gap={2} width="100%">
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <Stack gap={1}>
          <BodyText>Confirm your phone number.</BodyText>
          <StringField
            name="phone"
            label="Phone Number"
            formik={formik}
            autoComplete="phone"
            hideLabel={true}
            startAdornment={
              <Typography color="textSecondary" sx={{ paddingRight: 1 }}>
                +1
              </Typography>
            }
          />
          {error && <ErrorMessage response={error} />}
          <Button fullWidth color="primary" disabled={loading} type="submit">
            {options.submitLabel}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default AuthOnetimePhone;
