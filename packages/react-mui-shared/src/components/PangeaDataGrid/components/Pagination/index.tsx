import { FC } from "react";
import { Stack } from "@mui/material";
import PageSelector from "./PageSelector";
import PageInputSelector from "./PageInputSelector";

interface PaginationProps {
  rowCount: number;
  paginationRowCount?: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = (props) => {
  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        color: "text.primary",
        p: 0.5,
        pb: 2,
      }}
      spacing={0.5}
    >
      <PageSelector {...props} />
      <PageInputSelector {...props} />
    </Stack>
  );
};

export default Pagination;
