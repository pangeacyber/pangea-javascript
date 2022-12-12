import { FC, ReactNode, useMemo, useState, MouseEvent } from "react";
import clone from "lodash/clone";

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

import { Typography, Stack } from "@mui/material";

import { constructActionColumn } from "./action";
import { constructExpandColumn, ExpandableRow } from "./expansion";
import Pagination from "./components/Pagination";
import ResultsBar from "./components/Results";
import SearchBar from "./components/Search";

import { ConditionalOption } from "../ConditionalAutocomplete";
import { PreviewPanel } from "./components/PreviewPanel";
import { FilterFormProps } from "./components/Search/FiltersForm";

export interface PangeaDataGridProps<
  DataType extends GridValidRowModel,
  FiltersObj = Record<string, string>
> {
  header?: ReactNode;
  columns: GridColDef[];
  data: DataType[];
  loading?: boolean;
  ServerPagination?: {
    page: number;
    pageSize: number;
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
  onRowClick?: (
    param: GridRowParams<DataType>,
    event: MuiEvent<MouseEvent>
  ) => void;
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
  onRowClick,
}: PangeaDataGridProps<DataType, FiltersObj>): JSX.Element => {
  const theme = useTheme();

  const [preview, setPreview] = useState<GridRowParams<DataType> | null>(null);

  const isRowClickable = !!ExpansionRow?.render || !!onRowClick;
  const pageSize = DataGridProps?.pageSize || ServerPagination?.pageSize || 20;

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

    return columns;
  }, [columnsProp]);

  return (
    <div>
      <>
        <Grid item sx={{ width: "100%" }} data-testid={`model-data-grid`}>
          {!!Search && <SearchBar<FiltersObj> loading={loading} {...Search} />}
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
              hideFooterSelectedRowCount
              hideFooterPagination={
                !ServerPagination && data?.length < pageSize
              }
              selectionModel={preview?.row?.id}
              onRowClick={(params, event) => {
                if (!isRowClickable || event.defaultPrevented) return;
                if (!!onRowClick) {
                  onRowClick(params, event);
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

export default PangeaDataGrid;
