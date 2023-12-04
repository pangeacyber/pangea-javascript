import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import Button from "@src/components/core/Button";
import StringField from "@src/components/fields/StringField";
import ErrorMessage from "../../components/ErrorMessage";
import Disclaimer from "../../components/Disclaimer";
import { SocialOptions } from "../../components";

const StartView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, loading, error, update } = props;
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
      update(AuthFlow.Choice.SET_EMAIL, payload);
    },
  });

  return (
    <AuthFlowLayout title={options?.startHeading}>
      {!!data.setEmail && (
        <form onSubmit={formik.handleSubmit}>
          <Stack gap={1}>
            <StringField
              name="email"
              label="Email"
              formik={formik}
              autoComplete="email"
              autoFocus={true}
            />
            {error && <ErrorMessage response={error} />}
            <Button color="primary" type="submit" disabled={loading} fullWidth>
              {options?.startButtonLabel}
            </Button>
          </Stack>
        </form>
      )}
      <SocialOptions {...props} />
      {data.disclaimer && <Disclaimer content={data.disclaimer} />}
    </AuthFlowLayout>
  );
};

export default StartView;
