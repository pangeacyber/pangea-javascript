import {
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { GridBaseColDef } from "@mui/x-data-grid/internals";
import { ReactNode } from "react";

export namespace PDG {
  export type FieldType = "string" | "date" | "dateTime";

  export interface CellProps {
    params: GridRenderCellParams;
  }

  export interface GridField extends GridBaseColDef {
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

  export interface CustomPinnedGridColDef
    extends GridBaseColDef<any, any, any> {
    renderPinnedHeader?: (
      params: GridColumnHeaderParams<any, any, any>
    ) => ReactNode;
  }

  export interface ActionColumn<DataType extends GridValidRowModel> {
    render: (object: DataType) => ReactNode;
    GridColDef?: Partial<CustomPinnedGridColDef>;
    isPinned?: boolean;
  }
}
