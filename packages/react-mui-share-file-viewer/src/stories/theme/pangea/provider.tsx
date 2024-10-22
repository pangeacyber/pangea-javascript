import React, { FC } from "react";

import { PANGEA } from "./config";
import ConfigThemeProvider from "../provider";

const PangeaThemeProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ConfigThemeProvider config={PANGEA}>{children}</ConfigThemeProvider>;
};

export default PangeaThemeProvider;
