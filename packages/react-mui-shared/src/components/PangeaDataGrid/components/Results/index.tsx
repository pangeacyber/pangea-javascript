import {
  Stack,
  Typography,
  Box,
  Select,
  SelectProps,
  MenuItem,
} from "@mui/material";
import { FC } from "react";

export const ResultsBarSelect: FC<SelectProps> = (props) => {
  return (
    <Select
      variant="standard"
      size="small"
      color="secondary"
      sx={{
        ".MuiSelect-select": {
          paddingTop: "6px",
          paddingLeft: "4px",
        },
        color: "inherit",
        ":before": {
          border: "none!important",
        },
        ":after": {
          border: "none",
        },
      }}
      {...props}
    />
  );
};

interface ResultsBarProps {
  rowCount: number;
  page: number;
  pageSize: number;
  onPageSizeChange?: (pageSize: number) => void;
  rowsPerPageOptions?: number[];
  maxResults?: number;
  onMaxResultChange?: (maxResults: number) => void;
  maxResultOptions?: number[];
}

const ResultsBar: FC<ResultsBarProps> = ({
  rowCount,
  page,
  pageSize,
  onPageSizeChange,
  rowsPerPageOptions,
  maxResults,
  onMaxResultChange,
  maxResultOptions,
}) => {
  const offset = Math.max(page - 1, 0) * pageSize;
  const limit = pageSize;
  const total = rowCount;

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        p: 0.5,
        pt: 0,
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Box>
          {total > 0 && (
            <Typography variant="body2" color="textSecondary">
              Results: {offset + 1} - {Math.min(offset + limit, total)} of{" "}
              {total}
            </Typography>
          )}
        </Box>
        {total > 0 &&
          !!maxResults &&
          !!onMaxResultChange &&
          !!maxResultOptions && (
            <>
              <Typography color="textSecondary" variant="body2">
                |
              </Typography>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ color: "text.secondary", alignItems: "center" }}
              >
                <Typography variant="body2" color="textSecondary">
                  Limit:
                </Typography>
                <ResultsBarSelect
                  value={maxResults}
                  onChange={(event) => {
                    const value = event.target.value;
                    onMaxResultChange(Number(value));
                  }}
                >
                  {maxResultOptions.map((pageSizeOption, idx) => {
                    return (
                      <MenuItem
                        key={`row-size-option-${pageSizeOption}-${idx}`}
                        value={pageSizeOption}
                      >
                        <Typography variant="body2">
                          {pageSizeOption}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </ResultsBarSelect>
              </Stack>
            </>
          )}
      </Stack>
      {!!onPageSizeChange && !!rowsPerPageOptions && (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ color: "text.secondary", alignItems: "center" }}
        >
          <Typography variant="body2" color="textSecondary">
            Rows per page:
          </Typography>
          <ResultsBarSelect
            value={limit}
            onChange={(event) => {
              const value = event.target.value;
              onPageSizeChange(Number(value));
            }}
          >
            {rowsPerPageOptions.map((pageSizeOption, idx) => {
              return (
                <MenuItem
                  key={`row-size-option-${pageSizeOption}-${idx}`}
                  value={pageSizeOption}
                >
                  <Typography variant="body2">{pageSizeOption}</Typography>
                </MenuItem>
              );
            })}
          </ResultsBarSelect>
        </Stack>
      )}
    </Stack>
  );
};

export default ResultsBar;
