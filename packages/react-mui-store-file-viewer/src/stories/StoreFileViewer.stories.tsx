import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import StoreFileViewer, {
  StoreFileViewerProps,
} from "../components/StoreFileViewer";
import { Box } from "@mui/material";
import axios from "axios";
import PangeaThemeProvider from "./theme/pangea/provider";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default {
  title: "StoreFileViewer",
  component: StoreFileViewer,
  argTypes: {},
} as ComponentMeta<typeof StoreFileViewer>;

const ThemeTemplate: ComponentStory<typeof StoreFileViewer> = (args) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PangeaThemeProvider>
        <Box className="widget" sx={{ padding: 1 }}>
          <StoreFileViewer {...args} />
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
    share: {
      list: async (body) => {
        return axios
          .post(
            `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/share/link/list`,
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
      send: async (body) => {
        return axios
          .post(
            `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/share/link/send`,
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
            `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/share/link/read`,
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
      create: async (body) => {
        return axios
          .post(
            `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/share/link/create`,
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
      delete: async (body) => {
        return axios
          .post(
            `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/share/link/delete`,
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
    folderCreate: async (body) => {
      return axios
        .post(
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/folder/create`,
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
    update: async (body) => {
      return axios
        .post(
          `https://store.${process.env.STORYBOOK_SERVICE_DOMAIN}/v1beta/update`,
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
  configurations: {
    passwordPolicy: {
      lower_min: 1,
      upper_min: 1,
      chars_min: 8,
      number_min: 1,
      punct_min: 1,
    },
  },
};
