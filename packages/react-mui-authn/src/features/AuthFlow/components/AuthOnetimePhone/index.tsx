import { FC, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import Button from "@src/components/core/Button";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import StringField from "@src/components/fields/StringField";
import { BodyText } from "@src/components/core/Text";
import ErrorMessage from "../ErrorMessage";

const PHONE_REGEXP =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|(1|[0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const AuthOnetimePhone: FC<AuthFlowComponentProps> = (props) => {
  const { options, error, loading, update } = props;

  const startsWithOne = (val: string) => /^(1|\+1).*/.test(val);

  const validationSchema = yup.object({
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(PHONE_REGEXP, "Must be a valid phone number"),
  });

  const formik = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      let number = values.phone.replace(/[()]/g, ""); // remove  parentheses
      if (!startsWithOne(number)) {
        number = `+1${number}`;
      }
      const payload: AuthFlow.PhoneParams = {
        phone: number,
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
