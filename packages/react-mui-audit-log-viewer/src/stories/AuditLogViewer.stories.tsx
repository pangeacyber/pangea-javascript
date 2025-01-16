import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Alert, Stack, Typography } from "@mui/material";

import AuditLogViewer from "../AuditLogViewer";
import { TEST_SERVER } from "./server/api";
import { getConfigProps } from "./utils";

/**
 * Demonstrates a minimal configuration for rendering the AuditLogViewer,
 * requiring only the `onSearch` and `onPageChange` callbacks.
 *
 * - **onSearch**: Invoked when the user performs a search. Expects a function receiving
 *   an `Audit.SearchRequest`, returning a Promise that resolves with `Audit.SearchResponse`.
 *   Typically hits your server’s `/search` endpoint for Audit logs.
 *
 * - **onPageChange**: Invoked when the user navigates between pages of results. Expects
 *   a function receiving an `Audit.ResultRequest`, returning a Promise that resolves with
 *   an `Audit.ResultResponse`. Typically hits your server’s `/results` endpoint.
 *
 * - **config (optional)**: If environment variables for a client token are provided, the
 *   component can use `config` to retrieve a custom Audit schema from your Audit Log service.
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
  title: "AuditLogViewer",
  component: AuditLogViewer,
  argTypes: {},
} as ComponentMeta<typeof AuditLogViewer>;

const Template: ComponentStory<typeof AuditLogViewer> = (args) => (
  <Stack spacing={2}>
    <Alert severity="info">
      <Typography variant="body2">
        Below is a standard <strong>AuditLogViewer</strong> example,
        demonstrating minimal required props (<code>onSearch</code> and{" "}
        <code>onPageChange</code>).
      </Typography>
    </Alert>

    <AuditLogViewer {...args} />
  </Stack>
);

export const StandardAuditLogViewerExample = Template.bind({});
StandardAuditLogViewerExample.args = {
  onSearch: TEST_SERVER.onSearch,
  onPageChange: TEST_SERVER.onPageChange,
  // Optional 'config' prop allows the component to retrieve a custom Audit schema
  ...getConfigProps(),

  // Disable automatic search on each keystroke
  searchOnChange: false,
};
