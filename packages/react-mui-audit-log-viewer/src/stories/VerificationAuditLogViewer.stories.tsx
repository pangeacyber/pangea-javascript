import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AuditLogViewer, { AuditLogViewerProps } from "../AuditLogViewer";
import { Box } from "@mui/material";
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

const ThemeTemplate: ComponentStory<typeof AuditLogViewer> = (args) => {
  const [schema, setSchema] = React.useState<any>({
    fields: [
      {
        id: "received_at",
        name: "Time",
        type: "datetime",
        ui_default_visible: true,
      },
      {
        id: "message",
        name: "Message",
        type: "string",
        size: 32766,
        description: "A free form text field describing the event",
        ui_default_visible: true,
        required: true,
        redact: true,
      },
    ],
  });

  React.useEffect(() => {
    setTimeout(() => {
      setSchema(AUDIT_SCHEMA);
    }, 1000);
  }, []);

  return (
    <PangeaThemeProvider>
      <Box className="widget" sx={{ padding: 1 }}>
        <AuditLogViewer {...args} schema={schema} />
      </Box>
    </PangeaThemeProvider>
  );
};

export const VerificationAuditLogViewer: {
  args: AuditLogViewerProps;
} = ThemeTemplate.bind({});

VerificationAuditLogViewer.args = {
  onSearch: async (body) => {
    return fetch(
      `https://audit.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1/search`,
      {
        method: "POST",
        body: JSON.stringify({ ...body, verify_signature: true }),
        headers: {
          Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
        },
      }
    )
      .then((res) => res.json())
      .then((response) => response?.result)
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
  onPageChange: async (body) => {
    return fetch(
      `https://audit.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1/results`,
      {
        method: "POST",
        body: JSON.stringify({ ...body, verify_signature: true }),
        headers: {
          Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
        },
      }
    )
      .then((res) => res.json())
      .then((response) => response?.result)
      .catch((err) => console.log(err));
  },
  verificationOptions: {
    onFetchRoot: async (body) => {
      return fetch(
        `https://audit.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1/root`,
        {
          method: "POST",
          body: JSON.stringify({ ...body }),
          headers: {
            Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
          },
        }
      )
        .then((res) => res.json())
        .then((response) => response?.result)
        .catch((err) => console.log(err));
    },
  },
  config: {
    domain: process.env.STORYBOOK_SERVICE_DOMAIN ?? "",
    clientToken: process.env.STORYBOOK_CLIENT_TOKEN ?? "",
  },
};
