import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import StringField from "@src/components/fields/StringField";
import ErrorMessage from "../ErrorMessage";

interface Props extends AuthFlowComponentProps {
  choice: AuthFlow.RestartChoice;
}

const EmailForm: FC<Props> = ({
  options,
  loading,
  error,
  data,
  restart,
  choice,
}) => {
  const formik = useFormik({
    initialValues: {
      email: data?.email || "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Required").email("Enter a valid email"),
    }),
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload: any = {
        ...values,
      };

      restart(choice, payload);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap={1} width="100%">
        <StringField
          name="email"
          type="email"
          label="Email"
          formik={formik}
          autoFocus={true}
        />
        {error && <ErrorMessage response={error} />}
        <Button color="primary" type="submit" disabled={loading} fullWidth>
          {options?.startButtonLabel}
        </Button>
      </Stack>
    </form>
  );
};

export default EmailForm;
