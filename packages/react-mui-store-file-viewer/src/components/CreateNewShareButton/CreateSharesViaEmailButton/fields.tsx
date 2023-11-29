import {
  FieldsFormSchema,
  validatePassword,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import ShareTypeField from "../ShareTypeField";
import ShareEmailsField from "../ShareEmailsField";
import * as yup from "yup";

export const CreateEmailShareFields: FieldsFormSchema<ObjectStore.SingleShareCreateRequest> =
  {
    link_type: {
      label: "Type",
      type: "field",
      LabelProps: {
        placement: "start",
        minWidth: "180px",
      },
      component: ShareTypeField,
      default: "download",
      FieldProps: {
        type: "singleSelect",
        options: {
          valueOptions: [
            {
              label: "Upload",
              value: "upload",
            },
            {
              label: "Download",
              value: "download",
            },
          ],
        },
      },
    },
    expires_at: {
      label: "Expires",
      LabelProps: {
        placement: "start",
        minWidth: "180px",
      },
      FieldProps: {
        type: "dateTime",
      },
    },
    max_access_count: {
      label: "Max views per recipient",
      LabelProps: {
        placement: "start",
        minWidth: "180px",
      },
      FieldProps: {
        type: "number",
      },
    },
    authenticators: {
      label: "",
      LabelProps: {
        placement: "top",
      },
      component: ShareEmailsField,
      // type: "unknownField",
      schema: yup
        .array()
        .min(1, "At least one email is required")
        .required("At least one email is required"),
      getFieldValue: (values) => {
        return (values?.authenticators ?? []).map((a) => a.auth_context);
      },
      onFieldChanged(value, values) {
        // @ts-ignore
        const value_: string[] = value;
        return {
          authenticators: value_.map((email) => ({
            auth_type: ObjectStore.ShareAuthenticatorType.Email,
            auth_context: email,
          })),
        };
      },
    },
  };
