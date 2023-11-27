import {
  FieldsFormSchema,
  validatePassword,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import ShareTypeField from "../ShareTypeField";
import ShareEmailsField from "../ShareEmailsField";
import * as yup from "yup";

export const ShareShareViaEmailFields: FieldsFormSchema<ObjectStore.ShareSendRequest> =
  {
    links: {
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
        return (values?.links ?? []).map((l) => l.email);
      },
      onFieldChanged(value, values) {
        // @ts-ignore
        const value_: string[] = value;
        return {
          links: value_.map((email) => ({
            id: "",
            email,
          })),
        };
      },
    },
  };
