import { Branding } from "./types";
import { ThemeOptions } from "@mui/material/styles";

// FIXME: This was added to prevent crashes from invalid colors;
const getColor = (color: string | undefined): string => {
  if (!!color && /#.+/.test(color)) {
    return color;
  }

  return "#000";
};

export const getBrandingThemeOptions = (
  config: Partial<Branding.Config>
): ThemeOptions => {
  const themeOptions: ThemeOptions = {
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
      MuiFormControl: {
        defaultProps: {
          size: config?.density === "comfortable" ? "medium" : "small",
        },
      },
      MuiInputLabel: {
        defaultProps: {
          size: config?.density === "comfortable" ? "normal" : "small",
        },
        styleOverrides: {
          root: {
            backgroundColor: "transparent",
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
            height: config?.density === "comfortable" ? "50px" : "40px",
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
                  config?.custom_metadata?.audit?.column_header_bg_color ??
                  config?.panel_bg_color,
              },
              ".MuiDataGrid-row.Mui-selected": {
                backgroundColor:
                  config?.custom_metadata?.audit?.selected_row_bg_color ??
                  config?.panel_bg_color,
                ":hover": {
                  backgroundColor:
                    config?.custom_metadata?.audit?.hover_row_bg_color ??
                    config?.custom_metadata?.audit?.selected_row_bg_color ??
                    config?.panel_bg_color,
                },
              },
              ".MuiDataGrid-row": {
                ":hover": {
                  backgroundColor:
                    config?.custom_metadata?.audit?.hover_row_bg_color ??
                    config?.custom_metadata?.audit?.selected_row_bg_color ??
                    config?.panel_bg_color,
                },
              },
              ".PangeaDataGrid-ExpansionRow, .PangeaDataGrid-Chip": {
                backgroundColor:
                  config?.custom_metadata?.audit?.selected_row_bg_color ??
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
            ".MuiBox-root.widget, .PangeaPanel-root": {
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
            ".MuiBox-root.widget, .PangeaPanel-root": {
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
        main: getColor(config?.primary_color),
        contrastText: getColor(config?.text_contrast_color),
      },
      secondary: {
        main: getColor(config?.secondary_color),
      },
      text: {
        primary: getColor(config?.text_primary_color),
        secondary: getColor(config?.text_secondary_color),
      },
    },
  };

  return themeOptions;
};
