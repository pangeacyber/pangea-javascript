import { Stack, StackProps } from "@mui/material";
import { FC } from "react";
import FileDropBox from "../FileDropBox";

const DataGridParentStack: FC<StackProps> = ({ children, ...props }) => {
  return (
    <Stack {...props}>
      <FileDropBox>{children}</FileDropBox>
    </Stack>
  );
};

export default DataGridParentStack;
