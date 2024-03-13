import {
  FieldsFormSchema,
  validatePassword,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../../types";
import * as yup from "yup";
import dayjs from "dayjs";
import ShareAuthenticatorField from "./ShareAuthenticatorField";
import ShareLinkTypeField from "./ShareLinkTypeField";

export const getShareSettingsFields = (
  opts: {
    maxAccessCount?: number;
    maxDate?: dayjs.Dayjs;
  } = {}
): FieldsFormSchema<ObjectStore.SingleShareCreateRequest> => {
  let validate = yup
    .number()
    .min(1, "Access count must be greater than or equal to 1");

  if (opts.maxAccessCount) {
    validate = validate.max(
      opts.maxAccessCount,
      "Access count must be less than or equal to 1"
    );
  }
  return {
    expires_at: {
      label: "Expiration",
      LabelProps: {
        placement: "top",
        minWidth: "180px",
      },
      FieldProps: {
        type: "dateTime",
        maxDate: opts?.maxDate,
      },
    },
    max_access_count: {
      label: "Access count",
      LabelProps: {
        placement: "top",
        minWidth: "180px",
      },
      schema: validate,
      FieldProps: {
        type: "number",
        InputProps: {
          inputProps: {
            min: 1,
            ...(!!opts?.maxAccessCount && {
              max: opts.maxAccessCount,
            }),
          },
        },
      },
    },
  };
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
