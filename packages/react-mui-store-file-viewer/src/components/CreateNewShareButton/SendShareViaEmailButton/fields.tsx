import { FieldsFormSchema } from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import * as yup from "yup";
import EmailPasswordShareField from "./EmailPasswordShareField";
import EmailEmailShareField from "./EmailEmailShareField";
import EmailSmsShareField from "./EmailSmsShareField";

export const SharePasswordShareViaEmailFields: FieldsFormSchema<ObjectStore.ShareSendRequest> =
  {
    links: {
      label: "",
      LabelProps: {
        placement: "top",
      },
      component: EmailPasswordShareField,
      schema: yup.object({}),
    },
  };

export const ShareEmailShareViaEmailFields: FieldsFormSchema<ObjectStore.ShareSendRequest> =
  {
    links: {
      label: "",
      LabelProps: {
        placement: "top",
      },
      component: EmailEmailShareField,
      schema: yup.object({}),
    },
  };

export const ShareSmsShareViaEmailFields: FieldsFormSchema<ObjectStore.ShareSendRequest> =
  {
    links: {
      label: "",
      LabelProps: {
        placement: "top",
      },
      component: EmailSmsShareField,
      schema: yup.object({
        email: yup.string().trim().email("Must be a valid email address"),
      }),
    },
  };
