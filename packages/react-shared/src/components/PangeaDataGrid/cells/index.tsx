import { GridRenderCellParams } from "@mui/x-data-grid";
import { FC } from "react";

import { Tooltip, Typography, Chip, Stack } from "@mui/material";

export interface CellProps {
  params: GridRenderCellParams;
}

export const TextCell: FC<CellProps> = ({ params }) => {
  const { value } = params;

  return (
    <Tooltip title={value ?? ""} placement="bottom-start">
      <Typography variant="body2">{value}</Typography>
    </Tooltip>
  );
};

export const DateCell: FC<CellProps> = ({ params }) => {
  const { value } = params;

  const date = new Date(value);
  if (date.toString() === "Invalid Date") {
    return <Typography variant="body2">Never</Typography>;
  }
  return <Typography variant="body2">{date.toDateString()}</Typography>;
};

export const DateTimeCell: FC<CellProps> = ({ params }) => {
  const { value } = params;

  const date = new Date(value);
  if (date.toString() === "Invalid Date") {
    return <Typography variant="body2">Never</Typography>;
  }
  return (
    <Typography variant="body2">
      {date.toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: undefined,
      })}
    </Typography>
  );
};

export const SingleSelectCell: FC<CellProps> = ({ params }) => {
  const { value } = params;

  return value ? <Chip size="small" label={value} /> : <></>;
};

export const MultiSelectCell: FC<CellProps> = ({ params }) => {
  const { value } = params;

  if (Array.isArray(value)) {
    return (
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ overflowX: "auto", overflowY: "hidden" }}
      >
        {value
          .filter((v) => {
            return typeof v === "string";
          })
          .map((v, i) => (
            <Chip
              size="small"
              key={`${params.id}-chip-${v}-${i}`}
              sx={{
                color: "text.secondary",
                // FIXME: Shared-color
                backgroundColor: "#000",
              }}
              label={v}
            />
          ))}
      </Stack>
    );
  }
  return <SingleSelectCell params={params} />;
};
