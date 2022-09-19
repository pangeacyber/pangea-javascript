import { FC, ReactNode, useMemo, MouseEvent } from "react";
import clone from "lodash/clone";

import Grid from "@mui/material/Grid";
import {
  DataGrid,
  GridColDef,
  DataGridProps,
  GridRowParams,
  MuiEvent,
} from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";

import { Typography, Stack } from "@mui/material";

import { constructActionColumn } from "./action";
import { constructExpandColumn, ExpandableRow } from "./expansion";
import Pagination from "./components/Pagination";
import ResultsBar from "./components/Results";
import SearchBar from "./components/Search";

import { ConditionalOption } from "../ConditionalAutocomplete";

interface PangeaDataGridProps<Model> {
  name?: string;
  header?: ReactNode;
  columns: GridColDef[];
  data: Model[];
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
  };
  // Optional easy to add action column. Always inserted after all columns
  //    Action column could also always
  ActionColumn?: {
    render: (object: Model) => ReactNode;
    GridColDef?: Partial<GridColDef>;
  };
  ExpansionRow?: {
    render: (object: Model, open: boolean) => ReactNode;
    GridColDef?: Partial<GridColDef>;
  };
  onRowClick?: (param: GridRowParams, event: MuiEvent<MouseEvent>) => void;
  DataGridProps?: Partial<DataGridProps>;
  palette?: {};
}

type PangeaDataGridPropsTyped<Model = any> = FC<PangeaDataGridProps<Model>>;
const PangeaDataGrid: PangeaDataGridPropsTyped = ({
  name,
  header = null,
  columns: columnsProp,
  data,
  loading,
  Search,
  ServerPagination,
  ActionColumn,
  ExpansionRow,
  DataGridProps = {},
  onRowClick,
}) => {
  const theme = useTheme();
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

  const borderTopRadius = !!name ? "0px" : "4px";
  return (
    <div>
      <>
        <Grid item sx={{ width: "100%" }} data-testid={`model-data-grid`}>
          {!!name && (
            <Stack
              direction="row"
              width="100%"
              sx={{ marginBottom: 2, alignItems: "center" }}
            >
              <Typography variant="h6">{name}</Typography>
              {header}
            </Stack>
          )}
          {!!Search && <SearchBar loading={loading} {...Search} />}
          {!!ServerPagination && <ResultsBar {...ServerPagination} />}
          <DataGrid
            autoHeight
            headerHeight={44}
            disableVirtualization
            disableColumnMenu
            rowHeight={44}
            rows={data}
            columns={columns}
            hideFooterSelectedRowCount
            hideFooterPagination={!ServerPagination && data?.length < pageSize}
            onRowClick={(params, event) => {
              if (!isRowClickable || event.defaultPrevented) return;
              if (!!onRowClick) {
                onRowClick(params, event);
              }

              if (!ExpansionRow?.render) return;
              const open = params.row?._state?.rowOpen ?? false;
              params.row?._state?.setRowOpen(!open);
            }}
            paginationMode={!!ServerPagination ? "server" : undefined}
            {...(DataGridProps ?? {})}
            pageSize={pageSize}
            rowCount={
              !!ServerPagination ? ServerPagination.rowCount : undefined
            }
            sx={{
              borderTopRightRadius: borderTopRadius,
              borderTopLeftRadius: borderTopRadius,
              fontFamily: "Kanit",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: "400",
              lineHeight: "22px",
              letterSpacing: "0.1px",
              border: "none",
              color: theme.palette.text.secondary,
              ".MuiDataGrid-columnHeaders": {
                backgroundColor: "#000", // FIXME: Shared color
                color: theme.palette.text.secondary,
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
                backgroundColor: "#000", // FIXME: Shared color
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
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
                  backgroundColor: "#000", // FIXME: Shared color
                },
              },
              ...(isRowClickable
                ? {
                    ".MuiDataGrid-row,.MuiDataGrid-row.Mui-selected": {
                      ":hover": {
                        cursor: "pointer",
                        backgroundColor: "#d4dce5",
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
        </Grid>
      </>
    </div>
  );
};

export default PangeaDataGrid;
