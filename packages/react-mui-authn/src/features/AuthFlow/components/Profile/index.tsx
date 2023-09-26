import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack, TextField } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import ErrorMessage from "../ErrorMessage";
import { checkForHtml } from "@src/features/AuthFlow/utils";

const Profile: FC<AuthFlowComponentProps> = ({
  options,
  data,
  loading,
  error,
  update,
}) => {
  const validationSchema = yup.object({
    firstName: yup
      .string()
      .required("Required first")
      .test("no-html-tags", "HTML tags are not allowed", (value) => {
        return checkForHtml(value || "");
      }),
    lastName: yup
      .string()
      .required("Required last")
      .test("no-html-tags", "HTML tags are not allowed", (value) => {
        return checkForHtml(value);
      }),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload: AuthFlow.ProfileParams = {
        profile: {
          ...values,
        },
      };
      update(AuthFlow.Choice.PROFILE, payload);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap={1}>
        <TextField
          fullWidth
          id="firstName"
          name="firstName"
          label="First Name"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
          autoComplete="given-name"
        />
        <TextField
          fullWidth
          id="lastName"
          name="lastName"
          label="Last Name"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
          autoComplete="family-name"
        />
        {error && <ErrorMessage response={error} />}
        <Button
          color="primary"
          type="submit"
          fullWidth={true}
          disabled={loading}
        >
          {options.signupButtonLabel}
        </Button>
      </Stack>
    </form>
  );
};

export default Profile;
