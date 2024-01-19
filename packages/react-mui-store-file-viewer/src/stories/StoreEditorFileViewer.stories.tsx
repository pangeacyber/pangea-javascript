import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import {
  StoreDownloadFileViewer,
  StoreFileViewerProps,
} from "../components/StoreFileViewer";
import { Box } from "@mui/material";
import axios from "axios";
import PangeaThemeProvider from "./theme/pangea/provider";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default {
  title: "StoreEditorFileViewer",
  component: StoreDownloadFileViewer,
  argTypes: {},
} as ComponentMeta<typeof StoreDownloadFileViewer>;

const ThemeTemplate: ComponentStory<typeof StoreDownloadFileViewer> = (
  args
) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PangeaThemeProvider>
        <Box className="widget" sx={{ padding: 1 }}>
          <StoreDownloadFileViewer {...args} />
        </Box>
      </PangeaThemeProvider>
    </LocalizationProvider>
  );
};

export const StoreFileViewerDemo: {
  args: StoreFileViewerProps;
} = ThemeTemplate.bind({});

StoreFileViewerDemo.args = {
  apiRef: {
    list: async (body) => {
      return axios
        .post(
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/list`,
          { ...body },
          {
            headers: {
              Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
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
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/get`,
          { ...body },
          {
            headers: {
              Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
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
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/get_archive`,
          { ...body },
          {
            headers: {
              Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
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
    upload: async (body, contentType) => {
      return axios
        .post(
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/put`,
          body,
          {
            headers: {
              Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
              "Content-Type": contentType,
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
    delete: async (body) => {
      return axios
        .post(
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/delete`,
          { ...body },
          {
            headers: {
              Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
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
    update: async (body) => {
      return axios
        .post(
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/update`,
          { ...body },
          {
            headers: {
              Authorization: `Bearer ${process.env.STORYBOOK_PANGEA_TOKEN}`,
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
