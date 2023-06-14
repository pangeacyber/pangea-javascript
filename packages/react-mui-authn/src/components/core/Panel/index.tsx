import React, { FC } from "react";
import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import { Box, Stack, Typography } from "@mui/material";
import LogoBox from "../LogoBox";

interface PanelProps {
  brandName?: string;
  logoUrl?: string;
  logoHeight?: string;
  bgColor?: string;
  bgImage?: string;
  density?: string;
  themeOptions?: ThemeOptions;
  sx?: SxProps;
  children: React.ReactNode;
}

const AuthNPanel: FC<PanelProps> = ({
  brandName,
  logoUrl,
  logoHeight,
  bgColor = "transparent",
  bgImage,
  density = "normal",
  children,
}) => {
  const panelStyles =
    density === "comfortable"
      ? { width: "448px", padding: "56px" }
      : { width: "400px", padding: "32px" };
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
        backgroundColor: bgColor,
        ...backgroundStyles,
      }}
    >
      <Box
        className="widget"
        sx={{
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          ...panelStyles,
        }}
      >
        <Stack spacing={2} mb={2} textAlign="center">
          <>
            <LogoBox url={logoUrl} height={logoHeight} />
            {brandName && <Typography variant="h6">{brandName}</Typography>}
            {children}
          </>
        </Stack>
      </Box>
    </Box>
  );
};

export default AuthNPanel;
