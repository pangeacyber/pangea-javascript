import React, { FC } from "react";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, ScopedCssBaseline } from "@mui/material";

const ConfigThemeProvider: FC<{
  children: React.ReactNode;
  config: Record<string, any>;
}> = ({ children, config }) => {
  return (
    <ThemeProvider
      theme={createTheme({
        spacing: config?.density === "comfortable" ? 12 : 8,
        typography: {
          fontFamily: config?.font_family ?? ["Kanit", "sans-serif"].join(","),
          h6: {
            fontSize: config?.header_font_size,
            fontWeight: config?.header_font_weight,
          },
          body2: {
            fontSize: config?.body_font_size,
            fontWeight: config?.body_font_weight,
          },
          button: {
            fontSize: config?.body_font_size,
            fontWeight: config?.body_font_weight,
          },
        },
        components: {
          MuiButton: {
            defaultProps: {
              variant: config?.button_variant ?? "contained",
            },
            styleOverrides: {
              root: {
                height: config?.density === "comfortable" ? "50px" : "40px",
                borderRadius: config?.button_border_radius ?? "8px",
                "&.Mui-disabled": {
                  color: config?.text_contrast_color,
                  backgroundColor: config?.primary_color,
                  opacity: "0.75",
                },
              },
            },
          },
          MuiInputLabel: {
            defaultProps: {
              size: config?.density === "comfortable" ? "normal" : "small",
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
                  color: config?.input_text_color,
                },
              },
            },
          },
          MuiInput: {
            styleOverrides: {
              root: {
                borderRadius: config?.input_border_radius ?? "8px",
                backgroundColor: config?.input_bg_color,
                input: {
                  height: config?.density === "comfortable" ? "50px" : "40px",
                  color: config?.input_text_color,
                },
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                ":not(.MuiInputBase-multiline)": {
                  height: config?.density === "comfortable" ? "50px" : "40px",
                },
                borderRadius: config?.input_border_radius ?? "8px",
                backgroundColor: config?.input_bg_color,
                input: {
                  color: config?.input_text_color,
                },
              },
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: {
                "&.Mui-focused": {
                  color: config?.text_primary_color,
                },
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: config?.text_secondary_color,
              },
            },
          },
          MuiLink: {
            styleOverrides: {
              root: {
                color: config?.link_color,
                textDecoration: config?.link_style ?? "none",
              },
            },
          },
          MuiGrid: {
            styleOverrides: {
              root: {
                ".MuiDataGrid-root": {
                  ".MuiDataGrid-columnHeaders": {
                    backgroundColor:
                      config?.custom?.audit?.column_header_bg_color ??
                      config?.panel_bg_color,
                  },
                  ".MuiDataGrid-row.Mui-selected": {
                    backgroundColor:
                      config?.custom?.audit?.selected_row_bg_color ??
                      config?.panel_bg_color,
                    ".PangeaDataGrid-Pinned-Right": {
                      backgroundColor:
                        config?.custom_metadata?.audit?.selected_row_bg_color ??
                        config?.panel_bg_color,
                    },
                    ":hover": {
                      backgroundColor:
                        config?.custom?.audit?.hover_row_bg_color ??
                        config?.custom?.audit?.selected_row_bg_color ??
                        config?.panel_bg_color,
                      ".PangeaDataGrid-Pinned-Right": {
                        backgroundColor:
                          config?.custom_metadata?.audit?.hover_row_bg_color ??
                          config?.custom_metadata?.audit
                            ?.selected_row_bg_color ??
                          config?.panel_bg_color,
                      },
                    },
                  },
                  ".MuiDataGrid-row": {
                    ":hover": {
                      backgroundColor:
                        config?.custom?.audit?.hover_row_bg_color ??
                        config?.custom?.audit?.selected_row_bg_color ??
                        config?.panel_bg_color,
                    },
                  },
                  ".PangeaDataGrid-ExpansionRow, .PangeaDataGrid-Chip": {
                    backgroundColor:
                      config?.custom?.audit?.selected_row_bg_color ??
                      config?.panel_bg_color,
                  },
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: config?.panel_bg_color ?? "#fff",
              },
            },
          },
          MuiAutocomplete: {
            styleOverrides: {
              listbox: {
                backgroundColor: config?.panel_bg_color ?? "#fff",
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              root: {
                ".MuiBox-root.widget": {
                  backgroundColor: config?.panel_bg_color ?? "#fff",
                  borderRadius: config?.panel_border_radius ?? "8px",
                },
                ".PangeaInput-root": {
                  borderRadius: config?.input_border_radius ?? "8px",
                  backgroundColor: config?.input_bg_color,
                },
              },
            },
          },
          MuiScopedCssBaseline: {
            styleOverrides: {
              root: {
                ".MuiBox-root.widget": {
                  backgroundColor: config?.panel_bg_color ?? "#fff",
                  borderRadius: config?.panel_border_radius ?? "8px",
                },
                ".PangeaInput-root": {
                  borderRadius: config?.input_border_radius ?? "8px",
                  backgroundColor: config?.input_bg_color,
                },
              },
            },
          },
        },
        palette: {
          primary: {
            main: config?.primary_color,
            contrastText: config?.text_contrast_color,
          },
          secondary: {
            main: config?.secondary_color,
          },
          text: {
            primary: config?.text_primary_color,
            secondary: config?.text_secondary_color,
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
          {children}
        </Box>
      </ScopedCssBaseline>
    </ThemeProvider>
  );
};

export default ConfigThemeProvider;
