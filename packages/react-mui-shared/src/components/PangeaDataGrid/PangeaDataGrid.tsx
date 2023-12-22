import {
  FC,
  ReactNode,
  useMemo,
  useEffect,
  useState,
  MouseEvent,
  useRef,
  useCallback,
} from "react";
import cloneDeep from "lodash/cloneDeep";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import get from "lodash/get";
import find from "lodash/find";
import findLast from "lodash/findLast";
import isEmpty from "lodash/isEmpty";

import Grid from "@mui/material/Grid";
import {
  DataGrid,
  GridColDef,
  GridValidRowModel,
  DataGridProps,
  GridRowParams,
  MuiEvent,
  GridColumnHeaderParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { useTheme, lighten, SxProps } from "@mui/material/styles";

import { Box, Stack, StackProps } from "@mui/material";

import { constructActionColumn } from "./action";
import { constructExpandColumn, ExpandableRow } from "./expansion";
import Pagination from "./components/Pagination";
import ResultsBar from "./components/Results";
import SearchBar from "./components/Search";

import { ConditionalOption } from "../ConditionalAutocomplete";
import { PreviewPanel } from "./components/PreviewPanel";
import { FilterFormProps } from "./components/Search/FiltersForm";
import {
  ColumnsPopoutHeader,
  Visibility,
} from "./components/Search/ColumnsPopout";
import ColumnHeaders from "./components/ColumnHeaders";
import { PDG } from "./types";

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
    order?: string[];
    position?: "inline";
    dynamicFlexColumn?: boolean;
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
  ServerSorting?: {
    sort?: "asc" | "desc";
    sortBy?: string;
    onSortChange: (
      sort: string | undefined,
      sortBy: string | undefined
    ) => void;
  };
  Search?: {
    query?: string;
    error?: PDG.SearchError;
    placeholder?: string;
    onChange: (query: string) => void;
    conditionalOptions?: ConditionalOption[];
    Filters?: FilterFormProps<FiltersObj>;
    EndFilterButton?: FC<FilterFormProps<FiltersObj>>;
    StartBarComponent?: ReactNode;
    EndBarComponent?: ReactNode;
  };
  // Optional easy to add action column. Always inserted after all columns
  //    Action column could also always
  ActionColumn?: PDG.ActionColumn<DataType>;
  ExpansionRow?: {
    render: (object: DataType, open: boolean) => ReactNode;
    GridColDef?: Partial<GridColDef>;
  };
  PreviewPanel?: {
    component: PreviewPanel<DataType>;
    width: string;
    position?: "inline" | "fullHeight";
  };
  previewId?: string;
  onRowClick?: (
    param: GridRowParams<DataType>,
    event: MuiEvent<MouseEvent>
  ) => boolean | void;
  onRowDoubleClick?: (
    param: GridRowParams<DataType>,
    event: MuiEvent<MouseEvent>
  ) => boolean | void;
  onPreview?: (preview: GridRowParams<DataType> | null) => void;
  DataGridProps?: Partial<DataGridProps>;
  DataGridWrappingStackProps?: Partial<StackProps>;
  sx?: SxProps;
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
  ServerSorting,
  ActionColumn,
  ExpansionRow,
  DataGridProps = {},
  PreviewPanel,
  previewId,
  onRowClick,
  onRowDoubleClick,
  onPreview,
  ColumnCustomization,
  sx,
}: PangeaDataGridProps<DataType, FiltersObj>): JSX.Element => {
  const theme = useTheme();

  const [preview, setPreview_] = useState<GridRowParams<DataType> | null>(null);
  const setPreview = (preview: GridRowParams<DataType> | null) => {
    setPreview_(preview);
    if (onPreview) onPreview(preview);
  };

  const previewPanelRef = useRef<HTMLDivElement | undefined>();

  const isRowClickable = !!ExpansionRow?.render || !!onRowClick;
  const pageSize =
    DataGridProps?.paginationModel?.pageSize ||
    ServerPagination?.pageSize ||
    20;

  const [visibility, setVisibility] = useState<Visibility>({});
  const [order, setOrder] = useState<string[]>([]);

  const columnsPopoutProps = !!ColumnCustomization
    ? {
        order,
        setOrder,
        visibility,
        setVisibility,
      }
    : undefined;

  const columns = useMemo(() => {
    let columns = cloneDeep(columnsProp);
    if (!!ExpansionRow?.render) {
      columns.unshift(
        constructExpandColumn(ExpansionRow?.render, ExpansionRow?.GridColDef)
      );
    }

    const ordered = columns.sort((a, b) => {
      return order.indexOf(a.field) - order.indexOf(b.field);
    });

    if (ColumnCustomization?.dynamicFlexColumn) {
      const lastFlexColumn = findLast(
        ordered,
        (col) => !!col.flex && visibility[col.field]?.isVisible
      );
      if (lastFlexColumn) {
        lastFlexColumn.flex = Math.max(10, lastFlexColumn.flex ?? 0);
      }
    }

    if (!!ActionColumn?.render) {
      const renderHeader =
        ActionColumn?.GridColDef?.renderPinnedHeader ??
        ActionColumn?.GridColDef?.renderHeader;

      let columnRenderHeader:
        | ((params: GridColumnHeaderParams<any, any, any>) => ReactNode)
        | undefined = undefined;
      if (ColumnCustomization?.position === "inline" && !!columnsPopoutProps) {
        columnRenderHeader = (params) => (
          <ColumnsPopoutHeader columnsPopoutProps={columnsPopoutProps}>
            {!!renderHeader && renderHeader(params)}
          </ColumnsPopoutHeader>
        );
      }

      ordered.push(
        constructActionColumn(ActionColumn?.render, {
          ...ActionColumn?.GridColDef,
          renderHeader: columnRenderHeader ?? renderHeader,
          ...(!!ActionColumn?.isPinned && {
            cellClassName: "PangeaDataGrid-Pinned-Right",
            renderPinnedHeader: columnRenderHeader ?? renderHeader,
            renderHeader: undefined,
          }),
        })
      );
    }

    return ordered;
  }, [
    columnsProp,
    order,
    visibility,
    !!ColumnCustomization,
    ColumnCustomization?.position,
    ColumnCustomization?.dynamicFlexColumn,
  ]);

  const sortModel = useMemo<GridSortModel | undefined>(() => {
    if (!ServerSorting?.sort || !ServerSorting?.sortBy) return undefined;

    return [
      {
        field: ServerSorting.sortBy,
        sort: ServerSorting.sort,
      },
    ];
  }, [ServerSorting?.sort, ServerSorting?.sortBy]);

  const handleSortModelChange = useCallback(
    (model: GridSortModel) => {
      if (!ServerSorting?.onSortChange) return;

      if (isEmpty(model) || !model.length) {
        ServerSorting.onSortChange(undefined, undefined);
        return;
      }

      const sort = model[0];
      if (!sort.sort) {
        ServerSorting.onSortChange(undefined, undefined);
        return;
      }

      ServerSorting.onSortChange(sort.sort, sort.field);
    },
    [ServerSorting?.onSortChange]
  );

  const columnsMap = useMemo(() => keyBy(columns, "field"), [columns]);

  useEffect(() => {
    if (!ColumnCustomization?.visibilityModel) return;

    const vis = mapValues(ColumnCustomization?.visibilityModel, (val, key) => ({
      isVisible: val,
      label: get(columnsMap, key, { headerName: key }).headerName ?? key,
    }));

    const customizableFields =
      ColumnCustomization?.order ?? Object.keys(columnsMap);
    const order = customizableFields.filter((field) => !!vis[field]);

    setOrder(order);
    setVisibility(vis);
  }, [ColumnCustomization?.visibilityModel, ColumnCustomization?.order]);

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

  return (
    <Box sx={sx}>
      <Stack direction="row" width="100%" sx={{ overflow: "hidden" }}>
        <Grid
          item
          sx={{
            maxWidth: "100%",
            width: `calc(100% - ${
              !!preview ? PreviewPanel?.width : "0px"
            } - 2px)`,
            transition: !!preview ? "width 0.5s" : undefined,
          }}
          data-testid={`model-data-grid`}
        >
          <Stack className="PangeaDataGrid-HeaderStack-root">
            {!!Search && (
              <SearchBar<FiltersObj>
                loading={loading}
                {...Search}
                ColumnsPopoutProps={
                  ColumnCustomization?.position !== "inline"
                    ? columnsPopoutProps
                    : undefined
                }
              />
            )}
            {!!header && (
              <Stack
                direction="row"
                width="100%"
                sx={{ p: 0.5, pt: 0, alignItems: "center" }}
              >
                {header}
              </Stack>
            )}
            {!!ServerPagination && <ResultsBar {...ServerPagination} />}
          </Stack>
          <Stack className="PangeaDataGrid-WrappingStack-root" direction="row">
            <DataGrid
              autoHeight
              columnHeaderHeight={44}
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
              rowSelectionModel={preview?.row?.id ?? []}
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
              onRowDoubleClick={(params, event) => {
                if (event.defaultPrevented) return;
                if (!!onRowDoubleClick) {
                  const res = onRowDoubleClick(params, event);
                  if (res === false) {
                    return;
                  }
                }
              }}
              paginationMode={!!ServerPagination ? "server" : undefined}
              paginationModel={{
                page: 1,
                ...DataGridProps.paginationModel,
                pageSize,
              }}
              rowCount={
                !!ServerPagination ? ServerPagination.rowCount : undefined
              }
              filterMode={!!ServerSorting ? "server" : undefined}
              sortingMode={!!ServerSorting ? "server" : undefined}
              sortModel={sortModel}
              onSortModelChange={
                !!ServerSorting ? handleSortModelChange : undefined
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
                ".PangeaDataGrid-Pinned-Right": {
                  position: "sticky",
                  right: "0px",
                  float: "right",
                  backgroundColor: theme.palette.background.paper,
                },
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
                  ...(!!ExpansionRow?.render && {
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }),
                  backgroundColor: lighten(theme.palette.secondary.main, 0.9),
                  ".PangeaDataGrid-Pinned-Right": {
                    backgroundColor: lighten(theme.palette.secondary.main, 0.9),
                  },
                  ":hover": {
                    backgroundColor: lighten(theme.palette.secondary.main, 0.9),
                    ".PangeaDataGrid-Pinned-Right": {
                      backgroundColor: lighten(
                        theme.palette.secondary.main,
                        0.9
                      ),
                    },
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
              slots={{
                row: ExpandableRow,
                ...(!!ServerPagination && {
                  pagination: () => <Pagination {...ServerPagination} />,
                }),
                columnHeaders: ColumnHeaders,
                ...(DataGridProps.slots ?? {}),
              }}
            />
            {!!PreviewPanel?.component &&
              !!preview &&
              PreviewPanel?.position !== "fullHeight" && (
                <Box className="PangeaDataGrid-PreviewPanel-root">
                  <PreviewPanel.component
                    onClose={() => {
                      setPreview(null);
                    }}
                    data={preview?.row}
                  />
                </Box>
              )}
          </Stack>
        </Grid>
        {!!PreviewPanel?.component &&
          !!preview &&
          PreviewPanel?.position === "fullHeight" && (
            <Box
              sx={{
                transition: "width 2s",
              }}
              className="PangeaDataGrid-PreviewPanel-root"
              ref={previewPanelRef}
            >
              <PreviewPanel.component
                onClose={() => {
                  setPreview(null);
                }}
                data={preview?.row}
              />
            </Box>
          )}
      </Stack>
    </Box>
  );
};

export default PangeaDataGrid;
