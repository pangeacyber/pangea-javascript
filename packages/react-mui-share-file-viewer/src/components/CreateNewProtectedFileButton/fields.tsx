import {
  FieldsFormSchema,
  validatePassword,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../types";
import * as yup from "yup";
import PasswordWithGenerateField from "./PasswordWithGenerateField";
import PasswordWithMatchField from "./PasswordWithMatchField";

interface ProtectedPutRequest extends ObjectStore.PutRequest {
  retyped_password: string;
}

export const getCreateProtectedFileFields = ({
  policy,
}: {
  policy: any;
}): FieldsFormSchema<ProtectedPutRequest> => ({
  password: {
    label: "Type password",
    component: PasswordWithGenerateField,
    schema: yup
      .string()
      .test(
        "password-requirements",
        "New password does not meet requirements.",
        (value) => {
          if (value) {
            const errors = validatePassword(value, policy);
            return Object.keys(errors).length === 0;
          }
          return true;
        }
      )
      .required("Password is required."),
  },
  retyped_password: {
    label: "Re-type password",
    component: PasswordWithMatchField,
    schema: yup
      .string()
      .required("New password must be confirmed.")
      .oneOf([yup.ref("password"), ""], "Passwords must match."),
  },
});
