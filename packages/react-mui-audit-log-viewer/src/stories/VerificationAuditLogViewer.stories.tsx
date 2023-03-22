import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AuditLogViewer, { AuditLogViewerProps } from "../AuditLogViewer";
import { Box } from "@mui/material";
import axios from "axios";
import PangeaThemeProvider from "./theme/pangea/provider";
import { Audit } from "../types";

export default {
  title: "AuditLogViewer",
  component: AuditLogViewer,
  argTypes: {},
} as ComponentMeta<typeof AuditLogViewer>;

const AUDIT_SCHEMA: Audit.Schema = {
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
      id: "target",
      name: "Target",
      type: "string",
      size: 32766,
    },
    {
      id: "source",
      name: "Source",
      type: "string",
      size: 32766,
    },
    {
      id: "old",
      name: "Old",
      type: "string",
      size: 32766,
    },
    {
      id: "new",
      name: "New",
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

const ThemeTemplate: ComponentStory<typeof AuditLogViewer> = (args) => (
  <PangeaThemeProvider>
    <Box className="widget" sx={{ padding: 1 }}>
      <AuditLogViewer {...args} />
    </Box>
  </PangeaThemeProvider>
);

export const VerificationAuditLogViewer: {
  args: AuditLogViewerProps;
} = ThemeTemplate.bind({});

VerificationAuditLogViewer.args = {
  onSearch: async (body) => {
    return axios
      .post(
        "https://audit.dev.aws.pangea.cloud/v1/search",
        { ...body },
        {
          headers: {
            Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
          },
        }
      )
      .then((response) => {
        return response?.data?.result;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  onPageChange: async (body) => {
    return axios
      .post(
        "https://audit.dev.aws.pangea.cloud/v1/results",
        { ...body },
        {
          headers: {
            Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
          },
        }
      )
      .then((response) => {
        return response?.data?.result;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  verificationOptions: {
    onFetchRoot: async (body) => {
      return axios
        .post(
          "https://audit.dev.aws.pangea.cloud/v1/root",
          { ...body },
          {
            headers: {
              Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
            },
          }
        )
        .then((response) => {
          return response?.data?.result;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  config: {
    domain: process.env.STORYBOOK_SERVICE_DOMAIN ?? "",
    clientToken: process.env.STORYBOOK_CLIENT_TOKEN ?? "",
  },
};
