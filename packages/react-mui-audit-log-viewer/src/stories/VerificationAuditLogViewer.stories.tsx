import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Box } from "@mui/material";

import AuditLogViewer, { AuditLogViewerProps } from "../AuditLogViewer";
import PangeaThemeProvider from "./theme/pangea/provider";
import { TEST_SERVER } from "./server/api";
import { getConfigProps } from "./utils";

/**
 * Demonstrates the AuditLogViewer’s built-in verification feature.
 *
 * - **verificationOptions**: Enables tamper-proofing by fetching published roots
 *   via `onFetchRoot`. The component checks the logs’ `membership_proof` against
 *   these published roots to ensure integrity.
 *
 * - **onFetchRoot**: Invoked when the viewer requires root data for verification.
 *   It expects a function receiving `Audit.RootRequest` and returning a Promise of
 *   `Audit.RootResponse`, typically calling your server’s `/root` endpoint.
 *
 * - **UI Changes**: When verification is enabled, the leftmost column shows
 *   verification details instead of the usual expand/collapse indicator.
 *
 * Other required callbacks for retrieving logs and pagination:
 * - **onSearch**: Called when a new search is performed.
 * - **onPageChange**: Called when navigating between result pages.
 *
 * Optional environment variables for connecting to a real Audit Log service:
 * - STORYBOOK_PANGEA_TOKEN = "pts_..."
 * - STORYBOOK_SERVICE_DOMAIN = "aws.us.pangea.cloud"
 * - STORYBOOK_CONFIG_ID = "pci_..."
 * - STORYBOOK_CLIENT_TOKEN = "pcl_..."
 *
 * @hidden
 */
export default {
  title: "VerificationAuditLogViewer",
  component: AuditLogViewer,
  argTypes: {},
} as ComponentMeta<typeof AuditLogViewer>;

const Template: ComponentStory<typeof AuditLogViewer> = (args) => (
  <PangeaThemeProvider>
    <Box className="widget" sx={{ padding: 1 }}>
      <AuditLogViewer {...args} />
    </Box>
  </PangeaThemeProvider>
);

export const VerificationAuditLogViewer = Template.bind({});
VerificationAuditLogViewer.args = {
  // Turn off live searches on input or filter changes
  searchOnChange: false,
  searchOnMount: true,
  searchOnFilterChange: false,

  // Example FPE options
  fpeOptions: {
    highlightRedaction: true,
  },

  // Required callbacks for fetching data
  onSearch: TEST_SERVER.onSearch,
  onPageChange: TEST_SERVER.onPageChange,

  // Enables download button
  onDownload: TEST_SERVER.onDownload,

  // Enables tamper-proof verification
  verificationOptions: {
    onFetchRoot: TEST_SERVER.onFetchRoot,
  },

  // Include environment-specific config if available
  ...getConfigProps(),
};
