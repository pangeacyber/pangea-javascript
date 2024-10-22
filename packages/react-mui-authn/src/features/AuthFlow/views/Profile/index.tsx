import { FC } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Stack } from "@mui/material";
import each from "lodash/each";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { validatePhoneNumber } from "@src/utils";
import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import IdField from "@src/components/fields/IdField";
import StringField from "@src/components/fields/StringField";
import DateField from "@src/components/fields/DateField";
import Button from "@src/components/core/Button";
import { ErrorMessage } from "../../components";
import { checkForHtml } from "../../utils";
import CheckboxField from "@src/components/fields/CheckboxField";

const autoCompleteMap: { [key: string]: string } = {
  first_name: "given-name",
  last_name: "family-name",
};

const ProfileView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, error, loading, update, reset } = props;

  const validators: { [key: string]: any } = {};
  const defaultValues: { [key: string]: string } = {};

  data.profile?.fields.forEach((f: AuthFlow.ProfileField) => {
    if (f.show_on_signup) {
      defaultValues[f.id] = "";

      if (f.type === "string") {
        validators[f.id] = yup
          .string()
          .test("no-html-tags", "HTML tags are not allowed", (value) => {
            return checkForHtml(value || "");
          });
      } else if (f.type === "integer") {
        validators[f.id] = yup.number();
      } else if (f.type === "date") {
        validators[f.id] = yup.date();
      } else {
        validators[f.id] = yup.string();
      }

      if (f.type === "email") {
        validators[f.id] = validators[f.id]
          .trim()
          .email("Must be a valid email");
      } else if (f.type === "phone") {
        validators[f.id] = validators[f.id].test(
          "ValidPhoneNumber",
          "Must be a valid phone number",
          (value: string) => (!value ? true : validatePhoneNumber(value))
        );
      }

      if (f.required) {
        validators[f.id] = validators[f.id].required("Required");
      }
    }
  });

  const validationSchema = yup.object(validators);

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      // convert all values to strings
      each(values, (v: any, k: string) => {
        if (typeof v === "number") {
          values[k] = v.toString();
        } else if (typeof v === "boolean") {
          values[k] = !!v ? "true" : "false";
        }
      });

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
        <Stack gap={1} mt={1}>
          {data?.profile?.fields.map((field: AuthFlow.ProfileField) => {
            if (field.show_on_signup) {
              if (field.type === "boolean") {
                return (
                  <CheckboxField
                    name={field.id}
                    label={field.label}
                    formik={formik}
                  />
                );
              } else if (field.type === "date") {
                return (
                  <DateField
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
