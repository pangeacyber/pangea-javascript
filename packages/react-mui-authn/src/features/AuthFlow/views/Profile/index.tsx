import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Checkbox, FormControlLabel, Stack } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import IdField from "@src/components/fields/IdField";
import StringField from "@src/components/fields/StringField";
import Button from "@src/components/core/Button";
import { ErrorMessage } from "../../components";
import { checkForHtml } from "../../utils";

const autoCompleteMap: { [key: string]: string } = {
  first_name: "given-name",
  last_name: "family-name",
};

const ProfileView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, error, loading, update, reset } = props;

  // FIXME: generate initial values and validation from profile data
  const validators: { [key: string]: any } = {};
  const defaultValues: { [key: string]: string } = {};

  data.profile?.fields.forEach((f: AuthFlow.ProfileField) => {
    if (f.show_on_signup && f.required) {
      if (f.type === "string") {
        validators[f.id] = yup
          .string()
          .required("Required")
          .test("no-html-tags", "HTML tags are not allowed", (value) => {
            return checkForHtml(value || "");
          });
      } else if (f.type === "integer") {
        validators[f.id] = yup.number().required("Required");
      }

      defaultValues[f.id] = "";
    }
  });

  const validationSchema = yup.object(validators);

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    validateOnBlur: true,
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
    <AuthFlowLayout title="Update your profile">
      <IdField
        value={data?.username || data?.email}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
      <form onSubmit={formik.handleSubmit}>
        <Stack gap={1}>
          {data?.profile?.fields.map((field: AuthFlow.ProfileField) => {
            if (field.show_on_signup) {
              if (field.type === "boolean") {
                // TODO: Move to component, add formik
                return (
                  <FormControlLabel
                    control={<Checkbox />}
                    label={field.label}
                    name={field.id}
                  />
                );
              } else if (field.type === "date") {
                // TODO: Add DatePicker component
                // <DemoContainer components={['DatePicker']}>
                //   <DatePicker label="Basic date picker" />
                // </DemoContainer>
                return (
                  <StringField
                    name={field.id}
                    label={field.label}
                    formik={formik}
                  />
                );
              } else if (field.type === "integer") {
                return (
                  <StringField
                    type="number"
                    name={field.id}
                    label={field.label}
                    formik={formik}
                  />
                );
              } else {
                const autoComplete =
                  field.id in autoCompleteMap ? autoCompleteMap[field.id] : "";
                return (
                  <StringField
                    name={field.id}
                    label={field.label}
                    formik={formik}
                    autoComplete={autoComplete}
                  />
                );
              }
            }
          })}
          {error && <ErrorMessage response={error} />}
          <Button color="primary" type="submit" disabled={loading} fullWidth>
            {options.submitLabel}
          </Button>
        </Stack>
      </form>
    </AuthFlowLayout>
  );
};

export default ProfileView;
