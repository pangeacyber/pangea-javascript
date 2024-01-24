import { FC, useMemo } from "react";
import merge from "lodash/merge";
import cloneDeep from "lodash";

import { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";
import { ThemeProvider, ThemeOptions, createTheme } from "@mui/material/styles";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
import { useBranding } from "../../hooks";
import { Branding, PangeaAuth } from "@src/types";
import { getBrandingThemeOptions } from "@src/utils";

export interface BrandingThemeProviderProps {
  auth?: PangeaAuth;
  brandingId?: string;
  config?: Branding.Config;
  themeOptions?: Partial<ThemeOptions>;
  ThemeProviderProps?: Partial<ThemeProviderProps>;
  children?: JSX.Element;
}

const BrandingThemeProvider: FC<BrandingThemeProviderProps> = ({
  auth,
  brandingId,
  config: configProp,
  themeOptions = {},
  ThemeProviderProps = {},
  children,
}) => {
  const { config } = useBranding(auth, brandingId);
  const customTheme = useMemo(() => {
    if (!configProp && !config) {
      return createTheme(themeOptions);
    }

    try {
      const themeOptions_ = getBrandingThemeOptions(
        configProp ?? (config || {})
      );
      return createTheme(merge({ ...themeOptions_ }, { ...themeOptions }));
    } catch (e) {
      console.error(e);
      // FIXME: Argument of type '{ components: AllComponents; }' is not assignable to parameter of type 'ThemeOptions'.
      // @ts-ignore
      return createTheme(themeOptions);
    }
  }, [config]);

  return (
    <ThemeProvider theme={customTheme} {...ThemeProviderProps}>
      <ScopedCssBaseline
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </ScopedCssBaseline>
    </ThemeProvider>
  );
};

export default BrandingThemeProvider;
