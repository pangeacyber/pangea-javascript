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
    StoreFileViewerProviderProps {}

const StoreFileViewer: FC<StoreFileViewerProps> = ({
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
      <>
        {configurations?.controls?.editorMode && (
          <Stack direction="row" justifyItems="flex-end">
            <CreateNewButton
              hideCreateProtected={true}
              hideFolderOptions={true}
            />
          </Stack>
        )}
        <StoreDownloadDataGrid {...props} />
      </>
    </StoreFileViewerProvider>
  );
};

export default StoreFileViewer;
