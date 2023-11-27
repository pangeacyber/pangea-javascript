import { FC, useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import pickBy from "lodash/pickBy";

import {
  LinedPangeaDataGrid,
  PangeaDataGridProps,
  useGridSchemaColumns,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../types";
import { StoreViewerFields, StoreViewerFilters } from "./fields";
import {
  useStoreFileViewerContext,
  useStoreFileViewerFolder,
} from "../../hooks/context";
import FolderPath from "./FolderPath";
import PreviewStoreFile from "../PreviewStoreFile";
import CreateNewButton from "../CreateNewButton";
import { Stack } from "@mui/material";
import FileDropBox from "../FileDropBox";
import FileOptions from "../FileOptions";
import { PREVIEW_FILE_WIDTH } from "../PreviewStoreFile/constants";

export interface StoreDataGridProps {
  defaultVisibilityModel?: Record<string, boolean>;
  defaultColumnOrder?: string[];

  PangeaDataGridProps?: Partial<
    PangeaDataGridProps<ObjectStore.ObjectResponse>
  >;
}

export const DEFAULT_VISIBILITY_MODEL = {
  name: true,
  size: true,
  updated_at: true,
};

export const DEFAULT_COLUMN_ORDER = ["name", "size", "updated_at"];

const StoreDataGrid: FC<StoreDataGridProps> = ({
  defaultVisibilityModel,
  defaultColumnOrder,
}) => {
  const { data, request, reload, loading, previewId } =
    useStoreFileViewerContext();
  const { folder, setFolder, setParentId } = useStoreFileViewerFolder();
  const {
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    lastKnownPage,
    sorting,
    setSorting,
  } = request;
  const columns = useGridSchemaColumns(StoreViewerFields);

  const isFiltered = !isEmpty(
    pickBy(filters ?? {}, (v, k) => !!v && k !== "parent_id")
  );
  const visibilityModel = useMemo(() => {
    return (
      defaultVisibilityModel ?? {
        ...DEFAULT_VISIBILITY_MODEL,
        parent_id: isFiltered ? true : false,
      }
    );
  }, [defaultVisibilityModel, columns, isFiltered]);

  const rowCount = data?.count ?? data?.objects?.length ?? 0;
  return (
    <Stack spacing={1}>
      <LinedPangeaDataGrid
        columns={columns}
        data={data.objects}
        PreviewPanel={{
          component: PreviewStoreFile,
          width: `${PREVIEW_FILE_WIDTH}px`,
          position: "fullHeight",
        }}
        previewId={filters?.id || previewId}
        onRowDoubleClick={(params) => {
          if (params.row.type === ObjectStore.ObjectType.Folder) {
            setParentId(params.row.id);
            /** 
                    setFolder(
                        ["", folder, params.row.name].join("/").replaceAll("//", "/")
                    );
                    */
            return false;
          }
        }}
        onRowClick={(params) => {}}
        ColumnCustomization={{
          visibilityModel,
          order: defaultColumnOrder ?? DEFAULT_COLUMN_ORDER,
          position: "inline",
          dynamicFlexColumn: true,
        }}
        ActionColumn={{
          render: (object) => (
            <FileOptions
              object={object}
              onClose={() => {}}
              displayDownloadInline
            />
          ),
          isPinned: true,
          GridColDef: {
            minWidth: 100,
          },
        }}
        loading={loading}
        header={<FolderPath />}
        Search={{
          query: filters?.name ?? "",
          placeholder: "Search name...",
          onChange: (query) => {
            // @ts-ignore
            if (query !== filters?.name) {
              setFilters((state) => ({ ...state, name__contains: query }));
            } else {
              reload();
            }
          },
          Filters: {
            filters,
            onFilterChange: setFilters,
            // @ts-ignore
            options: StoreViewerFilters,
            showFilterChips: true,
          },
          EndBarComponent: <CreateNewButton />,
        }}
        ServerPagination={{
          page: page,
          onPageChange: (page) => setPage(page),
          pageSize,
          onPageSizeChange: setPageSize,
          rowsPerPageOptions: [5, 10, 20, 50],
          paginationRowCount: Math.min(lastKnownPage * pageSize, rowCount),
          rowCount: rowCount,
        }}
        ServerSorting={{
          // @ts-ignore "asc" | "desc" | undefined
          sort: sorting.order,
          sortBy: sorting.order_by,
          onSortChange: (sort, sortBy) => {
            setSorting({
              order: sort,
              order_by: sortBy,
            });
          },
        }}
      />
      <FileDropBox />
    </Stack>
  );
};

export default StoreDataGrid;
