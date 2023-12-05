import { FieldsFormSchema } from "@pangeacyber/react-mui-shared";
import * as yup from "yup";
import { ObjectStore, StoreProxyApiRef } from "../../types";

export const getCreateFolderFields = ({
  apiRef,
}: {
  apiRef: StoreProxyApiRef;
}): FieldsFormSchema<ObjectStore.FolderCreateRequest> => ({
  general: {
    type: "grouping",
    label: "",
    collaspable: false,
    fields: {
      name: {
        label: "Name",
        LabelProps: {
          placement: "start",
        },
        FieldProps: {
          type: "text",
          placeholder: "",
        },
        schema: yup.string().required("Name is required"),
        autoFocus: true,
      },
      parent_id: {
        label: "Parent Folder ID",
        LabelProps: {
          placement: "start",
        },
        FieldProps: {
          type: "text",
          options: {
            fetchedValueOptions: async (values) => {
              if (!apiRef.list) return [];

              const response = await apiRef.list({
                filter: { type: "folder" },
              });

              return response?.result?.objects?.map((o) => ({
                value: o.id,
                label: `/${o.name}`,
                caption: o.id,
              }));
            },
          },
        },
        /**
            schema: yup
                .string()
                .test(
                "is-path",
                "Folder must be a valid path, starting with /",
                (value) => {
                    return (value ?? "").startsWith("/");
                }
                )
                .required(),
                */
      },
    },
  },
  optional: {
    type: "grouping",
    label: "Advanced Settings",
    collaspable: true,
    defaultOpen: false,
    fields: {
      tags: {
        label: "Tags",
        LabelProps: {
          placement: "top",
        },
        FieldProps: {
          type: "stringArray",
          dedup: true,
        },
      },
      metadata: {
        label: "Metadata (JSON)",
        LabelProps: {
          placement: "top",
        },
        FieldProps: {
          type: "json",
        },
        schema: yup
          .mixed()
          .test("is-object", "Metadata must be valid JSON", (value) => {
            if (!value) return true;
            return typeof value === "object";
          }),
      },
    },
  },
});
