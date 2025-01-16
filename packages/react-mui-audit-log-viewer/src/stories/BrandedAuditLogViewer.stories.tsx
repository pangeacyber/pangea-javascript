import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Alert, Box, Stack, Typography } from "@mui/material";

import AuditLogViewer from "../AuditLogViewer";
import BrowserflixThemeProvider from "./theme/browserflix/provider";
import { TEST_SERVER } from "./server/api";
import { getConfigProps } from "./utils";

/**
 * Demonstrates the AuditLogViewer component nested within a custom
 * Pangea-branded Material UI theme provider (from `@pangeacyber/react-mui-branding`).
 *
 * - **Themed Styling**: The `BrowserflixThemeProvider` applies a custom theme,
 *   showcasing how the AuditLogViewer (which itself uses MUI components) inherits styling.
 *
 * - **Callbacks**:
 *   - `onSearch` and `onPageChange`: Required for retrieving logs and handling pagination.
 *   - `onDownload`: Renders a "Download" button for exporting logs.
 *
 * Environment variables (optional) for integration with a real Audit Log service:
 * - `STORYBOOK_PANGEA_TOKEN = "pts_..."`
 * - `STORYBOOK_SERVICE_DOMAIN = "aws.us.pangea.cloud"`
 * - `STORYBOOK_CONFIG_ID = "pci_..."`
 *
 * Optionally, you may also supply:
 * - `STORYBOOK_CLIENT_TOKEN = "pcl_..."`
 *
 * @hidden
 */
export default {
  title: "BrandedAuditLogViewer",
  component: AuditLogViewer,
  argTypes: {},
} as ComponentMeta<typeof AuditLogViewer>;

const Template: ComponentStory<typeof AuditLogViewer> = (args) => {
  return (
    <BrowserflixThemeProvider>
      <Stack spacing={2}>
        <Alert severity="info">
          <Typography variant="body2">
            This example displays the <strong>AuditLogViewer</strong> wrapped in
            a custom theme provider. Note how the component&apos;s styling
            adapts to the provided Material UI theme. A{" "}
            <strong>Download</strong> button also appears via the{" "}
            <code>onDownload</code> callback.
          </Typography>
        </Alert>

        <Box className="widget" sx={{ padding: 1 }}>
          <AuditLogViewer {...args} />
        </Box>
      </Stack>
    </BrowserflixThemeProvider>
  );
};

export const ThemedAuditLogViewer = Template.bind({});
ThemedAuditLogViewer.args = {
  onSearch: TEST_SERVER.onSearch,
  onPageChange: TEST_SERVER.onPageChange,
  // Enables the "Download" button
  onDownload: TEST_SERVER.onDownload,
  ...getConfigProps(),
};
