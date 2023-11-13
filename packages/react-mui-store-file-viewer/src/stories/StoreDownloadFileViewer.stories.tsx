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
  title: "StoreDownloadFileViewer",
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
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1/list`,
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
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1/get`,
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
