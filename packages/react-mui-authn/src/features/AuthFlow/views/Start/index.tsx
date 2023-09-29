import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import StringField from "@src/components/fields/StringField";
import ErrorMessage from "../../components/ErrorMessage";
import Disclaimer from "../../components/Disclaimer";
import { SocialOptions } from "../../components";

const StartView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  loading,
  error,
  update,
}) => {
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
    <Stack gap={2}>
      <Typography variant="h6">{options?.startHeading}</Typography>
      {data.setEmail && (
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
            <Button
              color="primary"
              type="submit"
              disabled={loading}
              fullWidth={true}
            >
              {options?.startButtonLabel}
            </Button>
          </Stack>
        </form>
      )}
      <SocialOptions data={data} options={options} />
      {data.disclaimer && <Disclaimer content={data.disclaimer} />}
    </Stack>
  );
};

export default StartView;
