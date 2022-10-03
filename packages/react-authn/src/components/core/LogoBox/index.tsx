import { FC } from "react";

import { Box, Typography } from "@mui/material";

interface LogoProps {
  url?: string;
}

const LogoBox: FC<LogoProps> = ({ url = "" }) => {
  return (
    <>
      {url ? (
        <Box
          sx={{
            height: "40px",
            backgroundColor: "transparent",
            margin: "auto",
          }}
        >
          <img
            style={{ minWidth: "40px", maxWidth: "300px" }}
            height={"40px"}
            src={url}
          />
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: "#F6F9FC",
          }}
        >
          <Typography>Logo</Typography>
        </Box>
      )}
    </>
  );
};

export default LogoBox;
