import React, { FC } from "react";

import { getBrandingThemeOptions } from "@pangeacyber/react-mui-branding";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, ScopedCssBaseline } from "@mui/material";

const ConfigThemeProvider: FC<{
  children: React.ReactNode;
  config: Record<string, any>;
}> = ({ children, config }) => {
  return (
    <ThemeProvider theme={createTheme(getBrandingThemeOptions(config))}>
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
