import React from "react";
import * as yup from "yup";
import { TextField } from "@mui/material";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { FieldsForm, FieldsFormProps } from "../../components/PangeaFields";
import { Box } from "@mui/material";
import PangeaThemeProvider from "../theme/pangea/provider";

export default {
  title: "FolderFieldsForm",
  component: FieldsForm,
  argTypes: {},
} as ComponentMeta<typeof FieldsForm>;

const ThemeTemplate: ComponentStory<typeof FieldsForm> = (args) => {
  return (
    <PangeaThemeProvider>
      <Box className="widget" sx={{ padding: 20 }}>
        <FieldsForm {...args} />
      </Box>
    </PangeaThemeProvider>
  );
};

interface Folder {
  name: string;
  path: string;

  parent_id?: string;

  metadata?: Record<string, any>;
  tags?: string[];
}

export const FolderFieldsFormDemo: {
  args: FieldsFormProps<Folder>;
} = ThemeTemplate.bind({});

FolderFieldsFormDemo.args = {
  object: {},
  fields: {
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
            type: "passwordWithPolicy",
            placeholder: "Awesome folder",
            policy: {
              chars_min: 10,
              punct_min: 10,
            },
          },
          schema: yup.string().required("Name is required"),
          autoFocus: true,
        },
        path: {
          label: "Folder",
          LabelProps: {
            placement: "start",
          },
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
  },
  onSubmit: async (values) => {
    console.log("SUBMITTING", values);
  },
};
