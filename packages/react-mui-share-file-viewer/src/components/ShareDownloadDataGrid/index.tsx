import {
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import isEmpty from "lodash/isEmpty";
import pickBy from "lodash/pickBy";
import find from "lodash/find";
import uniq from "lodash/uniq";
import keyBy from "lodash/keyBy";

import {
  LinedPangeaDataGrid,
  useGridSchemaColumns,
} from "@pangeacyber/react-mui-shared";
import {
  ObjectStore,
  ShareDataGridColumns,
  ShareDataGridProps,
} from "../../types";
import {
  StoreViewerFields,
  StoreViewerFieldsWithID,
} from "../ShareDataGrid/fields";
import { useFileViewerContext, useFileViewerFolder } from "../../hooks/context";
import FolderPath from "../ShareDataGrid/FolderPath";
import { Stack, Chip, LinearProgress } from "@mui/material";
import DownloadFileOptions from "./DownloadFileOptions";
import MultiSelectMenu from "../ShareDataGrid/MultiSelectMenu";
import DataGridParentStack from "../ShareDataGrid/DataGridParentStack";
import UploadPopover from "../UploadPopover";
import { downloadFile } from "../../utils/file";
import DownloadPopover from "../DownloadPasswordPopover";
import BucketSelector from "../ShareDataGrid/BucketSelector";

export const DEFAULT_VISIBILITY_MODEL = {
  name: true,
  size: true,
  updated_at: true,
};

export const DEFAULT_COLUMN_ORDER = ["name", "size", "updated_at"];

const ShareDownloadDataGrid: FC<ShareDataGridProps> = ({
  defaultVisibilityModel,
  defaultColumnOrder,
  customizations,
  includeIdColumn,
  virtualRoot,
}) => {
  const [firstLoad, setFirstLoad] = useState(true);
  const { data, request, reload, loading, previewId, apiRef } =
    useFileViewerContext();
  const { folder, setFolder, setParentId } = useFileViewerFolder();
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
  const columns_ = useGridSchemaColumns(
    includeIdColumn ? StoreViewerFieldsWithID : StoreViewerFields
  );

  const columns = useMemo(() => {
    return columns_.map((column_) => {
      const override =
        customizations?.columnOverrides?.[
          column_.field as ShareDataGridColumns
        ];
      if (!override) return column_;

      return {
        ...column_,
        ...override,
      };
    });
  }, [columns_, customizations]);

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [selected, setSelected] = useState<string[]>([]);
  const setMultiSelected = useCallback(
    (update: SetStateAction<string[]>) => {
      setSelected((state) => {
        let newState = state;
        if (typeof update === "function") {
          newState = update(state);
        } else {
          newState = update;
        }

        const objectMap = keyBy(data.objects ?? [], "id");
        return uniq(newState).filter((objectId) => !!objectMap[objectId]);
      });
    },
    [data, setSelected]
  );

  const multiSelected = useMemo(() => {
    const objectMap = keyBy(data.objects ?? [], "id");
    return selected.filter((objectId) => !!objectMap[objectId]);
  }, [selected, data]);

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
        if (event.shiftKey || multiSelected.includes(object.id)) {
          setMultiSelected((state) => state.concat([object.id]));
        } else {
          setMultiSelected([object.id]);
        }
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
    if (downloading || !id) return;

    const objectMap = keyBy(data.objects ?? [], "id");
    const object = objectMap[id];
    if (!object?.id) return;

    setDownloading(true);
    return downloadFile(object, apiRef)
      .then(() => {
        setDownloading(false);
      })
      .catch((err) => {
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

  useEffect(() => {
    // For showing a single shared folder as the root,
    // auto-select top-level folder if virtualRoot flag is set
    if (virtualRoot && data.count === 1) {
      const obj = data.objects[0];
      if (obj.type === "folder" && obj.folder === "/") {
        setFolder("/" + data.objects[0].name);
      } else {
        setFirstLoad(false);
      }
    } else if (!virtualRoot || data.last !== "") {
      setFirstLoad(false);
    }
  }, [data]);

  const rowCount = data?.count ?? data?.objects?.length ?? 0;

  return (
    <Stack spacing={0}>
      {loading && (
        <LinearProgress
          color="info"
          sx={{
            marginTop: "4px!important",
            height: "2px",
            marginBottom: "4px!important",
          }}
        />
      )}
      <LinedPangeaDataGrid
        columns={columns}
        data={firstLoad ? [] : data.objects}
        onRowDoubleClick={(params) => {
          if (params.row.type === ObjectStore.ObjectType.Folder) {
            setParentId(params.row.id);
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
        ActionColumn={{
          render: (object) => <DownloadFileOptions data={object} />,
          isPinned: true,
          GridColDef: {
            minWidth: 150,
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
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ paddingBottom: 1, marginLeft: -0.5 }}
            >
              <BucketSelector />
              <FolderPath defaultHidden virtualRoot />
            </Stack>
            {multiSelected.length >= 1 && (
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
        components={
          apiRef?.upload
            ? {
                DataGridParentStack,
              }
            : undefined
        }
      />
      {!!apiRef?.upload && <UploadPopover />}
      <DownloadPopover />
      <MultiSelectMenu
        selected={multiSelected}
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
      />
    </Stack>
  );
};

export default ShareDownloadDataGrid;
