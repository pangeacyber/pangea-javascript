import { FC, useMemo } from "react";
import { useFormik, FormikProps, FormikValues } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import {
  cleanPhoneNumber,
  validatePhoneNumber,
  validateUsername,
} from "@src/utils";
import AuthFlowLayout from "../Layout";
import Button from "@src/components/core/Button";
import StringField from "@src/components/fields/StringField";
import ErrorMessage from "../../components/ErrorMessage";
import Disclaimer from "../../components/Disclaimer";
import { SocialOptions } from "../../components";
import { BodyText } from "@src/components/core/Text";
import PasskeyAuth from "../../components/PasskeyAuth";

const getValidationSchema = (usernameFormat: string) => {
  if (usernameFormat === AuthFlow.UsernameFormat.PHONE) {
    return yup.object({
      phone: yup
        .string()
        .required("Required")
        .test("ValidPhoneNumber", "Enter a valid phone number", (value) =>
          validatePhoneNumber(value)
        ),
    });
  }

  if (usernameFormat === AuthFlow.UsernameFormat.STRING) {
    return yup.object({
      username: yup
        .string()
        .required("Required")
        .test("ValidUsername", "Enter a valid username", (value) =>
          validateUsername(value)
        ),
    });
  }

  // default to email format
  return yup.object({
    email: yup.string().required("Required").email("Enter a valid email"),
  });
};

const getUsernameField = (
  formik: FormikProps<FormikValues>,
  usernameFormat: string,
  passkeyEnabled: boolean
) => {
  if (usernameFormat == AuthFlow.UsernameFormat.STRING) {
    return (
      <StringField
        name="username"
        label="Username"
        formik={formik}
        autoComplete={passkeyEnabled ? "username webauthn" : "username"}
        autoFocus={true}
        hideLabel={true}
      />
    );
  }

  if (usernameFormat == AuthFlow.UsernameFormat.PHONE) {
    return (
      <StringField
        name="phone"
        label="Phone Number"
        formik={formik}
        autoComplete={passkeyEnabled ? "phone webauthn" : "phone"}
        autoFocus={true}
        hideLabel={true}
        startAdornment={
          <Typography color="textSecondary" sx={{ paddingRight: 1 }}>
            +1
          </Typography>
        }
      />
    );
  }

  return (
    <StringField
      name="email"
      type="email"
      label="Email"
      formik={formik}
      autoComplete={passkeyEnabled ? "email webauthn" : "email"}
      autoFocus={true}
      hideLabel={true}
    />
  );
};

const StartView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, loading, error, update } = props;
  const passkeyEnabled = !!data?.passkey && browserSupportsWebAuthn();
  const usernameFormat = data?.usernameFormat || AuthFlow.UsernameFormat.EMAIL;
  const usernameKey = usernameFormat === "string" ? "username" : usernameFormat;

  const formik = useFormik({
    initialValues: {
      [usernameKey]: "",
    },
    validationSchema: getValidationSchema(usernameFormat),
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload: any = {};

      if ("email" in values) {
        payload.email = values.email;
      } else if ("phone" in values) {
        payload.username = cleanPhoneNumber(values.phone);
      } else if ("username" in values) {
        payload.username = values.username;
      }

      update(
        usernameFormat === AuthFlow.UsernameFormat.EMAIL
          ? AuthFlow.Choice.SET_EMAIL
          : AuthFlow.Choice.SET_USERNAME,
        payload
      );
    },
  });

  const startButtonLabel = useMemo(() => {
    // if format is not email and label contains email, return generic label
    if (
      data.usernameFormat !== "email" &&
      options?.startButtonLabel?.match(/email/i)
    ) {
      return "Continue";
    }
    return options?.startButtonLabel;
  }, [options]);

  return (
    <AuthFlowLayout
      title={
        data?.flowType.includes("signup")
          ? options?.startHeading
          : options?.passwordHeading
      }
    >
      {(!!data.setEmail?.required_for || !!data.setUsername?.required_for) && (
        <form onSubmit={formik.handleSubmit}>
          <Stack gap={1}>
            {getUsernameField(formik, usernameFormat, passkeyEnabled)}
            {error && <ErrorMessage response={error} />}
            <Button color="primary" type="submit" disabled={loading} fullWidth>
              {startButtonLabel}
            </Button>
          </Stack>
        </form>
      )}
      {data.authChoices.length === 0 &&
        data.socialChoices.length === 0 &&
        data.samlChoices.length === 0 &&
        !data.setEmail?.required_for &&
        !data.setUsername?.required_for &&
        !data.passkey && (
          <BodyText color="error" sxProps={{ padding: "0 16px" }}>
            There are no valid authentication methods available
          </BodyText>
        )}
      <PasskeyAuth {...props} />
      <SocialOptions {...props} />
      {data.disclaimer && <Disclaimer content={data.disclaimer} />}
    </AuthFlowLayout>
  );
};

export default StartView;
