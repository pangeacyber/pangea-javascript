import { FC } from "react";
import { GridRenderPaginationProps } from "@mui/x-data-grid";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import PageSelector from "./PageSelector";
import PageInputSelector from "./PageInputSelector";

interface PaginationProps {
  rowCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = (props) => {
  return (
    <Stack
      direction="row"
      width="100%"
      justifyContent="space-between"
      sx={{ color: "text.primary", p: 0.5, pb: 2 }}
      alignItems="center"
      spacing={0.5}
    >
      <PageSelector {...props} />
      <PageInputSelector {...props} />
    </Stack>
  );
};

export default Pagination;
