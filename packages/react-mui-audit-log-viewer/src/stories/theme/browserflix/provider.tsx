import React, { FC } from "react";

import { BROWSERFLIX } from "./config";
import ConfigThemeProvider from "../provider";

const BrowserflixThemeProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ConfigThemeProvider config={BROWSERFLIX}>{children}</ConfigThemeProvider>
  );
};

export default BrowserflixThemeProvider;
