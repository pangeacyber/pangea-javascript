import React, { FC } from "react";
import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import LogoBox from "../LogoBox";

interface LayoutProps {
  companyName?: string;
  logoUrl?: string;
  themeOptions?: ThemeOptions;
  sx?: SxProps;
  children: React.ReactNode;
}

const AuthNLayout: FC<LayoutProps> = ({ companyName, logoUrl, children }) => {
  return (
    <Box
      className="widget"
      sx={{
        width: "400px",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 5,
      }}
    >
      <Stack spacing={2}>
        {logoUrl && <LogoBox url={logoUrl} />}
        {companyName && <Typography variant="h3">{companyName}</Typography>}
        {children}
      </Stack>
    </Box>
  )
};

export default AuthNLayout;