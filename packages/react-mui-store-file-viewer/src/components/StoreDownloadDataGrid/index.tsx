import { FC, useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import pickBy from "lodash/pickBy";

import {
  LinedPangeaDataGrid,
  PangeaDataGridProps,
  useGridSchemaColumns,
} from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../types";
import { StoreViewerFields } from "../StoreDataGrid/fields";
import {
  useStoreFileViewerContext,
  useStoreFileViewerFolder,
} from "../../hooks/context";
import FolderPath from "../StoreDataGrid/FolderPath";
import { Stack } from "@mui/material";
import DownloadFileOptions from "./DownloadFileOptions";
import { StoreDataGridProps } from "../StoreDataGrid";

export const DEFAULT_VISIBILITY_MODEL = {
  name: true,
  size: true,
  updated_at: true,
};

export const DEFAULT_COLUMN_ORDER = ["name", "size", "updated_at"];

const StoreDownloadDataGrid: FC<StoreDataGridProps> = ({
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
        onRowDoubleClick={(params) => {
          if (params.row.type === ObjectStore.ObjectType.Folder) {
            setParentId(params.row.id);
            return false;
          }
        }}
        onRowClick={(params) => {}}
        ActionColumn={{
          render: (object) => <DownloadFileOptions data={object} />,
          isPinned: true,
          GridColDef: {
            minWidth: 100,
          },
        }}
        loading={loading}
        header={<FolderPath useRootIcon defaultHidden />}
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
    </Stack>
  );
};

export default StoreDownloadDataGrid;
