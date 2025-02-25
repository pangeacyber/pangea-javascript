import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Alert, Stack, Typography } from "@mui/material";

import AuditLogViewer, { AuditLogViewerProps } from "../AuditLogViewer";
import { TEST_SERVER } from "./server/api";
import { getConfigProps } from "./utils";

/**
 * Demonstrates a rendering for the AuditLogViewer,
 * requiring the `onSearch` and `onPageChange` callbacks and providing the filterOptions prop.
 *
 * - **filterOptions.hotStorageRang**: Specifies the optional search window for searches and provides a warning when exceeded
 *
 * Required callback props for retrieving and paginating logs:
 * - `onSearch`: Receives an `Audit.SearchRequest`, returns a Promise of `Audit.SearchResponse`.
 * - `onPageChange`: Receives an `Audit.ResultRequest`, returns a Promise of `Audit.ResultResponse`.
 *
 * Environment variables:
 * - `STORYBOOK_PANGEA_TOKEN = "pts_..."`
 * - `STORYBOOK_SERVICE_DOMAIN = "aws.us.pangea.cloud"`
 * - `STORYBOOK_CONFIG_ID = "pci_..."`
 * - `STORYBOOK_CLIENT_TOKEN = "pcl_..."`
 *
 * @hidden
 */
export default {
  title: "FilterOptionsAuditLogViewer",
  component: AuditLogViewer,
  argTypes: {},
} as ComponentMeta<typeof AuditLogViewer>;

const Template: ComponentStory<typeof AuditLogViewer> = (args) => (
  <Stack spacing={2}>
    <Alert severity="info">
      <Typography variant="body2">
        Below is a standard <strong>AuditLogViewer</strong> example, including
        filterOptions props, to specify hotStorageRange, dynamically changing
        the quick time filter options and providing a warning when exceeding the
        hot storage window.
      </Typography>
    </Alert>

    <AuditLogViewer {...args} />
  </Stack>
);

export const FilterOptionsAuditLogViewer = Template.bind({});
FilterOptionsAuditLogViewer.args = {
  onSearch: TEST_SERVER.onSearch,
  onPageChange: TEST_SERVER.onPageChange,
  // Optional 'config' prop allows the component to retrieve a custom Audit schema
  ...getConfigProps(),

  // Disable automatic search on each keystroke
  searchOnChange: false,

  filterOptions: {
    hotStorageRange: "14day",

    filterableFields: ["actor"],

    fieldOptions: [
      {
        id: "actor",
        valueOptions: [
          {
            value: "colin",
            label: "Colin",
          },
          {
            value: "bob",
            label: "Bob",
          },
        ],
      },
    ],
  },
} as AuditLogViewerProps;
