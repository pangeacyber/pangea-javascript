import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AuditLogViewer, { AuditLogViewerProps } from "../AuditLogViewer";
import { Box } from "@mui/material";
import PangeaThemeProvider from "./theme/pangea/provider";
import { Audit } from "../types";
import { handle202Response } from "./utils";

/**
 * @hidden
 */
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
        <AuditLogViewer {...args} />
      </Box>
    </PangeaThemeProvider>
  );
};

export const VerificationAuditLogViewer: {
  args: AuditLogViewerProps;
} = ThemeTemplate.bind({});

VerificationAuditLogViewer.args = {
  searchOnChange: false,
  searchOnMount: false,
  searchOnFilterChange: false,
  fpeOptions: {
    highlightRedaction: true,
  },
  onSearch: async (body) => {
    return fetch(
      `https://audit.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1/search`,
      {
        method: "POST",
        body: JSON.stringify({
          ...body,
          verify_signature: true,
          ...(!!process.env.STORYBOOK_CONFIG_ID && {
            config_id: process.env.STORYBOOK_CONFIG_ID,
          }),
        }),
        headers: {
          Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
        },
      }
    )
      .then(async (res) =>
        handle202Response(
          await res.json(),
          {
            Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
          },
          5
        )
      )
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
        body: JSON.stringify({
          ...body,
          verify_signature: true,
          ...(!!process.env.STORYBOOK_CONFIG_ID && {
            config_id: process.env.STORYBOOK_CONFIG_ID,
          }),
        }),
        headers: {
          Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
        },
      }
    )
      .then((res) => res.json())
      .then((response) => response?.result)
      .catch((err) => console.log(err));
  },
  onDownload: async (body) => {
    return fetch(
      `https://audit.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1/download_results`,
      {
        method: "POST",
        body: JSON.stringify({
          ...body,
        }),
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
          body: JSON.stringify({
            ...body,
            ...(!!process.env.STORYBOOK_CONFIG_ID && {
              config_id: process.env.STORYBOOK_CONFIG_ID,
            }),
          }),
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
    configId: process.env.STORYBOOK_CONFIG_ID ?? "",
  },
};
