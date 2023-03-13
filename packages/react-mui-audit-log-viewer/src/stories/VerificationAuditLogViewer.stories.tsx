import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AuditLogViewer, { AuditLogViewerProps } from "../AuditLogViewer";
import { Box } from "@mui/material";
import axios from "axios";
import PangeaThemeProvider from "./theme/pangea/provider";

export default {
  title: "AuditLogViewer",
  component: AuditLogViewer,
  argTypes: {},
} as ComponentMeta<typeof AuditLogViewer>;

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
            Authorization: "Bearer pts_fqwc2mv4s4mhyjwmcp2utwclczho3iyu",
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
            Authorization: "Bearer pts_fqwc2mv4s4mhyjwmcp2utwclczho3iyu",
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
              Authorization: "Bearer pts_fqwc2mv4s4mhyjwmcp2utwclczho3iyu",
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
};
