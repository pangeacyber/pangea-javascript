import {
  FieldsFormSchema,
  validatePassword,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import * as yup from "yup";
import ShareAuthenticatorField from "./ShareAuthenticatorField";
import ShareLinkTypeField from "./ShareLinkTypeField";

export const ShareSettingsFields: FieldsFormSchema<ObjectStore.SingleShareCreateRequest> =
  {
    expires_at: {
      label: "Expiration",
      LabelProps: {
        placement: "top",
        minWidth: "180px",
      },
      FieldProps: {
        type: "dateTime",
      },
    },
    max_access_count: {
      label: "View count",
      LabelProps: {
        placement: "top",
        minWidth: "180px",
      },
      FieldProps: {
        type: "number",
      },
    },
  };

export interface ShareCreateForm extends ObjectStore.SingleShareCreateRequest {
  authenticatorType: string;
  contentType: string | ObjectStore.ObjectType;
}

export const getCreateShareFields = (): FieldsFormSchema<ShareCreateForm> => {
  return {
    authenticators: {
      label: "",
      LabelProps: {
        placement: "top",
      },
      component: ShareAuthenticatorField,
      schema: yup
        .array()
        .min(1, "At least one authenticator is required")
        .required("At least one authenticator is required"),
      getFieldValue: (values) => {
        return {
          authenticators: values?.authenticators ?? [],
          authenticatorType: values?.authenticatorType,
        };
      },
      onFieldChanged(value, values) {
        // @ts-ignore
        const value_: any = value;
        return {
          ...value_,
        };
      },
    },
    title: {
      label: "Title",
      LabelProps: {
        placement: "start",
        info: "The recipient will see this in emails and after gaining access.",
        FormControlLabelSx: {
          ".MuiStack-root": {
            alignItems: "end",
          },
        },
      },
    },
    message: {
      label: "Message",
      LabelProps: {
        placement: "start",
        info: "The recipient will see this in emails and after gaining access.",
        FormControlLabelSx: {
          alignItems: "baseline",
          ".MuiStack-root": {
            alignItems: "end",
          },
        },
      },
      FieldProps: {
        type: "multiline",
        placeholder: "Optionally provide details..",
      },
    },
    link_type: {
      label: "Folder access",
      isHidden: (values) => values.contentType !== "folder",
      LabelProps: {
        placement: "top",
        TypographyProps: {
          variant: "body1",
          color: "textPrimary",
          paddingBottom: 1,
        },
      },
      component: ShareLinkTypeField,
      FieldProps: {
        type: "singleSelect",
        options: {
          valueOptions: [
            {
              value: "download",
              label: "Download",
              description: "People with this link can download files",
            },
            {
              value: "upload",
              label: "Upload",
              description:
                "People with this link can upload files to the shared folder",
            },
            {
              value: "editor",
              label: "Editor",
              description:
                "People with this link can download, upload and edit all files within the folder",
            },
          ],
        },
      },
    },
  };
};
