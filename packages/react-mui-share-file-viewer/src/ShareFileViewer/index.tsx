import { FC } from "react";
import { Stack } from "@mui/material";

import ShareDataGrid from "../components/ShareDataGrid";
import FileViewerProvider from "../hooks/context";
import ShareDownloadDataGrid from "../components/ShareDownloadDataGrid";
import CreateNewButton from "../components/CreateNewButton";
import { ShareDataGridProps, FileViewerProviderProps } from "../types";

/**
 * Props for the `ShareFileViewer` component.
 */
export interface ShareFileViewerProps
  extends ShareDataGridProps,
    FileViewerProviderProps {
  /**
   * When set to `true`, assumes the first folder found in the initial list response is meant to opened. Used for folder sharing and starting exploration from within the folder.
   */
  virtualRoot?: boolean;
}

/**
 * @hidden
 */
const ShareFileViewer: FC<ShareFileViewerProps> = ({
  apiRef,
  configurations,
  defaultFilter,
  defaultSort,
  defaultSortBy,
  defaultShareLinkTitle,
  virtualRoot = false,
  ...props
}) => {
  return (
    <FileViewerProvider
      apiRef={apiRef}
      configurations={configurations}
      defaultFilter={defaultFilter}
      defaultSort={defaultSort}
      defaultSortBy={defaultSortBy}
      defaultShareLinkTitle={defaultShareLinkTitle}
    >
      <ShareDataGrid {...props} />
    </FileViewerProvider>
  );
};

/**
 * @hidden
 */
export const ShareDownloadFileViewer: FC<ShareFileViewerProps> = ({
  apiRef,
  configurations,
  defaultFilter,
  defaultSort,
  defaultSortBy,
  defaultShareLinkTitle,
  ...props
}) => {
  return (
    <FileViewerProvider
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
        <ShareDownloadDataGrid {...props} virtualRoot />
      </Stack>
    </FileViewerProvider>
  );
};

export default ShareFileViewer;
