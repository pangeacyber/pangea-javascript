import { FC, useMemo, useState } from "react";
import isEmpty from "lodash/isEmpty";
import pickBy from "lodash/pickBy";
import find from "lodash/find";
import uniq from "lodash/uniq";

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
import { Stack, Chip } from "@mui/material";
import FileDropBox from "../FileDropBox";
import FileOptions from "../FileOptions";
import { PREVIEW_FILE_WIDTH } from "../PreviewStoreFile/constants";
import MultiSelectMenu from "./MultiSelectMenu";
import UploadPopover from "../UploadPopover";
import DataGridParentStack from "./DataGridParentStack";

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
  const { data, request, reload, loading, previewId, apiRef } =
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

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const [multiSelected, setMultiSelected] = useState<string[]>([]);

  const handleGetRowClassName = (params: {
    id: string | number;
    row: ObjectStore.ObjectResponse;
  }) => {
    const selected = find(multiSelected, (id) => id === params.row.id);
    if (selected) {
      return "Mui-selected";
    }

    return "";
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    if (!multiSelected) return;

    let foundParent = false;

    const rowEl = event.currentTarget.closest(".MuiDataGrid-row");
    if (rowEl) {
      const row = Number(rowEl.getAttribute("data-rowindex"));
      if (!Number.isNaN(row) && row >= 0 && row < data.objects.length) {
        const object = data.objects[row];
        setMultiSelected((state) => uniq(state.concat([object.id])));
        foundParent = true;
      }
    }

    if (!foundParent && !multiSelected.length) return;
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const [downloading, setDownloading] = useState(false);
  const handleDownloadFile = (id: string) => {
    if (downloading || !id || !apiRef?.get) return;

    setDownloading(true);
    apiRef
      .get({
        id,
        transfer_method: "dest-url",
      })
      .then((response) => {
        if (response.status === "Success") {
          const location = response.result.dest_url;
          if (location) {
            window.open(location, "_blank");
          }
        }
      })
      .finally(() => {
        setDownloading(false);
      });
  };

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
          } else {
            handleDownloadFile(params.row.id);
          }
        }}
        onRowClick={(params, event) => {
          if (event.shiftKey) {
            event.preventDefault();
            document.getSelection()?.removeAllRanges();
            setMultiSelected((state) => state.concat([params.row.id]));
          } else {
            setMultiSelected([params.row.id]);
          }
        }}
        onPreview={(preview) => {
          if (!preview) setMultiSelected([]);
        }}
        DataGridProps={{
          ...(!!apiRef.getArchive && {
            getRowClassName: handleGetRowClassName,
            slotProps: {
              row: {
                onContextMenu: handleContextMenu,
                style: { cursor: "context-menu" },
              },
            },
          }),
        }}
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
        header={
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <FolderPath />
            {multiSelected.length > 1 && (
              <Chip
                size="small"
                label={`${multiSelected.length} Selected`}
                onDelete={() => {
                  setMultiSelected([]);
                }}
              />
            )}
          </Stack>
        }
        Search={{
          query: filters?.name ?? "",
          placeholder: "Search by name...",
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
        components={{
          DataGridParentStack,
        }}
      />
      <UploadPopover />
      <MultiSelectMenu
        selected={multiSelected}
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
      />
    </Stack>
  );
};

export default StoreDataGrid;
