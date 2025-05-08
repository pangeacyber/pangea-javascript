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
import find from "lodash/find";
import findLast from "lodash/findLast";
import isEmpty from "lodash/isEmpty";

import { Grid } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValidRowModel,
  DataGridProps,
  GridRowParams,
  MuiEvent,
  GridColumnHeaderParams,
  GridSortModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
  useTheme,
  lighten,
  darken,
  SxProps,
  useColorScheme,
} from "@mui/material/styles";

import { Box, ButtonProps, Stack, StackProps } from "@mui/material";

import { constructActionColumn } from "./action";
import { constructExpandColumn, ExpandableRow } from "./expansion";
import Pagination from "./components/Pagination";
import ResultsBar from "./components/Results";
import SearchBar from "./components/Search";

import { PreviewPanel } from "./components/PreviewPanel";
import { FilterFormProps } from "./components/Search/FiltersForm";
import {
  ColumnsPopoutHeader,
  Visibility,
} from "./components/Search/ColumnsPopout";
import ColumnHeaders from "./components/ColumnHeaders";
import { PDG } from "./types";
import { getModelFromVisibility, getVisibilityFromModel } from "./utils";
import { OptionComponentProps } from "../ConditionalAutocomplete/AutocompleteOptionComponent";
import { ConditionalOption } from "../ConditionalAutocomplete/types";

export interface PangeaDataGridProps<
  DataType extends GridValidRowModel,
  FiltersObj = Record<string, string>,
> {
  header?: ReactNode;
  columns: GridColDef[];
  data: DataType[];
  loading?: boolean;
  ColumnCustomization?: {
    visibilityModel: Record<string, boolean>;
    onVisibilityModelChange?: (
      visibilityModel: Record<string, boolean>
    ) => void;

    order?: string[];
    onOrderChange?: (order: string[]) => void;

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
    // Optional specific callback triggered when search or refresh is clicked
    // By default onChange is called if onSearch is not provided
    onSearch?: () => void;
    onChange: (query: string) => void;
    conditionalOptions?: ConditionalOption[];
    Filters?: FilterFormProps<FiltersObj>;
    ConditionalAutocompleteProps?: {
      OptionComponent?: FC<OptionComponentProps>;
    };
    EndFilterButton?: FC<FilterFormProps<FiltersObj>>;
    StartBarComponent?: ReactNode;
    EndBarComponent?: ReactNode;
    SearchButtonSx?: SxProps;
    SearchButtonProps?: Partial<ButtonProps>;
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
  previewId?: string | null;
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
  components?: {
    DataGridParentStack?: FC<StackProps>;
  };
}

const PangeaDataGrid = <
  DataType extends GridValidRowModel = { id: string },
  FiltersObj extends { [key: string]: string } = Record<string, string>,
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
  components = {},
}: PangeaDataGridProps<DataType, FiltersObj>): JSX.Element => {
  const theme = useTheme();
  const { mode } = useColorScheme();

  const { DataGridParentStack = Stack } = components;

  const [preview, setPreview_] = useState<GridRowParams<DataType> | null>(null);
  const setPreview = (preview: GridRowParams<DataType> | null) => {
    setPreview_(preview);
    if (onPreview) onPreview(preview);
  };

  const previewPanelRef = useRef<HTMLDivElement | undefined>();

  const isRowClickable = !!ExpansionRow?.render || !!onRowClick;
  const pageSize = ServerPagination?.pageSize || 20;

  const [visibility, setVisibility_] = useState<Visibility>({});
  const setVisibility = useCallback(
    (visibility: Visibility) => {
      setVisibility_(visibility);

      if (!!ColumnCustomization?.onVisibilityModelChange) {
        const visibilityModel = getModelFromVisibility(visibility);
        ColumnCustomization.onVisibilityModelChange(visibilityModel);
      }
    },
    [setVisibility_]
  );

  const [order, setOrder_] = useState<string[]>([]);
  const setOrder = useCallback(
    (order: string[]) => {
      setOrder_(order);

      if (!!ColumnCustomization?.onOrderChange) {
        ColumnCustomization.onOrderChange(order);
      }
    },
    [setOrder_]
  );

  const columnsPopoutProps = !!ColumnCustomization
    ? {
        order,
        setOrder,
        visibility,
        setVisibility,
      }
    : undefined;

  const columns = useMemo(() => {
    let columns = cloneDeep(columnsProp ?? []);
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
      if (!sort?.sort) {
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

    const vis = getVisibilityFromModel(
      ColumnCustomization.visibilityModel,
      columnsMap
    );

    const customizableFields =
      ColumnCustomization?.order ?? Object.keys(columnsMap);
    const order = customizableFields.filter((field) => !!vis[field]);

    setOrder_(order);
    setVisibility_(vis);
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

    if (previewId === null) {
      setPreview(null);
    }
  }, [data, previewId]);

  const rowSelectionModel = useMemo<GridRowSelectionModel>(() => {
    if (!preview?.row?.id) {
      return {
        type: "include",
        ids: new Set(),
      };
    }

    return {
      type: "include",
      ids: new Set([preview?.row?.id]),
    };
  }, [preview?.row?.id]);

  const modify = mode === "dark" ? darken : lighten;
  return (
    <Box sx={sx}>
      <Stack direction="row" sx={{ width: "100%", overflow: "hidden" }}>
        <Grid
          sx={{
            maxWidth: "100%",
            width: `calc(100% - ${!!preview ? PreviewPanel?.width : "0px"} - 2px)`,
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
                sx={{ width: "100%", p: 0.5, pt: 0, alignItems: "center" }}
              >
                {header}
              </Stack>
            )}
            {!!ServerPagination && <ResultsBar {...ServerPagination} />}
          </Stack>
          <DataGridParentStack
            className="PangeaDataGrid-WrappingStack-root"
            direction="row"
          >
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
              hideFooterPagination={!ServerPagination}
              rowSelectionModel={rowSelectionModel}
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
              paginationModel={
                !!ServerPagination
                  ? {
                      page: 1,
                      pageSize,
                    }
                  : undefined
              }
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
                color: (theme.vars || theme).palette.text.secondary,
                ".MuiDataGrid-columnHeaders.PangeaDataGrid-Pinned-Right, .MuiDataGrid-cell.PangeaDataGrid-Pinned-Right":
                  {
                    position: "sticky",
                    right: "0px",
                    float: "right",
                    backgroundColor: (theme.vars || theme).palette.background
                      .paper,
                  },
                ".MuiDataGrid-columnHeaders": {
                  color: (theme.vars || theme).palette.text.secondary,
                  backgroundColor: modify(
                    (theme.vars || theme).palette.secondary.main,
                    0.9
                  ),
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
                  alignItems: "center",
                  display: "flex",
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
                  backgroundColor: modify(
                    (theme.vars || theme).palette.secondary.main,
                    0.9
                  ),
                  ".PangeaDataGrid-Pinned-Right": {
                    backgroundColor: modify(
                      (theme.vars || theme).palette.secondary.main,
                      0.9
                    ),
                  },
                  ":hover": {
                    backgroundColor: modify(
                      (theme.vars || theme).palette.secondary.main,
                      0.9
                    ),
                    ".PangeaDataGrid-Pinned-Right": {
                      backgroundColor: modify(
                        (theme.vars || theme).palette.secondary.main,
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
                  color: (theme.vars || theme).palette.text.primary,
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
                          backgroundColor: modify(
                            (theme.vars || theme).palette.secondary.main,
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
          </DataGridParentStack>
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
