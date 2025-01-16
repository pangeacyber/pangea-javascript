import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Alert, Box, Stack, Typography } from "@mui/material";

import AuditLogViewer, { AuditLogViewerProps } from "../AuditLogViewer";
import { Audit } from "../types";
import PangeaThemeProvider from "./theme/pangea/provider";
import { TEST_SERVER } from "./server/api";

/**
 * Demonstrates how the AuditLogViewer component can be provided a custom schema,
 * which determines which fields are displayed, how they are named, and their types.
 *
 * This story includes only the necessary callback props to retrieve logs and handle pagination.
 *
 * Callback functions can either:
 * - Use mock data
 * - Or hit a configured Audit Log service if the following environment variables are supplied:
 *   - STORYBOOK_PANGEA_TOKEN = "pts_..."
 *   - STORYBOOK_SERVICE_DOMAIN = "aws.us.pangea.cloud"
 *   - STORYBOOK_CONFIG_ID = "pci_..."
 *
 * @hidden
 */
export default {
  title: "CustomSchemaAuditLogViewer",
  component: AuditLogViewer,
  argTypes: {},
} as ComponentMeta<typeof AuditLogViewer>;

/**
 * A simple subset of the standard Secure Audit Log schema, illustrating how
 * customizing `schema` can tailor which columns (fields) are visible and how
 * they appear in the AuditLogViewer.
 */
const CUSTOM_AUDIT_SCHEMA: Audit.Schema = {
  client_signable: true,
  tamper_proofing: true,
  fields: [
    {
      id: "received_at",
      name: "Time",
      type: "datetime",
      ui_default_visible: true,
    },
    {
      id: "actor",
      name: "Actor",
      type: "string",
      size: 32766,
      ui_default_visible: true,
    },
    {
      id: "action",
      name: "Action",
      type: "string",
      size: 32766,
      ui_default_visible: true,
    },
    {
      id: "status",
      name: "Status",
      type: "string",
      size: 32766,
    },
    {
      id: "message",
      name: "Message",
      type: "string",
      size: 32766,
      ui_default_visible: true,
    },
  ],
};

const Template: ComponentStory<typeof AuditLogViewer> = (args) => {
  return (
    <PangeaThemeProvider>
      <Stack>
        <Alert severity="info">
          <Typography variant="body2">
            This story demonstrates providing a custom <strong>schema</strong>{" "}
            to the AuditLogViewer component, allowing you to control which
            fields are rendered, how they are labeled, and how they appear in
            the UI.
          </Typography>
        </Alert>
        <Box className="widget" sx={{ padding: 1 }}>
          <AuditLogViewer {...args} />
        </Box>
      </Stack>
    </PangeaThemeProvider>
  );
};

export const CustomSchemaAuditLogViewer: {
  args: AuditLogViewerProps;
} = Template.bind({});
CustomSchemaAuditLogViewer.args = {
  searchOnChange: false, // Disable live search on input change
  onSearch: TEST_SERVER.onSearch,
  onPageChange: TEST_SERVER.onPageChange,
  schema: CUSTOM_AUDIT_SCHEMA,
};
