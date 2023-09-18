import { FC } from "react";

import { Tooltip, Typography, Chip, Stack } from "@mui/material";
import { lighten, useTheme } from "@mui/material/styles";
import { PDG } from "../types";
import { limitCharacters } from "../../../utils";

export const TextCell: FC<PDG.CellProps> = ({ params, color }) => {
  const { value } = params;

  return (
    <Tooltip
      title={limitCharacters(value ?? "", 1000)}
      placement="bottom-start"
    >
      <Typography variant="body2" color={color}>
        {value}
      </Typography>
    </Tooltip>
  );
};

export const DateCell: FC<PDG.CellProps> = ({ params }) => {
  const { value } = params;

  const date = new Date(value);
  if (date.toString() === "Invalid Date") {
    return <Typography variant="body2">Never</Typography>;
  }
  return <Typography variant="body2">{date.toDateString()}</Typography>;
};

export const DateTimeCell: FC<PDG.CellProps> = ({ params }) => {
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

export const SingleSelectCell: FC<PDG.CellProps> = ({ params, color }) => {
  const { value } = params;

  return value ? (
    <Chip size="small" className={"PangeaDataGrid-Chip"} label={value} />
  ) : (
    <></>
  );
};

export const MultiSelectCell: FC<PDG.CellProps> = ({ params }) => {
  const { value } = params;
  const theme = useTheme();

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
              className={"PangeaDataGrid-Chip"}
              sx={{
                color: "text.secondary",
                backgroundColor: lighten(theme.palette.primary.main, 0.2),
              }}
              label={v}
            />
          ))}
      </Stack>
    );
  }
  return <SingleSelectCell params={params} />;
};
