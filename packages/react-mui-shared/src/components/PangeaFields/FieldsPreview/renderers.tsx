import { Stack, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { PreviewFieldValueProps } from "./types";
import CopyButton from "../../IconButtons/CopyButton";
import { getDisplayDateRange } from "../../RelativeDateRangeField";
import JsonViewer from "../../JsonViewer";
import { DateCell, DateTimeCell } from "../../PangeaDataGrid/cells";
import ListCell from "../ListCell";

export const StringPreviewField: FC<PreviewFieldValueProps> = ({ value }) => {
  return (
    <Typography
      variant="body2"
      sx={{
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {value}
    </Typography>
  );
};

export const StringWithCopyPreviewField: FC<PreviewFieldValueProps> = ({
  value,
  label,
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ width: "100%", overflow: "hidden" }}
    >
      <Typography
        variant="body2"
        sx={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {value}
      </Typography>
      <CopyButton size="small" label={value} value={value} />
    </Stack>
  );
};

export const DatePreviewField: FC<PreviewFieldValueProps> = ({ value }) => {
  // @ts-ignore
  return <DateCell params={{ value }} />;
};

export const DateTimePreviewField: FC<PreviewFieldValueProps> = ({ value }) => {
  // @ts-ignore
  return <DateTimeCell params={{ value }} />;
};

export const RelativeDateRangePreviewField: FC<PreviewFieldValueProps> = ({
  value,
  ...props
}) => {
  if (!value) return <StringPreviewField value={"None"} {...props} />;

  return <StringPreviewField value={getDisplayDateRange(value)} {...props} />;
};

export const BooleanPreviewField: FC<PreviewFieldValueProps> = ({
  value,
  ...props
}) => {
  if (value) {
    return <StringPreviewField value={"True"} {...props} />;
  }

  return <StringPreviewField value={"False"} {...props} />;
};

export const StringArrayPreviewField: FC<PreviewFieldValueProps> = ({
  value,
  fieldKey,
}) => {
  const value_ = useMemo<string[]>(() => {
    const valueSet = new Set<string>(value);
    return Array.from(valueSet);
  }, [JSON.stringify(value)]);

  return <ListCell value={value_} name={fieldKey} />;
};

export const JsonPreviewField: FC<PreviewFieldValueProps> = ({ value }) => {
  if (!value) return null;

  return <JsonViewer src={value} />;
};
