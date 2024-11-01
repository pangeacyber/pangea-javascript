import { Branding, PangeaAuth } from "./types";
import merge from "lodash/merge";
import { SxProps, ThemeOptions, createTheme } from "@mui/material/styles";

export const BRANDING_CONFIGURATION_STORAGE_KEY =
  "pangea-branding-configuration";

export const getBrandingConfig = (): Branding.Config | null => {
  const storedData = localStorage.getItem(BRANDING_CONFIGURATION_STORAGE_KEY);
  if (storedData) {
    const config: Branding.Config = JSON.parse(storedData);
    if (!config?.id) {
      console.error(
        "Loaded unrecognized branding configuration from local storage"
      );
    }
    return config;
  }

  return null;
};

export const setBrandingConfig = (config: Branding.Config) => {
  localStorage.setItem(
    BRANDING_CONFIGURATION_STORAGE_KEY,
    JSON.stringify(config)
  );
};

// FIXME: This was added to prevent crashes from invalid colors;
const getColor = (color: string | undefined): string => {
  if (!!color && /#.+/.test(color)) {
    return color;
  }

  return "#000";
};

export const fetchBrandingConfig = async (
  auth: PangeaAuth,
  brandingId: string
): Promise<Branding.Config> => {
  if (!auth?.clientToken || !auth?.domain) {
    const err = new Error(
      "Invalid authentication. Both clientToken and domain are required."
    );
    throw err;
  }
  if (!brandingId) {
    const err = new Error(
      "Missing brandingId. Authentication provider, but id is required to fetch branding."
    );
    throw err;
  }

  return fetch(`https://authn.${auth.domain}/v1/resource/branding`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.clientToken}`,
    },
    body: JSON.stringify({
      id: brandingId,
    }),
  }).then(async (res) => {
    const data = await res.json();
    if (data.result) {
      return data.result;
    } else {
      const err = new Error(
        data.summary ?? "Unable to retrieve branding configuration"
      );
      throw err;
    }
  });
};

const noop = (options: ThemeOptions) => options;

export const fetchBrandingThemeOptions = (
  auth: PangeaAuth,
  brandingId: string,
  themeOptions: Partial<ThemeOptions> = {},
  themeOptionsHook: (options: ThemeOptions) => ThemeOptions = noop
) =>
  fetchBrandingConfig(auth, brandingId).then((config) => {
    const themeOptions_ = getBrandingThemeOptions(config);
    let finalTheme = merge({ ...themeOptions_ }, { ...themeOptions });
    finalTheme = themeOptionsHook(finalTheme);

    return createTheme(finalTheme);
  });

export const getBrandingThemeOptions = (
  config: Partial<Branding.Config>
): ThemeOptions => {
  const cssBaslineStyles: SxProps = {
    "div.MuiDataGrid-root, div.MuiDataGrid-root.LinedPangeaDataGrid-root": {
      ".MuiDataGrid-columnHeaders": {
        backgroundColor: config?.custom_metadata?.audit?.column_header_bg_color,
      },
      ".MuiDataGrid-row.Mui-selected": {
        backgroundColor: config?.custom_metadata?.audit?.selected_row_bg_color,
        ".PangeaDataGrid-Pinned-Right": {
          backgroundColor:
            config?.custom_metadata?.audit?.selected_row_bg_color,
        },
        ":hover": {
          backgroundColor:
            config?.custom_metadata?.audit?.hover_row_bg_color ??
            config?.custom_metadata?.audit?.selected_row_bg_color,
          ".PangeaDataGrid-Pinned-Right": {
            backgroundColor:
              config?.custom_metadata?.audit?.hover_row_bg_color ??
              config?.custom_metadata?.audit?.selected_row_bg_color,
          },
        },
      },
      ".MuiDataGrid-row": {
        ":hover": {
          backgroundColor:
            config?.custom_metadata?.audit?.hover_row_bg_color ??
            config?.custom_metadata?.audit?.selected_row_bg_color,
          ".PangeaDataGrid-Pinned-Right": {
            backgroundColor:
              config?.custom_metadata?.audit?.hover_row_bg_color ??
              config?.custom_metadata?.audit?.selected_row_bg_color,
          },
        },
      },
      ".PangeaDataGrid-ExpansionRow, .PangeaDataGrid-Chip": {
        backgroundColor: config?.custom_metadata?.audit?.selected_row_bg_color,
      },
    },
    ".MuiBox-root.widget, .PangeaPanel-root": {
      backgroundColor: config?.panel_bg_color ?? "inherit",
      borderRadius: config?.panel_border_radius ?? "8px",
    },
    ".PangeaInput-root": {
      borderRadius: config?.input_border_radius ?? "8px",
      backgroundColor: config?.input_bg_color,
    },
  };

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
      overline: {
        fontWeight: "500", /// TODO: Should this been a setting?
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
          },
          text: {
            "&:hover": {
              backgroundColor: "transparent",
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
            input: {
              fontSize: config?.body_font_size,
              fontWeight: config?.body_font_weight,
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
            ":has(> input)": {
              height: config?.density === "comfortable" ? "50px" : "40px",
            },
            borderRadius: config?.input_border_radius ?? "8px",
            backgroundColor: config?.input_bg_color,
            input: {
              height: config?.density === "comfortable" ? "1.2em" : "initial",
              color: config?.input_text_color,
            },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            lineHeight: config?.density === "comfortable" ? "1.2em" : "initial",
            "&.MuiInputLabel-shrink": {
              lineHeight: "1.4375em",
            },
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
          root: { ...cssBaslineStyles },
        },
      },
      MuiScopedCssBaseline: {
        styleOverrides: {
          root: { ...cssBaslineStyles },
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
      divider: config?.text_secondary_color,
      background: {
        default: getColor(config?.bg_color),
        paper: getColor(config?.panel_bg_color),
      },
    },
    mixins: {
      // @ts-ignore
      MuiDataGrid: {
        // Pinned columns sections
        pinnedBackground: getColor(
          config?.custom_metadata?.audit?.selected_row_bg_color ??
            config?.panel_bg_color
        ),
        // Headers, and top & bottom fixed rows
        containerBackground: getColor(
          config?.custom_metadata?.audit?.column_header_bg_color ??
            config?.panel_bg_color
        ),
      },
    },
  };

  return themeOptions;
};
