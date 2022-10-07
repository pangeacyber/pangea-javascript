import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AuditLogViewer from "./AuditLogViewer";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default {
  title: "AuditLogViewer",
  component: AuditLogViewer,
  argTypes: {},
} as ComponentMeta<typeof AuditLogViewer>;

const Template: ComponentStory<typeof AuditLogViewer> = (args) => (
  <AuditLogViewer {...args} />
);

const ThemeTemplate: ComponentStory<typeof AuditLogViewer> = (args) => (
  <ThemeProvider
    theme={createTheme({
      palette: {
        primary: {
          main: "#551B76",
        },
        secondary: {
          main: "#E8EAED",
        },
      },
      components: {
        MuiGrid: {
          styleOverrides: {
            root: {
              ".MuiDataGrid-root": {
                ".MuiDataGrid-columnHeaders": {
                  backgroundColor: "green",
                },
                ".MuiDataGrid-row.Mui-selected": {
                  backgroundColor: "green",
                  ":hover": {
                    backgroundColor: "green",
                  },
                },
                ".MuiDataGrid-row": {
                  ":hover": {
                    backgroundColor: "green",
                  },
                },
                ".PangeaDataGrid-ExpansionRow, .PangeaDataGrid-Chip": {
                  backgroundColor: "green",
                },
              },
            },
          },
        },
      },
    })}
  >
    <AuditLogViewer {...args} />
  </ThemeProvider>
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
  onSearch: async () => {
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
        },
      ],
      expires_at: new Date().toISOString(),
      root: null,
    };
  },
  onPageChange: async () => {
    return {};
  },
};
