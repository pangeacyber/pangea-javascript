import {
  GridColDef,
  GridColumnHeaderParams,
  GridRenderCellParams,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { GridBaseColDef } from "@mui/x-data-grid/internals";
import { ReactNode } from "react";

export namespace PDG {
  export type FieldType =
    | "string"
    | "stringWithCopy"
    | "date"
    | "dateTime"
    | "stringDateTime";

  export interface CellProps {
    params: GridRenderCellParams;
    color?:
      | "textPrimary"
      | "textSecondary"
      | "success.main"
      | "info.main"
      | "primary"
      | "secondary"
      | "error"
      | "warning";
  }

  export interface GridObject {
    [key: string]: any;
  }

  // @ts-ignore Ignore field being required
  export interface GridField<T = GridObject> extends GridBaseColDef<T> {
    name?: string;
    label?: string;
    type?: FieldType;
  }

  export type GridSchemaFields<T = GridObject> = Partial<
    Record<keyof T, Partial<GridField<T>>>
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

  export interface SearchError {
    message: string;
    start?: number;
    length?: number;
  }
}
