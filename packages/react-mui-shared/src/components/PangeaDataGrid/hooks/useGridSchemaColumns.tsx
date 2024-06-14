import { useMemo, FC } from "react";
import get from "lodash/get";
import startCase from "lodash/startCase";

import { GridColDef } from "@mui/x-data-grid";
import { PDG } from "../types";
import { DateCell, DateTimeCell, TextCell, TextWithCopyCell } from "../cells";

const CELL_TYPE_MAP: Partial<Record<PDG.FieldType, FC<PDG.CellProps>>> = {
  string: TextCell,
  stringWithCopy: TextWithCopyCell,
  date: DateCell,
  dateTime: DateTimeCell,
  stringDateTime: DateTimeCell,
};

const constructGridColumnsFromFields = (
  fields: PDG.GridSchemaFields,
  order: string[] | undefined = undefined
): GridColDef[] => {
  const columns: GridColDef[] = [];

  (order || Object.keys(fields)).forEach((fieldName) => {
    const fieldObj = fields[fieldName];
    const col: GridColDef = {
      ...fieldObj,
      field: fieldName,
      width:
        !!fieldObj?.width && typeof fieldObj?.width === "number"
          ? fieldObj?.width
          : 125,
      type: fieldObj?.type ?? "string",
      headerName:
        fieldObj?.headerName ?? startCase(fieldObj?.label || fieldName),
      valueGetter: (params) => {
        const value = params.row[params.field];
        return typeof value === "string" ? value : JSON.stringify(value);
      },
    };

    if (!fieldObj?.renderCell) {
      const Cell = get(CELL_TYPE_MAP, col.type ?? "", TextCell);
      col.renderCell = (params) => <Cell params={params} />;
    }

    columns.push(col);
  });

  return columns;
};

export const useGridSchemaColumns = (
  fields: any,
  order: string[] | undefined = undefined
): GridColDef[] => {
  const columns = useMemo(() => {
    return constructGridColumnsFromFields(fields, order);
  }, [fields, order]);

  return columns;
};
