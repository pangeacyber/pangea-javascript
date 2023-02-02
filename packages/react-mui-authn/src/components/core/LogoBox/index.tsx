import { FC } from "react";

import { Box, Typography } from "@mui/material";

interface LogoProps {
  url?: string;
  height?: string;
}

const LogoBox: FC<LogoProps> = ({ url = "", height = "40px" }) => {
  return (
    <>
      {url ? (
        <Box
          sx={{
            height: height,
            backgroundColor: "transparent",
            margin: "auto",
          }}
        >
          <img
            style={{ minWidth: "40px", maxWidth: "300px" }}
            height={height}
            src={url}
          />
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "transparent",
          }}
        >
          <Typography>Logo</Typography>
        </Box>
      )}
    </>
  );
};

export default LogoBox;
