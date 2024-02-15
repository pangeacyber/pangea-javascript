import { Typography } from "@mui/material";
import { FC, ReactNode } from "react";

export const StringCell: FC<{ value: ReactNode }> = (params) => {
  const { value } = params;

  return <Typography variant="body2">{value}</Typography>;
};
