import React, { FC } from "react";
import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import LogoBox from "../LogoBox";

interface PanelProps {
  companyName?: string;
  logoUrl?: string;
  backgroundImage?: string
  themeOptions?: ThemeOptions;
  sx?: SxProps;
  children: React.ReactNode;
}

const AuthNPanel: FC<PanelProps> = ({ 
  companyName, 
  logoUrl, 
  backgroundImage, 
  children
}) => {
  const backgroundStyles = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundPosition: "center",
  } : {};

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        ...backgroundStyles
      }}
    >
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
    </Box>
  )
};

export default AuthNPanel;