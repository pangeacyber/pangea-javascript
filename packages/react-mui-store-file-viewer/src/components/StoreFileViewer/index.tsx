import { FC } from "react";
import { Stack } from "@mui/material";

import StoreDataGrid, { StoreDataGridProps } from "../StoreDataGrid";
import StoreFileViewerProvider, {
  StoreFileViewerProviderProps,
} from "../../hooks/context";
import StoreDownloadDataGrid from "../StoreDownloadDataGrid";
import CreateNewButton from "../CreateNewButton";

export interface StoreFileViewerProps
  extends StoreDataGridProps,
    StoreFileViewerProviderProps {
  virtualRoot?: boolean;
}

const StoreFileViewer: FC<StoreFileViewerProps> = ({
  apiRef,
  configurations,
  defaultFilter,
  defaultSort,
  defaultSortBy,
  defaultShareLinkTitle,
  virtualRoot = true,
  ...props
}) => {
  return (
    <StoreFileViewerProvider
      apiRef={apiRef}
      configurations={configurations}
      defaultFilter={defaultFilter}
      defaultSort={defaultSort}
      defaultSortBy={defaultSortBy}
      defaultShareLinkTitle={defaultShareLinkTitle}
    >
      <StoreDataGrid {...props} />
    </StoreFileViewerProvider>
  );
};

export const StoreDownloadFileViewer: FC<StoreFileViewerProps> = ({
  apiRef,
  configurations,
  defaultFilter,
  defaultSort,
  defaultSortBy,
  defaultShareLinkTitle,
  ...props
}) => {
  return (
    <StoreFileViewerProvider
      apiRef={apiRef}
      configurations={configurations}
      defaultFilter={defaultFilter}
      defaultSort={defaultSort}
      defaultSortBy={defaultSortBy}
      defaultShareLinkTitle={defaultShareLinkTitle}
    >
      <Stack gap={1}>
        {!!apiRef?.folderCreate && (
          <Stack direction="row" justifyItems="flex-end">
            <CreateNewButton
              hideCreateProtected={true}
              hideFolderOptions={true}
            />
          </Stack>
        )}
        <StoreDownloadDataGrid {...props} virtualRoot />
      </Stack>
    </StoreFileViewerProvider>
  );
};

export default StoreFileViewer;
