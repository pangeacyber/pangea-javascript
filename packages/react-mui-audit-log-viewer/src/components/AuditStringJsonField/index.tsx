import { FC, useMemo } from "react";
import isEmpty from "lodash/isEmpty";

import {
  Container,
  Typography,
  Stack,
  Box,
  Tooltip,
  TypographyProps,
} from "@mui/material";

import { JsonViewer } from "@pangeacyber/react-mui-shared";
// FIXME: Diff needs to be split out to react-mui-shared
import { Change } from "../../hooks/diff";
import DateTimeFilter from "../AuditLogViewerComponent/DateTimeFilter";

export const ChangesTypography: FC<{
  value: string;
  changes?: Change[];
  uniqueId: string;
  TypographyProps?: Partial<TypographyProps>;
}> = ({ value, changes, uniqueId, TypographyProps }) => {
  return (
    <Typography
      variant="body2"
      sx={{
        ".PangeaHighlight-highlight": {
          backgroundColor: "#FFFF0B",
          color: "#000",
        },
        ".PangeaHighlight-success": {
          color: (theme) => theme.palette.success.main,
        },
      }}
      {...TypographyProps}
    >
      {!isEmpty(changes)
        ? changes?.map((change, idx) => {
            const span_ = (
              <span
                key={`change-found-${idx}-${uniqueId}`}
                className={
                  change.added
                    ? "PangeaHighlight-highlight PangeaHighlight-new"
                    : change.removed
                      ? "PangeaHighlight-highlight PangeaHighlight-removed"
                      : change.redacted
                        ? "PangeaHighlight-success PangeaHighlight-pfe"
                        : ""
                }
              >
                {change.value}
              </span>
            );

            return !!change.info ? (
              <Tooltip
                title={change.info}
                key={`tooltip-change-found-${idx}-${uniqueId}`}
              >
                {span_}
              </Tooltip>
            ) : (
              span_
            );
          })
        : value ?? "-"}
    </Typography>
  );
};

export interface StringFieldProps {
  inRow?: boolean;
  title: string;
  field: string;
  value: string | undefined;
  changes?: Change[];
  uniqueId: string;
}

const StringFieldTypographyProps: Partial<TypographyProps> = {
  color: "textPrimary",
};
export const StringField: FC<StringFieldProps> = ({
  title,
  inRow,
  value: value_,
  changes,
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
        <ChangesTypography
          value={value}
          changes={changes}
          uniqueId={uniqueId}
          TypographyProps={StringFieldTypographyProps}
        />
      </Container>
    </Stack>
  );
};

export const DateTimeField: FC<StringFieldProps> = (props) => {
  const direction = props.inRow ? "column" : "row";

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

  return (
    <Stack spacing={1} direction={direction} alignItems="start">
      <Typography variant="body2" sx={{ width: "120px", paddingTop: "4px" }}>
        {props.title}
      </Typography>
      <Container sx={{ padding: "4px!important", width: "fit-content" }}>
        <DateTimeFilter value={dateTimeString} field={props.field}>
          <Typography variant="body2" {...StringFieldTypographyProps}>
            {dateTimeString}
          </Typography>
        </DateTimeFilter>
      </Container>
    </Stack>
  );
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
              color: c.redacted ? "success" : "highlight",
              info: c.info,
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
