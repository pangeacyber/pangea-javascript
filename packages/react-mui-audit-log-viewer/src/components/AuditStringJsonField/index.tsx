import { FC, useMemo } from "react";
import isEmpty from "lodash/isEmpty";

import { Container, Typography, Stack, Box } from "@mui/material";

import { JsonViewer } from "@pangeacyber/react-mui-shared";
// FIXME: Diff needs to be split out to react-mui-shared
import { Change } from "../../hooks/diff";

export interface StringFieldProps {
  inRow?: boolean;
  title: string;
  field: string;
  value: string | undefined;
  changes?: Change[];
  uniqueId: string;
}

export const StringField: FC<StringFieldProps> = ({
  title,
  inRow,
  value: value_,
  changes = [],
  uniqueId,
}) => {
  const direction = inRow ? "column" : "row";

  const value = typeof value_ === "string" ? value_ : JSON.stringify(value_);
  return (
    <Stack spacing={1} direction={direction} alignItems="start">
      <Typography variant="body2" sx={{ width: "120px", paddingTop: "4px" }}>
        {title}
      </Typography>
      <Container sx={{ padding: "4px!important" }}>
        <Typography
          color="textPrimary"
          variant="body2"
          sx={{
            ".Pangea-Highlight": {
              backgroundColor: "#FFFF0B",
              color: "#000",
            },
          }}
        >
          {!isEmpty(changes)
            ? changes.map((change, idx) => {
                return (
                  <span
                    key={`change-found-${idx}-${uniqueId}`}
                    className={
                      change.added
                        ? "Pangea-Highlight Pangea-HighlightNew"
                        : change.removed
                        ? "Pangea-Highlight Pangea-HighlightRemoved"
                        : ""
                    }
                  >
                    {change.value}
                  </span>
                );
              })
            : value ?? "-"}
        </Typography>
      </Container>
    </Stack>
  );
};

export const DateTimeField: FC<StringFieldProps> = (props) => {
  const dateTimeString = useMemo(() => {
    let dateTimeString = "-";
    if (props.value) {
      const dateObj = new Date(props.value);
      dateTimeString = dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: undefined,
      });
    }

    return dateTimeString;
  }, [props.value]);

  return <StringField {...props} value={dateTimeString} />;
};

const parseJson = (value: any): object | null => {
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const StringJsonField: FC<{
  inRow?: boolean;
  title: string;
  value: any;
  changes?: Change[];
  uniqueId: string;
  shouldHighlight?: (c: Change) => boolean;
  field: string;
}> = ({
  title,
  inRow,
  value,
  changes = [],
  uniqueId,
  shouldHighlight = () => true,
  field,
}) => {
  const jsonValue = parseJson(value);

  if (jsonValue && typeof jsonValue === "object")
    return (
      <Stack direction="row" spacing={1} sx={{ width: "100%", pt: 0.5 }}>
        <Typography variant="body2" sx={{ width: "120px" }}>
          {title}
        </Typography>
        <Box sx={{ width: "100%", flexGrow: "1", marginTop: "4px!important" }}>
          <JsonViewer
            src={jsonValue}
            highlights={changes.filter(shouldHighlight).map((c) => ({
              prefix: c.prefix,
              suffix: c.suffix,
              value: c.value,
              color: "highlight",
            }))}
            depth={3}
          />
        </Box>
      </Stack>
    );

  return (
    <StringField
      title={title}
      value={value}
      inRow={inRow}
      changes={changes}
      uniqueId={uniqueId}
      field={field}
    />
  );
};

export default StringJsonField;
