import {
  FieldsFormSchema,
  validatePassword,
} from "@pangeacyber/react-mui-shared";
import * as yup from "yup";
import find from "lodash/find";
import { ObjectStore } from "../../../types";
import ShareTypeField from "../ShareTypeField";

export const CreatePasswordShareFields: FieldsFormSchema<ObjectStore.SingleShareCreateRequest> =
  {
    link_type: {
      label: "Type",
      type: "field",
      LabelProps: {
        placement: "start",
      },
      component: ShareTypeField,
      default: "download",
      FieldProps: {
        type: "singleSelect",
        options: {
          valueOptions: ["upload", "download"],
        },
      },
    },
    password: {
      label: "Password",
      LabelProps: {
        placement: "top",
      },
      FieldProps: {
        type: "passwordWithPolicy",
        policy: undefined,
      },
      type: "unknownField",
      description:
        "Take note of the password. Once the share is created this password is no longer accessible",
      getFieldValue: (values) => {
        const passwordAuth = find(
          values?.authenticators ?? [],
          (a) => a.auth_type === ObjectStore.ShareAuthenticatorType.Password
        );
        if (passwordAuth) return passwordAuth.auth_context ?? "";

        return "";
      },
      onFieldChanged(value, values) {
        return {
          password: value,
          authenticators: [
            {
              auth_type: ObjectStore.ShareAuthenticatorType.Password,
              auth_context: value,
            },
          ],
        };
      },
      schema: yup
        .string()
        .test(
          "password-requirements",
          "Password does not meet requirements.",
          (value, context) => {
            if (value) {
              const errors = validatePassword(value);
              return Object.keys(errors).length === 0;
            }
            return true;
          }
        )
        .required("Password is required."),
    },
    expires_at: {
      label: "Expires",
      LabelProps: {
        placement: "start",
      },
      FieldProps: {
        type: "dateTime",
      },
    },
    max_access_count: {
      label: "Max views",
      LabelProps: {
        placement: "start",
      },
      FieldProps: {
        type: "number",
      },
    },
  };
