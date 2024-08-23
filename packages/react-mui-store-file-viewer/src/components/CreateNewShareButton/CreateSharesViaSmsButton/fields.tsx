import {
  FieldsFormSchema,
  validatePassword,
} from "@pangeacyber/react-mui-shared";
import some from "lodash/some";

import { ObjectStore } from "../../../types";
import ShareTypeField from "../ShareTypeField";
import SharePhonesField from "../SharePhonesField";
import * as yup from "yup";

interface PhoneValue {
  phone_number: string;
  recipient: string;
}

export const CreatePhoneShareFields: FieldsFormSchema<ObjectStore.SingleShareCreateRequest> =
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
          valueOptions: ["upload", "download"],
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
      component: SharePhonesField,
      schema: yup
        .array()
        .min(1, "At least one phone number is required")
        .test(
          "valid-recipient",
          "Phone numbers email recipient must be valid",
          async function (value) {
            const isInvalid = await Promise.all(
              (value ?? []).map(async (p: PhoneValue) =>
                yup
                  .string()
                  .trim()
                  .email()
                  .isValid(p.recipient)
                  .then((isValid) => !isValid)
              )
            ).then((arr) => some(arr));

            return !isInvalid;
          }
        )
        .required("At least one phone number is required"),
      getFieldValue: (values) => {
        return (values?.authenticators ?? []).map((a) => ({
          phone_number: a.auth_context,
          // @ts-ignore Internal field our sending SMS
          recipient: a.recipient,
        }));
      },
      onFieldChanged(value, values) {
        // @ts-ignore
        const value_: PhoneValue[] = value;
        return {
          authenticators: value_.map((phone) => ({
            auth_type: ObjectStore.ShareAuthenticatorType.Sms,
            auth_context: phone.phone_number,
            // @ts-ignore Internal field our sending SMS
            recipient: phone.recipient,
          })),
        };
      },
    },
  };
