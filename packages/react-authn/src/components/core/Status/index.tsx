import React, { FC } from "react";
import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import { Button, Link, Stack, Typography } from "@mui/material";
import LogoBox from "../LogoBox";

interface LinkProps {
  url: string;
  label: string;
}

interface StatusProps {
  title?: string;
  message?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  links?: Array<LinkProps>;
}

const StatusBox: FC<StatusProps> = ({
  title = "",
  message = "",
  buttonLabel = "",
  buttonUrl = "",
  links = [],
}) => {
  return (
    <Stack>
      {title && (
        <Typography variant="h5" mb={4} sx={{ fontWeight: "600" }}>
          {title}
        </Typography>
      )}
      {message && (
        <Typography variant="body2" mb={4}>
          {message}
        </Typography>
      )}
      {buttonLabel && buttonUrl && (
        <Button color="primary" sx={{ mb: 4 }}>
          {buttonLabel}
        </Button>
      )}
      {links.length > 0 && (
        <Stack spacing={1}>
          {links.map((item, idx) => {
            return (
              <Link key={`link-${idx}`} underline="none" href={item.url}>
                {item.label}
              </Link>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default StatusBox;
