import {
  ButtonProps,
  Chip,
  ChipProps,
  Container,
  Divider,
  Stack,
} from "@mui/material";
import React, { FC, ReactNode } from "react";
import JoinDivider from "./JoinDivider";

interface Props {
  children: ReactNode;
  joinBy?: string;
  NewButtonProps: FC<ButtonProps>;
}

const JoinChip: FC<ChipProps> = (props) => {
  return (
    <Stack alignItems="center">
      <JoinDivider />
      <Chip
        sx={{
          backgroundColor: (theme) => theme.palette.secondary.main,
          color: "#fff",
          paddingX: 0.5,
        }}
        size="small"
        {...props}
      />
      <JoinDivider />
    </Stack>
  );
};

export default JoinChip;
