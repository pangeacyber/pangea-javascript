import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import StoreFileViewer, {
  StoreFileViewerProps,
} from "../components/StoreFileViewer";
import { Box } from "@mui/material";
import axios from "axios";
import PangeaThemeProvider from "./theme/pangea/provider";

export default {
  title: "StoreFileViewer",
  component: StoreFileViewer,
  argTypes: {},
} as ComponentMeta<typeof StoreFileViewer>;

const ThemeTemplate: ComponentStory<typeof StoreFileViewer> = (args) => {
  return (
    <PangeaThemeProvider>
      <Box className="widget" sx={{ padding: 1 }}>
        <StoreFileViewer {...args} />
      </Box>
    </PangeaThemeProvider>
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
    folderCreate: async (body) => {
      return axios
        .post(
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1/folder/create`,
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
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1/put`,
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
    update: async (body) => {
      return axios
        .post(
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1/update`,
          body,
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
