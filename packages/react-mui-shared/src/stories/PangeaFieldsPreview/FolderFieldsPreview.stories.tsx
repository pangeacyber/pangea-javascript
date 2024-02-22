import React from "react";
import startCase from "lodash/startCase";

import { StoryFn, Meta } from "@storybook/react";

import {
  FieldsPreview,
  FieldsPreviewProps,
} from "../../components/PangeaFields";
import { Box } from "@mui/material";
import PangeaThemeProvider from "../theme/pangea/provider";

export default {
  title: "FolderFieldsPreview",
  component: FieldsPreview,
  argTypes: {},
} as Meta<typeof FieldsPreview>;

const ThemeTemplate: StoryFn<typeof FieldsPreview> = (args) => {
  return (
    <PangeaThemeProvider>
      <Box className="widget" sx={{ padding: 1 }}>
        <FieldsPreview {...args} />
      </Box>
    </PangeaThemeProvider>
  );
};

interface Folder {
  id: string;

  name: string;
  path?: string;
  parent_id?: string;

  type: string;

  metadata?: Record<string, any>;
  tags?: string[];
}

export const FolderFieldsPreviewDemo: {
  args: FieldsPreviewProps<Folder>;
} = ThemeTemplate.bind({});

FolderFieldsPreviewDemo.args = {
  data: {
    id: "pos_1",
    name: "First Folder",
    tags: ["hi"],
  },
  schema: {
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
  },
};
