import { ReactNode } from "react";
import { GridColDef } from "@mui/x-data-grid";

import { Stack } from "@mui/material";

export const ACTION_COLUMN = "__action__";

export const constructActionColumn = <T extends any = any>(
  renderActions: (object: T) => ReactNode,
  overrides: Partial<GridColDef> = {}
): GridColDef => {
  return {
    field: ACTION_COLUMN,
    sortable: false,
    resizable: false,
    filterable: false,
    minWidth: 50,
    flex: 1,
    editable: false,
    headerName: "",
    renderCell: (params) => {
      const object: T = params.row;
      return (
        <Stack justifyContent="end" direction="row" sx={{ width: "100%" }}>
          {renderActions(object)}
        </Stack>
      );
    },
    ...overrides,
  };
};
