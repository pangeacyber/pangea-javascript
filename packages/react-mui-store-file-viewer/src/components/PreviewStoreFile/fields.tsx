import { FieldsPreviewSchema } from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../types";
import startCase from "lodash/startCase";

export const PreviewSessionFields: FieldsPreviewSchema<ObjectStore.ObjectResponse> =
  {
    id: {
      label: "ID",
      type: "stringWithCopy",
    },
    type: {
      label: "Type",
      getValue: (data) => {
        return startCase(data.type ?? "");
      },
    },
    name: {
      label: "Name",
    },
    parent_id: {
      label: "Folder ID",
      type: "stringWithCopy",
      hideIfUndefined: true,
    },
    path: {
      label: "Path",
      hideIfUndefined: true,
    },
    created_at: {
      label: "Created at",
      type: "dateTime",
    },
    updated_at: {
      label: "Modified at",
      type: "dateTime",
    },
    advanced: {
      label: "Advanced",
      type: "grouping",
      isHidden: (data) => {
        return data?.tags === undefined && data?.metadata === undefined;
      },
      fields: {
        tags: {
          label: "Tags",
          type: "stringArray",
          hideIfUndefined: true,
        },
        metadata: {
          label: "Custom metadata",
          LabelProps: {
            placement: "top",
          },
          type: "json",
          isPrimary: true,
          hideIfUndefined: true,
        },
      },
    },
  };
