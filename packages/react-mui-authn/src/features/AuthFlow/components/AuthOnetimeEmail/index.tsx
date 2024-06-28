import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import Button from "@src/components/core/Button";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import StringField from "@src/components/fields/StringField";
import { BodyText } from "@src/components/core/Text";
import ErrorMessage from "../ErrorMessage";

const AuthOnetimeEmail: FC<AuthFlowComponentProps> = (props) => {
  const { options, error, loading, update } = props;

  const validationSchema = yup.object({
    email: yup.string().required("Required").email("Enter a valid email"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload = {
        ...values,
      };
      update(AuthFlow.Choice.SET_EMAIL, payload);
    },
  });

  return (
    <Stack gap={2} width="100%">
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <Stack gap={1}>
          <BodyText>Confirm your email.</BodyText>
          <StringField
            name="email"
            label="Email"
            formik={formik}
            autoComplete="email"
            autoFocus={true}
            hideLabel={true}
          />
          {error && <ErrorMessage response={error} />}
          <Button color="primary" type="submit" disabled={loading} fullWidth>
            {options?.otpButtonLabel}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default AuthOnetimeEmail;
