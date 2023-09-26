import { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import ErrorMessage from "../ErrorMessage";
import Button from "@src/components/core/Button";
import PasswordField, {
  checkPassword,
} from "@src/components/fields/PasswordField";

const AuthPassword: FC<AuthFlowComponentProps> = ({
  options,
  data,
  loading,
  error,
  update,
}) => {
  const [status, setStatus] = useState<any>();
  const enrollment = !!data?.password?.enrollment;
  const passwordPolicy = enrollment
    ? { ...data?.password?.password_policy }
    : null;
  const validationSchema = yup.object({
    password: enrollment
      ? yup
          .string()
          .required("Required")
          .test(
            "password-requirements",
            "Password must meet requirements",
            (value) => {
              return checkPassword(value, passwordPolicy);
            }
          )
      : yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload: AuthFlow.PasswordParams = {
        ...values,
      };
      update(AuthFlow.Choice.PASSWORD, payload);
    },
  });

  useEffect(() => {
    setStatus(error);
  }, [error]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      onFocus={() => {
        setStatus(undefined);
      }}
    >
      <Stack gap={1}>
        <PasswordField
          name="password"
          label="Password"
          formik={formik}
          policy={passwordPolicy}
        />
        {status && <ErrorMessage response={status} />}
        <Button
          color="primary"
          type="submit"
          disabled={loading}
          fullWidth={true}
        >
          {options.passwordButtonLabel}
        </Button>
      </Stack>
    </form>
  );
};

export default AuthPassword;
