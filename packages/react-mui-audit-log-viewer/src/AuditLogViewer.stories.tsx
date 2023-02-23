import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import AuditLogViewer from "./AuditLogViewer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, ScopedCssBaseline } from "@mui/material";

const BROWSERFLIX: any = {
  preset: "browserflix",

  brand_name: "Browserflix",
  brand_logo: "https://i.ibb.co/wB4VNcm/browserflix.png",
  brand_page_logo: "https://i.ibb.co/wB4VNcm/browserflix.png",
  brand_logo_height: "24px",
  brand_favicon: "",
  bg_image:
    "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2062&q=80",
  font_family: "Kanit",
  density: "comfortable",
  bg_color: "#4B4B4B",
  panel_bg_color: "rgba(0, 0, 0, 0.5)",
  primary_color: "#DF011A",
  secondary_color: "#4B4B4B",
  text_primary_color: "#FFFFFF",
  text_secondary_color: "#FFFFFF",
  text_contrast_color: "#FFFFFF",
  link_color: "#FFFFFF",
  input_text_color: "#FFFFFF",
  link_style: "none",
  header_font_size: "24px",
  header_font_weight: "600",
  body_font_size: "14px",
  body_font_weight: "300",
  input_bg_color: "#4B4B4B",
  input_border_radius: "0px",
  button_variant: "contained",
  button_border_radius: "0px",
  panel_border_radius: "0px",
  panel_box_shadow: "0px 8px 24px rgba(0, 0, 0, 0.16)",
  authn_show_name: false,
  authn_show_social_icons: false,
  login_heading: "Sign in",
  login_button_label: "Sign in",
  login_social_heading: "Other ways to sign in",
  signup_heading: "Create your account",
  signup_button_label: "Create account",
  signup_social_heading: "Other ways to sign up",
  otp_button_label: "Submit",
};

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
      spacing: BROWSERFLIX?.density === "comfortable" ? 12 : 8,
      typography: {
        fontFamily: BROWSERFLIX?.font_family ?? "Roboto",
        h6: {
          fontSize: BROWSERFLIX?.header_font_size,
          fontWeight: BROWSERFLIX?.header_font_weight,
        },
        body2: {
          fontSize: BROWSERFLIX?.body_font_size,
          fontWeight: BROWSERFLIX?.body_font_weight,
        },
      },
      components: {
        MuiButton: {
          defaultProps: {
            variant: BROWSERFLIX?.button_variant ?? "contained",
          },
          styleOverrides: {
            root: {
              height: BROWSERFLIX?.density === "comfortable" ? "50px" : "40px",
              borderRadius: BROWSERFLIX?.button_border_radius ?? "8px",
              "&.Mui-disabled": {
                color: BROWSERFLIX?.text_contrast_color,
                backgroundColor: BROWSERFLIX?.primary_color,
                opacity: "0.75",
              },
            },
          },
        },
        MuiInputLabel: {
          defaultProps: {
            size: BROWSERFLIX?.density === "comfortable" ? "normal" : "small",
          },
          styleOverrides: {
            root: {
              "&.MuiInputLabel-sizeSmall[data-shrink='false']": {
                transform: "translate(14px, 11px) scale(1)",
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              label: {
                color: BROWSERFLIX?.input_text_color,
              },
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              borderRadius: BROWSERFLIX?.input_border_radius ?? "8px",
              backgroundColor: BROWSERFLIX?.input_bg_color,
              input: {
                height:
                  BROWSERFLIX?.density === "comfortable" ? "50px" : "40px",
                color: BROWSERFLIX?.input_text_color,
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              height: BROWSERFLIX?.density === "comfortable" ? "50px" : "40px",
              borderRadius: BROWSERFLIX?.input_border_radius ?? "8px",
              backgroundColor: BROWSERFLIX?.input_bg_color,
              input: {
                color: BROWSERFLIX?.input_text_color,
              },
            },
          },
        },
        MuiFormLabel: {
          styleOverrides: {
            root: {
              "&.Mui-focused": {
                color: BROWSERFLIX?.text_primary_color,
              },
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: BROWSERFLIX?.text_secondary_color,
            },
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              color: BROWSERFLIX?.link_color,
              textDecoration: BROWSERFLIX?.link_style ?? "none",
            },
          },
        },
        MuiGrid: {
          styleOverrides: {
            root: {
              ".MuiDataGrid-root": {
                ".MuiDataGrid-columnHeaders": {
                  backgroundColor:
                    BROWSERFLIX?.custom?.audit?.column_header_bg_color ??
                    BROWSERFLIX?.panel_bg_color,
                },
                ".MuiDataGrid-row.Mui-selected": {
                  backgroundColor:
                    BROWSERFLIX?.custom?.audit?.selected_row_bg_color ??
                    BROWSERFLIX?.panel_bg_color,
                  ":hover": {
                    backgroundColor:
                      BROWSERFLIX?.custom?.audit?.selected_row_bg_color ??
                      BROWSERFLIX?.panel_bg_color,
                  },
                },
                ".MuiDataGrid-row": {
                  ":hover": {
                    backgroundColor:
                      BROWSERFLIX?.custom?.audit?.selected_row_bg_color ??
                      BROWSERFLIX?.panel_bg_color,
                  },
                },
                ".PangeaDataGrid-ExpansionRow, .PangeaDataGrid-Chip": {
                  backgroundColor:
                    BROWSERFLIX?.custom?.audit?.selected_row_bg_color ??
                    BROWSERFLIX?.panel_bg_color,
                },
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: BROWSERFLIX?.panel_bg_color ?? "#fff",
            },
          },
        },
        MuiAutocomplete: {
          styleOverrides: {
            listbox: {
              backgroundColor: BROWSERFLIX?.panel_bg_color ?? "#fff",
            },
          },
        },
        MuiCssBaseline: {
          styleOverrides: {
            root: {
              ".MuiBox-root.widget": {
                backgroundColor: BROWSERFLIX?.panel_bg_color ?? "#fff",
                borderRadius: BROWSERFLIX?.panel_border_radius ?? "8px",
              },
              ".PangeaInput-root": {
                borderRadius: BROWSERFLIX?.input_border_radius ?? "8px",
                backgroundColor: BROWSERFLIX?.input_bg_color,
              },
            },
          },
        },
        MuiScopedCssBaseline: {
          styleOverrides: {
            root: {
              ".MuiBox-root.widget": {
                backgroundColor: BROWSERFLIX?.panel_bg_color ?? "#fff",
                borderRadius: BROWSERFLIX?.panel_border_radius ?? "8px",
              },
              ".PangeaInput-root": {
                borderRadius: BROWSERFLIX?.input_border_radius ?? "8px",
                backgroundColor: BROWSERFLIX?.input_bg_color,
              },
            },
          },
        },
      },
      palette: {
        primary: {
          main: BROWSERFLIX?.primary_color,
          contrastText: BROWSERFLIX?.text_contrast_color,
        },
        secondary: {
          main: BROWSERFLIX?.secondary_color,
        },
        text: {
          primary: BROWSERFLIX?.text_primary_color,
          secondary: BROWSERFLIX?.text_secondary_color,
        },
      },
    })}
  >
    <ScopedCssBaseline
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box className="widget" sx={{ padding: 1 }}>
        <AuditLogViewer {...args} />
      </Box>
    </ScopedCssBaseline>
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
  onSearch: async (body) => {
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
        {
          envelope: {
            event: {
              message: {
                action: "Charlie viewed Pennsylvania state details.",
              },
              actor: "Charlie",
              action: "Viewed state records",
              new: {
                name: "Pennsylvania",
                title: "State",
                twitter: "",
                quote: ["Who"],
              },
            },
            received_at: "2022-12-06T16:10:45.057825Z",
          },
          hash: "36c5131d2509a74a0b4bb96ad78b90149c5cbb17251ba0db6cdebd476fe7423e",
          published: false,
          membership_proof: "",
          signature_verification: "none",
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
