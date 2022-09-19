import { FC, useState, useEffect } from "react";
import { Stack, Typography, TextField } from "@mui/material";

import { useTotalPages } from "./hooks";

interface PaginationProps {
  rowCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PageInputSelector: FC<PaginationProps> = ({
  rowCount,
  page,
  pageSize,
  onPageChange,
}) => {
  const totalPages = useTotalPages(rowCount, pageSize);
  // FIXME: Use internal state?
  const [page_, setPage_] = useState(page);

  useEffect(() => {
    setPage_(page);
  }, [page]);

  const setPage = (p: any) => {
    setPage_(p);
    const pNum = Number(p);
    if (p != page && pNum >= 1 && pNum <= totalPages) {
      onPageChange(p);
    }
  };

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Typography variant="body2" color="textSecondary">
        Page
      </Typography>
      <TextField
        type="number"
        value={page_}
        size="small"
        sx={{
          padding: 0,
          ".MuiOutlinedInput-input": {
            padding: "6px 8px",
          },
        }}
        disabled={totalPages === 1}
        onChange={(event) => {
          const value = Number(event.target.value);
          setPage(event.target.value);
        }}
        InputProps={{ inputProps: { min: 1, max: totalPages } }}
      />
      <Typography variant="body2" color="textSecondary">
        of {totalPages}
      </Typography>
    </Stack>
  );
};

export default PageInputSelector;
