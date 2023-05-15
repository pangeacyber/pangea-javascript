import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AuditLogViewer from "./AuditLogViewer";
import { Box } from "@mui/material";
import BrowserflixThemeProvider from "./stories/theme/browserflix/provider";

export default {
  title: "AuditLogViewer",
  component: AuditLogViewer,
  argTypes: {},
} as ComponentMeta<typeof AuditLogViewer>;

const Template: ComponentStory<typeof AuditLogViewer> = (args) => (
  <AuditLogViewer {...args} />
);

const ThemeTemplate: ComponentStory<typeof AuditLogViewer> = (args) => (
  <BrowserflixThemeProvider>
    <Box className="widget" sx={{ padding: 1 }}>
      <AuditLogViewer {...args} />
    </Box>
  </BrowserflixThemeProvider>
);

export const SimpleAuditLogViewer = Template.bind({});
SimpleAuditLogViewer.args = {
  onSearch: async () => {
    return {
      id: "mock",
      events: [],
    };
  },
  onPageChange: async () => {
    return {};
  },
};

export const ThemedAuditLogViewer = ThemeTemplate.bind({});
ThemedAuditLogViewer.args = {
  onSearch: async (body) => {
    return {
      id: "mock",
      count: 2,
      events: [
        {
          id: "mock_1",
          actor: "Pepe Silvia",
          received_at: new Date().toISOString(),
          message: "Failed to deliver mail to Pepe Silvia, unable to find",
        },
        {
          id: "mock_2",
          actor: "Pepe Silvia",
          received_at: new Date().toISOString(),
          message: "Failed to deliver mail to Pepe Silvia, unable to find",
          err: JSON.stringify([
            {
              field: "old",
              value: 111,
              error: "Invalid value type",
            },
            {
              field: "new",
              value: 111,
              error: "Invalid value type",
            },
          ]),
        },
        {
          envelope: {
            event: {
              message: {
                action: "Charlie viewed Pennsylvania state details.",
              },
              actor: "Charlie",
              action: "Viewed state records",
              new: {
                name: "Pennsylvania",
                title: "State",
                twitter: "",
                quote: ["Who"],
              },
            },
            received_at: "2022-12-06T16:10:45.057825Z",
          },
          hash: "36c5131d2509a74a0b4bb96ad78b90149c5cbb17251ba0db6cdebd476fe7423e",
          published: false,
          membership_proof: "",
          signature_verification: "none",
          valid_signature: false,
        },
      ],
      expires_at: new Date().toISOString(),
      root: null,
    };
  },
  onPageChange: async () => {
    return {};
  },
  verificationOptions: {
    onFetchRoot: async (body) => {
      return undefined;
    },
  },
};
