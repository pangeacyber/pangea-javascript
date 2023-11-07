import { FC } from "react";
import { SxProps, Typography, useTheme } from "@mui/material";

interface Props {
  color?: string;
  sxProps?: SxProps;
}

export const BodyText: FC<Props> = ({ sxProps = {}, children }) => {
  const theme = useTheme();

  return (
    <Typography
      variant="body2"
      sx={{
        color: theme.palette.text.secondary,
        ...sxProps,
      }}
    >
      {children}
    </Typography>
  );
};

export const ErrorText: FC<Props> = ({ sxProps = {}, children }) => {
  return (
    <Typography
      variant="body2"
      color="error"
      sx={{
        ...sxProps,
      }}
    >
      {children}
    </Typography>
  );
};
