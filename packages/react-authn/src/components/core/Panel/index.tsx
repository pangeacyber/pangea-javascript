import React, { FC } from "react";
import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import { Box, Stack, Typography } from "@mui/material";
import LogoBox from "../LogoBox";

interface PanelProps {
  brandName?: string;
  logoUrl?: string;
  logoHeight?: string;
  bgImage?: string;
  themeOptions?: ThemeOptions;
  sx?: SxProps;
  children: React.ReactNode;
}

const AuthNPanel: FC<PanelProps> = ({
  brandName,
  logoUrl,
  logoHeight,
  bgImage,
  children,
}) => {
  const backgroundStyles = bgImage
    ? {
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        ...backgroundStyles,
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
          <LogoBox url={logoUrl} height={logoHeight}/>
          {brandName && (
            <Typography variant="h5" mb={4}>
              {brandName}
            </Typography>
          )}
          {children}
        </Stack>
      </Box>
    </Box>
  );
};

export default AuthNPanel;
