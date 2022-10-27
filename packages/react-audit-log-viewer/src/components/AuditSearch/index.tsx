import { FC, useState, useRef } from "react";
import pick from "lodash/pick";
import startCase from "lodash/startCase";

import {
  ButtonGroup,
  Button,
  Stack,
  LinearProgress,
  IconButton,
  Box,
  InputBase,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import {
  PopoutCard,
  ConditionalAutocomplete,
  TimeRangeSelect,
  useInternalState,
} from "@pangeacyber/react-shared";

import AuditColumnsSettingButton from "../AuditColumnsPanel";
import { AuditQuery } from "../../utils/query";

interface Props {
  query: string;
  queryObj: AuditQuery | null;
  setQuery: (query: string) => void;
  setQueryObj: (queryObj: AuditQuery) => void;
  refresh: () => void;
  loading: boolean;
}

const operators = new Set(["AND", "OR"]);
const auditFields = [
  "actor",
  "action",
  "message",
  "new",
  "old",
  "status",
  "target",
];

const auditOptions = [
  {
    match: (current: string, previous: string) =>
      (!previous || operators.has(previous)) && !current.includes(":"),
    options: auditFields.map((fieldName) => ({
      value: `${fieldName}:`,
      label: startCase(fieldName),
    })),
  },
  {
    match: (current: string, previous: string) =>
      !operators.has(previous) && !current.includes(":"),
    options: [
      { value: "AND", label: "And" },
      { value: "OR", label: "Or" },
    ],
  },
];

const AuditSearch: FC<Props> = ({
  query,
  queryObj,
  setQuery,
  setQueryObj,
  refresh,
  loading,
}) => {
  const [query_, setQuery_] = useInternalState(query, setQuery);
  const [open, setOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
        <ButtonGroup sx={{ flexGrow: 1 }}>
          <ConditionalAutocomplete
            ref={searchRef}
            placeholder={"Search..."}
            value={query_}
            options={auditOptions}
            onChange={setQuery_}
            InputProps={{
              endAdornment: (
                <>
                  <IconButton
                    onClick={(event) => {
                      setOpen(true);
                      event.stopPropagation();
                    }}
                    size="small"
                  >
                    <FilterAltOutlinedIcon color="action" fontSize="small" />
                  </IconButton>
                </>
              ),
              size: "small",
              sx: {
                flexGrow: 1,
                borderBottomRightRadius: "0!important",
                borderTopRightRadius: "0!important",
                "&.MuiInputBase-root": {
                  padding: "8px!important",
                },
              },
            }}
          />
          <TimeRangeSelect
            value={pick(queryObj, ["after", "before", "since", "active"]) ?? {}}
            setValue={(rangeObj) => setQueryObj({ ...queryObj, ...rangeObj })}
            ButtonProps={{
              className: "PangeaInput-root",
              sx: {
                borderLeft: "none",
                borderBottomLeftRadius: "0!important",
                borderTopLeftRadius: "0!important",
              },
            }}
          />
        </ButtonGroup>
        <Button
          variant="contained"
          color="secondary"
          onClick={refresh}
          disabled={loading}
          data-testid="Audit-Search-Button"
        >
          Search
        </Button>
        <AuditColumnsSettingButton />
      </Stack>
      {loading ? (
        <LinearProgress
          color="info"
          sx={{ marginTop: 0.5, height: "2px", marginBottom: 0.5 }}
        />
      ) : (
        <Box sx={{ marginTop: 1, height: "2px" }} />
      )}
      <PopoutCard anchorRef={searchRef} open={open} setOpen={setOpen} flatTop>
        <div style={{ width: (searchRef.current?.clientWidth ?? 0) - 36 }}>
          {/*
            <FieldsForm
              object={queryObj}
              fields={AuditRecordFields}
              onSubmit={async (values) => {
                setQueryObj({ ...queryObj, ...values });
                setOpen(false);
              }}
              SaveButton={(props) => (
                <Button {...props}>
                  <FormattedMessage defaultMessage="Search" />
                </Button>
              )}
              multiColumn
            />
          */}
        </div>
      </PopoutCard>
    </>
  );
};

export default AuditSearch;
