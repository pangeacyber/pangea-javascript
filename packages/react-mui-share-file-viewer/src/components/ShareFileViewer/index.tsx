import { FC } from "react";
import { Stack } from "@mui/material";

import ShareDataGrid from "../ShareDataGrid";
import FileViewerProvider from "../../hooks/context";
import ShareDownloadDataGrid from "../ShareDownloadDataGrid";
import CreateNewButton from "../CreateNewButton";
import { ShareFileViewerProps } from "../../types";

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
