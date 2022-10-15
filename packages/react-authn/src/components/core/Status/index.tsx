import { FC } from "react";

import { Button, Link, Stack, Typography } from "@mui/material";

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
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
      )}
      {message && (
        <Typography variant="body2" mb={2}>
          {message}
        </Typography>
      )}
      {buttonLabel && buttonUrl && (
        <Button color="primary" sx={{ mb: 2 }}>
          {buttonLabel}
        </Button>
      )}
      {links.length > 0 && (
        <Stack spacing={1}>
          {links.map((item, idx) => {
            return (
              <Typography variant="body2">
                <Link key={`link-${idx}`} underline="none" href={item.url}>
                  {item.label}
                </Link>
              </Typography>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default StatusBox;
