import { FC, useMemo } from "react";

import WarningIcon from "@mui/icons-material/Warning";

import { Stack, Tooltip } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Audit } from "../../types";
import ListTooltip from "../ListTooltip";

const FieldErrorsIcon: FC<GridRenderCellParams> = (params) => {
  const record: Audit.FlattenedAuditRecord = params.row;

  const messages = useMemo<string[]>(() => {
    if (!record?.err) return [];

    try {
      const errs: Audit.FieldError[] = JSON.parse(record?.err ?? "");
      if (!Array.isArray(errs)) {
        throw Error("Expected err field to be an array");
      }

      return errs.map((err) => {
        return `${err.field}: ${err?.error}`;
      });
    } catch (e) {
      console.error(`Unexpected err field format - ${e}`);
    }

    return [];
    // @ts-ignore
  }, [record?.err]);

  if (!messages.length) return null;
  return (
    <Stack
      sx={{
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        marginBottom: "-4px",
      }}
    >
      <ListTooltip data={messages}>
        <WarningIcon color="warning" fontSize="small" />
      </ListTooltip>
    </Stack>
  );
};

export const AuditErrorsColumn: GridColDef = {
  field: "__errors__",
  sortable: false,
  resizable: false,
  width: 50,
  editable: false,
  filterable: false,
  disableColumnMenu: true,
  headerName: "",
  renderCell: FieldErrorsIcon,
};
