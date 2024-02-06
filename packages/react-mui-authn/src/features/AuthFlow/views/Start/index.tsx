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
import { BodyText } from "@src/components/core/Text";

const StartView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, loading, error, update } = props;
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
    <AuthFlowLayout
      title={
        data?.flowType.includes("signup")
          ? options?.startHeading
          : options?.passwordHeading
      }
    >
      {!!data.setEmail?.required_for && (
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
      {data.authChoices.length === 0 &&
        data.socialChoices.length === 0 &&
        data.samlChoices.length === 0 && (
          <BodyText color="error" sxProps={{ padding: "0 16px" }}>
            There are no valid authentication methods available
          </BodyText>
        )}
      <SocialOptions {...props} />
      {data.disclaimer && <Disclaimer content={data.disclaimer} />}
    </AuthFlowLayout>
  );
};

export default StartView;
