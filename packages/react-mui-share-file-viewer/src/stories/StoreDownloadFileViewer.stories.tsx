import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
  ShareDownloadFileViewer,
  ShareFileViewerProps,
} from "../ShareFileViewer";
import { Box } from "@mui/material";
import axios from "axios";
import PangeaThemeProvider from "./theme/pangea/provider";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default {
  title: "ShareDownloadFileViewer",
  component: ShareDownloadFileViewer,
  argTypes: {},
} as ComponentMeta<typeof ShareDownloadFileViewer>;

const ThemeTemplate: ComponentStory<typeof ShareDownloadFileViewer> = (
  args
) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PangeaThemeProvider>
        <Box className="widget" sx={{ padding: 1 }}>
          <ShareDownloadFileViewer {...args} />
        </Box>
      </PangeaThemeProvider>
    </LocalizationProvider>
  );
};

export const ShareFileViewerDemo: {
  args: ShareFileViewerProps;
} = ThemeTemplate.bind({});

ShareFileViewerDemo.args = {
  apiRef: {
    list: async (body) => {
      return axios
        .post(
          `https://share.${
            import.meta.env.STORYBOOK_SERVICE_DOMAIN
          }/v1beta/list`,
          { ...body },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.STORYBOOK_PANGEA_TOKEN}`,
            },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    get: async (body) => {
      return axios
        .post(
          `https://share.${
            import.meta.env.STORYBOOK_SERVICE_DOMAIN
          }/v1beta/get`,
          { ...body },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.STORYBOOK_PANGEA_TOKEN}`,
            },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
    getArchive: async (body) => {
      return axios
        .post(
          `https://share.${
            import.meta.env.STORYBOOK_SERVICE_DOMAIN
          }/v1beta/get_archive`,
          { ...body },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.STORYBOOK_PANGEA_TOKEN}`,
            },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },
  },
};
