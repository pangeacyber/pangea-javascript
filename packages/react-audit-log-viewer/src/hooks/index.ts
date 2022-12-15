import { useMemo } from "react";
import startCase from "lodash/startCase";

import { GridColDef } from "@mui/x-data-grid";

const constructGridColumnsFromFields = (
  fields: any,
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
          : 180,
      type: fieldObj?.type ?? typeof fieldObj?.default ?? "string",
      headerName: startCase(fieldObj?.label || fieldName),
      valueGetter: (params) => {
        const value = params.row[params.field];
        return typeof value === "string" ? value : JSON.stringify(value);
      },
    };

    columns.push(col);
  });

  return columns;
};

export const useFormSchemaColumns = (
  fields: any,
  order: string[] | undefined = undefined
): GridColDef[] => {
  const columns = useMemo(() => {
    return constructGridColumnsFromFields(fields, order);
  }, [fields, order]);

  return columns;
};
