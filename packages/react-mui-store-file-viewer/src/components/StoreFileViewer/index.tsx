import { FC } from "react";

import StoreDataGrid, { StoreDataGridProps } from "../StoreDataGrid";
import StoreFileViewerProvider, {
  StoreFileViewerProviderProps,
} from "../../hooks/context";
import StoreDownloadDataGrid from "../StoreDownloadDataGrid";

export interface StoreFileViewerProps
  extends StoreDataGridProps,
    StoreFileViewerProviderProps {}

const StoreFileViewer: FC<StoreFileViewerProps> = ({
  apiRef,
  configurations,
  defaultFilter,
  defaultSort,
  defaultSortBy,
  ...props
}) => {
  return (
    <StoreFileViewerProvider
      apiRef={apiRef}
      configurations={configurations}
      defaultFilter={defaultFilter}
      defaultSort={defaultSort}
      defaultSortBy={defaultSortBy}
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
  ...props
}) => {
  return (
    <StoreFileViewerProvider
      apiRef={apiRef}
      configurations={configurations}
      defaultFilter={defaultFilter}
      defaultSort={defaultSort}
      defaultSortBy={defaultSortBy}
    >
      <StoreDownloadDataGrid {...props} />
    </StoreFileViewerProvider>
  );
};

export default StoreFileViewer;
