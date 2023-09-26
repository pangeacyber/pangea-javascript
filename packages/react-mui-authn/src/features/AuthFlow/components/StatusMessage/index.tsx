import { FC } from "react";
import { Stack, Typography } from "@mui/material";

interface Props {
  message: string;
}

const StatusMessage: FC<Props> = ({ message }) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "200px" }}
    >
      <Typography variant="body2">{message}</Typography>
    </Stack>
  );
};

export default StatusMessage;
