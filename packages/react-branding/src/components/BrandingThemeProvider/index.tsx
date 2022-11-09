import { FC, useMemo, ReactNode } from "react";

import { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";
import { ThemeProvider, ThemeOptions, createTheme } from "@mui/material/styles";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
import { useBranding } from "../../hooks";
import { Branding, PangeaAuth } from "@src/types";
import { getBrandingThemeOptions } from "@src/utils";

export interface BrandingThemeProviderProps {
  auth: PangeaAuth;
  config?: Branding.Config;
  themeOptions?: Partial<ThemeOptions>;
  ThemeProviderProps?: Partial<ThemeProviderProps>;
  children?: ReactNode;
}

const BrandingThemeProvider: FC<BrandingThemeProviderProps> = ({
  auth,
  config: configProp,
  themeOptions = {},
  ThemeProviderProps = {},
  children,
}) => {
  const { config } = useBranding(auth);

  const customTheme = useMemo(() => {
    try {
      const themeOptions_ = getBrandingThemeOptions(configProp ?? config);
      return createTheme({ ...themeOptions_, ...themeOptions });
    } catch {
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
