import { FC, ReactNode, useMemo, useEffect, useState, MouseEvent } from "react";
import clone from "lodash/clone";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import get from "lodash/get";
import find from "lodash/find";

import Grid from "@mui/material/Grid";
import {
  DataGrid,
  GridColDef,
  GridValidRowModel,
  DataGridProps,
  GridRowParams,
  MuiEvent,
} from "@mui/x-data-grid";
import { useTheme, lighten } from "@mui/material/styles";

import { Stack } from "@mui/material";

import { constructActionColumn } from "./action";
import { constructExpandColumn, ExpandableRow } from "./expansion";
import Pagination from "./components/Pagination";
import ResultsBar from "./components/Results";
import SearchBar from "./components/Search";

import { ConditionalOption } from "../ConditionalAutocomplete";
import { PreviewPanel } from "./components/PreviewPanel";
import {
  FilterFormProps,
  FilterOptions,
} from "./components/Search/FiltersForm";
import { Visibility } from "./components/Search/ColumnsPopout";

export interface PangeaDataGridProps<
  DataType extends GridValidRowModel,
  FiltersObj = Record<string, string>
> {
  header?: ReactNode;
  columns: GridColDef[];
  data: DataType[];
  loading?: boolean;
  ColumnCustomization?: {
    visibilityModel: Record<string, boolean>;
  };
  ServerPagination?: {
    page: number;
    pageSize: number;
    paginationRowCount?: number;
    rowCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    rowsPerPageOptions?: number[];
    maxResults?: number;
    onMaxResultChange?: (maxResults: number) => void;
    maxResultOptions?: number[];
  };
  Search?: {
    query?: string;
    placeholder?: string;
    onChange: (query: string) => void;
    conditionalOptions?: ConditionalOption[];
    Filters?: FilterFormProps<FiltersObj>;
  };
  // Optional easy to add action column. Always inserted after all columns
  //    Action column could also always
  ActionColumn?: {
    render: (object: DataType) => ReactNode;
    GridColDef?: Partial<GridColDef>;
  };
  ExpansionRow?: {
    render: (object: DataType, open: boolean) => ReactNode;
    GridColDef?: Partial<GridColDef>;
  };
  PreviewPanel?: PreviewPanel<DataType>;
  previewId?: string;
  onRowClick?: (
    param: GridRowParams<DataType>,
    event: MuiEvent<MouseEvent>
  ) => boolean | void;
  DataGridProps?: Partial<DataGridProps>;
}

const PangeaDataGrid = <
  DataType extends GridValidRowModel = { id: string },
  FiltersObj extends { [key: string]: string } = Record<string, string>
>({
  header = null,
  columns: columnsProp,
  data,
  loading,
  Search,
  ServerPagination,
  ActionColumn,
  ExpansionRow,
  DataGridProps = {},
  PreviewPanel,
  previewId,
  onRowClick,
  ColumnCustomization,
}: PangeaDataGridProps<DataType, FiltersObj>): JSX.Element => {
  const theme = useTheme();

  const [preview, setPreview] = useState<GridRowParams<DataType> | null>(null);

  const isRowClickable = !!ExpansionRow?.render || !!onRowClick;
  const pageSize = DataGridProps?.pageSize || ServerPagination?.pageSize || 20;

  const [visibility, setVisibility] = useState<Visibility>({});
  const [order, setOrder] = useState<string[]>([]);

  const columns = useMemo(() => {
    let columns = clone(columnsProp);
    if (!!ExpansionRow?.render) {
      columns.unshift(
        constructExpandColumn(ExpansionRow?.render, ExpansionRow?.GridColDef)
      );
    }

    if (!!ActionColumn?.render) {
      columns.push(
        constructActionColumn(ActionColumn?.render, ActionColumn?.GridColDef)
      );
    }

    return columns.sort((a, b) => {
      return order.indexOf(a.field) - order.indexOf(b.field);
    });
  }, [columnsProp, order]);

  const columnsMap = useMemo(() => keyBy(columns, "field"), [columns]);

  useEffect(() => {
    if (!ColumnCustomization?.visibilityModel) return;

    const vis = mapValues(ColumnCustomization?.visibilityModel, (val, key) => ({
      isVisible: val,
      label: get(columnsMap, key, { headerName: key }).headerName ?? key,
    }));

    const order = Object.keys(columnsMap).filter((field) => !!vis[field]);

    setOrder(order);
    setVisibility(vis);
  }, [ColumnCustomization?.visibilityModel]);

  useEffect(() => {
    if (preview?.row) {
      const row = find(data, (d) => d.id === preview?.row?.id);
      if (!row) {
        setPreview(null);
      }
    }
  }, [data, preview]);

  useEffect(() => {
    if (previewId) {
      const row = find(data, (d) => d.id === previewId);
      if (row) {
        // @ts-ignore
        setPreview({ row });
      }
    }
  }, [data, previewId]);

  const columnsPopoutProps = !!ColumnCustomization
    ? {
        order,
        setOrder,
        visibility,
        setVisibility,
      }
    : undefined;

  return (
    <div>
      <>
        <Grid item sx={{ width: "100%" }} data-testid={`model-data-grid`}>
          {!!Search && (
            <SearchBar<FiltersObj>
              loading={loading}
              {...Search}
              ColumnsPopoutProps={columnsPopoutProps}
            />
          )}
          {!!ServerPagination && <ResultsBar {...ServerPagination} />}
          {!!header && (
            <Stack
              direction="row"
              width="100%"
              sx={{ p: 0.5, pt: 0, alignItems: "center" }}
            >
              {header}
            </Stack>
          )}
          <Stack direction="row">
            <DataGrid
              autoHeight
              headerHeight={44}
              disableVirtualization
              disableColumnMenu
              rowHeight={44}
              rows={data}
              columns={columns}
              columnVisibilityModel={mapValues(
                visibility,
                (val) => val.isVisible
              )}
              hideFooterSelectedRowCount
              hideFooterPagination={
                !ServerPagination && data?.length < pageSize
              }
              selectionModel={preview?.row?.id ?? []}
              onRowClick={(params, event) => {
                if (!isRowClickable || event.defaultPrevented) return;
                if (!!onRowClick) {
                  const res = onRowClick(params, event);
                  if (res === false) {
                    return;
                  }
                }

                if (PreviewPanel !== undefined) {
                  setPreview(params);
                }

                if (!ExpansionRow?.render) return;
                const open = params.row?._state?.rowOpen ?? false;
                params.row?._state?.setRowOpen(!open);
              }}
              paginationMode={!!ServerPagination ? "server" : undefined}
              pageSize={pageSize}
              rowCount={
                !!ServerPagination ? ServerPagination.rowCount : undefined
              }
              {...(DataGridProps ?? {})}
              sx={{
                borderTopRightRadius: "4px",
                borderTopLeftRadius: "4px",
                fontFamily: "Kanit",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "22px",
                letterSpacing: "0.1px",
                border: "none",
                color: theme.palette.text.secondary,
                ".MuiDataGrid-columnHeaders": {
                  color: theme.palette.text.secondary,
                  backgroundColor: lighten(theme.palette.secondary.main, 0.9),
                  textTransform: "uppercase",
                  fontFamily: "Kanit",
                  fontSize: "12px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "32px",
                  letterSpacing: "1.5px",
                  textAlign: "left",
                  borderRadius: "4px",
                },
                ".MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-cell:focus-within":
                  {
                    outline: "none",
                  },
                ".MuiDataGrid-cell": {
                  border: "none",
                },
                ".MuiDataGrid-row": {
                  borderRadius: "4px",
                },
                ".MuiDataGrid-row.Mui-selected": {
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  backgroundColor: lighten(theme.palette.secondary.main, 0.9),
                  ":hover": {
                    backgroundColor: lighten(theme.palette.secondary.main, 0.9),
                  },
                },
                ".MuiDataGrid-overlay": {
                  top: "56px!important",
                  bottom: "auto",
                },
                ".MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  minHeight: "8px",
                },
                ".columnPrimary": {
                  color: theme.palette.text.primary,
                },
                ".MuiDataGrid-virtualScrollerRenderZone, .MuiDataGrid-virtualScrollerContent":
                  {
                    position: "relative",
                    height: "fit-content!important",
                  },
                ".MuiDataGrid-row,.MuiDataGrid-row.Mui-selected": {
                  ":hover": {
                    cursor: "default",
                  },
                },
                ...(isRowClickable
                  ? {
                      ".MuiDataGrid-row,.MuiDataGrid-row.Mui-selected": {
                        ":hover": {
                          cursor: "pointer",
                          backgroundColor: lighten(
                            theme.palette.secondary.main,
                            0.85
                          ),
                        },
                      },
                    }
                  : {}),
                ...(DataGridProps.sx ?? {}),
              }}
              components={{
                Row: ExpandableRow,
                Pagination: !!ServerPagination
                  ? () => <Pagination {...ServerPagination} />
                  : undefined,
                ...(DataGridProps.components ?? {}),
              }}
            />
            {!!PreviewPanel && !!preview && (
              <PreviewPanel
                onClose={() => {
                  setPreview(null);
                }}
                data={preview?.row}
              />
            )}
          </Stack>
        </Grid>
      </>
    </div>
  );
};

export type { FilterOptions, FilterFormProps };

export default PangeaDataGrid;
