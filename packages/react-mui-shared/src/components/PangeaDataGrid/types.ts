import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export namespace PDG {
  export type FieldType = "string" | "date" | "dateTime";

  export interface CellProps {
    params: GridRenderCellParams;
  }

  export interface GridField extends GridColDef {
    name?: string;
    label?: string;
    type?: FieldType;
  }

  export interface GridObject {
    [key: string]: any;
  }

  export type GridSchemaFields<T = GridObject> = Partial<
    Record<keyof T, Partial<GridField>>
  >;
}
