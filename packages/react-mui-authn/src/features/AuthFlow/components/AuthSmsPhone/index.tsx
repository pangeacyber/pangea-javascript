import { FC, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import Button from "@src/components/core/Button";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import StringField from "@src/components/fields/StringField";
import ErrorMessage from "../ErrorMessage";
import { BodyText } from "@src/components/core/Text";

const AuthSmsPhone: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, error, loading, reset, restart } = props;

  const sendCode = () => {
    restart(AuthFlow.Choice.SMS_OTP);
  };

  useEffect(() => {
    if (data.smsOtp?.sent === false && !data.smsOtp?.need_phone) {
      sendCode();
    }
  }, []);

  const startsWithOne = (val: string) => /^(1|\+1).*/.test(val);

  const validationSchema = yup.object({
    phone: yup
      .string()
      .required("Phone number is required")
      .test("Starts with 1", "Must start with 1 or +1", (value) =>
        startsWithOne(value)
      )
      .matches(
        /^[+]?[1-9][-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
        "Must be a valid phone number"
      ),
  });

  const formik = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload: AuthFlow.SmsOtpRestart = {
        phone: values.phone.replace(/[()]/g, ""), // remove parentheses
      };
      restart(AuthFlow.Choice.SMS_OTP, payload);
    },
  });

  return (
    <Stack gap={2} width="100%">
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <Stack gap={1}>
          <BodyText>Enroll a phone number.</BodyText>
          <StringField
            name="phone"
            label="Phone Number"
            formik={formik}
            autoComplete="phone"
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

export default AuthSmsPhone;
