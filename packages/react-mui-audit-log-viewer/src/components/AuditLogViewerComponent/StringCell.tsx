import { Typography } from "@mui/material";
import { FC } from "react";

export const StringCell: FC<any> = (params) => {
  const { value } = params;

  return <Typography variant="body2">{value}</Typography>;
};
