import {
  FieldsFormSchema,
  validatePassword,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import ShareTypeField from "../ShareTypeField";
import ShareEmailsField from "../ShareEmailsField";
import SharePhonesField from "../SharePhonesField";
import * as yup from "yup";

export const CreatePhoneShareFields: FieldsFormSchema<ObjectStore.SingleShareCreateRequest> =
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
    authenticators: {
      label: "",
      LabelProps: {
        placement: "top",
      },
      component: SharePhonesField,
      // type: "unknownField",
      schema: yup
        .array()
        .min(1, "At least one phone number is required")
        .required("At least one phone number is required"),
      getFieldValue: (values) => {
        return (values?.authenticators ?? []).map((a) => a.auth_context);
      },
      onFieldChanged(value, values) {
        // @ts-ignore
        const value_: string[] = value;
        return {
          authenticators: value_.map((phone) => ({
            auth_type: ObjectStore.ShareAuthenticatorType.Sms,
            auth_context: phone,
          })),
        };
      },
    },
  };
