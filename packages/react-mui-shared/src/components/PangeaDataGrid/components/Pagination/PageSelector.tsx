import React, { FC } from "react";
import range from "lodash/range";
import { useTheme } from "@mui/material/styles";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";

import LastPageOutlinedIcon from "@mui/icons-material/LastPageOutlined";
import FirstPageOutlinedIcon from "@mui/icons-material/FirstPageOutlined";

import { useTotalPages } from "./hooks";

const PageIconButton: FC<{
  title: string;
  disabled: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}> = ({ title, disabled, onClick, children }) => {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton disabled={disabled} onClick={onClick} size="small">
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

const PageButton: FC<{
  page: number;
  currentPage: number;
  onClick: (page: number) => void;
}> = ({ page, onClick, currentPage }) => {
  return (
    <Button
      onClick={() => onClick(page)}
      color={"secondary"}
      sx={{
        minWidth: 0,
        padding: 0,
        width: "26px",
        height: "26px",
        ...(page !== currentPage && {
          backgroundColor: "transparent",
          color: (theme) => theme.palette.text.primary,
          ":hover": {
            color: (theme) => theme.palette.secondary.contrastText,
          },
        }),
      }}
      variant={"contained"}
    >
      <Typography variant="body2">{page}</Typography>
    </Button>
  );
};

const GapButton: FC = () => {
  return (
    <Button
      color={"secondary"}
      disabled
      sx={{
        minWidth: 0,
        padding: 0,
        width: "26px",
        height: "26px",
      }}
      variant={"text"}
    >
      <Typography variant="body2">...</Typography>
    </Button>
  );
};

interface PaginationProps {
  rowCount: number;
  paginationRowCount?: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PageSelector: FC<PaginationProps> = ({
  rowCount,
  paginationRowCount,
  page,
  pageSize,
  onPageChange,
}) => {
  const unrestrictedTotalPages = useTotalPages(rowCount, pageSize);
  const totalPages = useTotalPages(paginationRowCount ?? rowCount, pageSize);

  const hasPrevious = page > 1;
  const hasNext = page < unrestrictedTotalPages;

  const iconProps: any = { fontSize: "xs" };

  const minPageShown =
    page - 2 - (page + 2 > totalPages ? page + 2 - totalPages : 0);
  const maxPageShown = page + 2 + (page - 2 < 1 ? 1 - (page - 2) : 0);

  return (
    <Stack
      direction="row"
      sx={{ color: "text.primary" }}
      alignItems="center"
      spacing={0.5}
    >
      <PageIconButton
        title="First page"
        disabled={!hasPrevious}
        onClick={() => onPageChange(1)}
      >
        <FirstPageOutlinedIcon {...iconProps} />
      </PageIconButton>
      <PageIconButton
        title="Previous page"
        disabled={!hasPrevious}
        onClick={() => onPageChange(page - 1)}
      >
        <NavigateBeforeOutlinedIcon {...iconProps} />
      </PageIconButton>
      <PageButton page={1} currentPage={page} onClick={onPageChange} />
      {minPageShown > 1 && <GapButton />}
      {range(minPageShown, maxPageShown + 1)
        .filter((p) => p > 1 && p < totalPages)
        .map((p) => {
          return (
            <PageButton
              key={`page-button-${p}`}
              page={p}
              currentPage={page}
              onClick={onPageChange}
            />
          );
        })}
      {maxPageShown < totalPages && <GapButton />}
      {totalPages > 1 && (
        <PageButton
          page={totalPages}
          currentPage={page}
          onClick={onPageChange}
        />
      )}
      {(paginationRowCount ?? rowCount) < rowCount && <GapButton />}
      <PageIconButton
        title="Next page"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
      >
        <NavigateNextOutlinedIcon {...iconProps} />
      </PageIconButton>
      {paginationRowCount === undefined && (
        <PageIconButton
          title="Last page"
          disabled={!hasNext}
          onClick={() => onPageChange(totalPages)}
        >
          <LastPageOutlinedIcon {...iconProps} />
        </PageIconButton>
      )}
    </Stack>
  );
};

export default PageSelector;
