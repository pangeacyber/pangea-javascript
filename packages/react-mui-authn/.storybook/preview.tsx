import React, { FC } from "react";
import {
  Box,
  CssBaseline,
  ScopedCssBaseline,
  ThemeProvider,
} from "@mui/material";
import { Preview } from "@storybook/react";
import {
  DecoratorHelpers,
  withThemeFromJSXProvider,
} from "@storybook/addon-themes";
const { pluckThemeFromContext } = DecoratorHelpers;

import "@fontsource/kanit/300.css";
import "@fontsource/kanit/400.css";
import "@fontsource/kanit/500.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

import "./common.css";

import AuthNPanel from "../src/components/core/Panel";
import {
  genericTheme,
  pangeaTheme,
  browserflixTheme,
  darkTheme,
} from "../src/stories/themes";
import { getBrandingData, getOptions } from "./utils";

interface ProviderProps {
  theme: any;
  children: React.ReactNode;
}

const FlowThemeProvider: FC<ProviderProps> = ({ theme, children }) => {
  return (
    <ThemeProvider theme={theme}>
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

export const decorators = [
  (Story, context) => {
    const selectedTheme = pluckThemeFromContext(context);
    const branding = getBrandingData(selectedTheme);

    context.args.options = getOptions(branding);

    return (
      <Box className="widget">
        <AuthNPanel
          brandName={
            branding.authn_show_name === "yes" ? branding.brand_name : ""
          }
          logoUrl={branding.brand_logo}
          logoHeight={branding.brand_logo_height}
          bgColor={branding.bg_color}
          bgImage={branding.bg_image}
          density={branding.density}
        >
          <Story />
        </AuthNPanel>
      </Box>
    );
  },
  withThemeFromJSXProvider({
    themes: {
      generic: genericTheme,
      pangea: pangeaTheme,
      browserflix: browserflixTheme,
      dark: darkTheme,
    },
    defaultTheme: "generic",
    Provider: FlowThemeProvider,
    GlobalStyles: CssBaseline,
  }),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    expanded: true, // Adds the description and default columns
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
};

const preview: Preview = {
  parameters: {
    parameters: {
      layout: "fullscreen",
    },
  },
};

export default preview;
