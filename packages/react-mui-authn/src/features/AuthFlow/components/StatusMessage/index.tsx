import { FC } from "react";
import { Stack } from "@mui/material";
import { BodyText } from "@src/components/core/Text";

interface Props {
  message: string;
}

const StatusMessageView: FC<Props> = ({ message }) => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "200px" }}
    >
      <BodyText>{message}</BodyText>
    </Stack>
  );
};

export default StatusMessageView;
