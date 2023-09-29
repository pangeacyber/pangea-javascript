import { FC } from "react";

import StoreDataGrid, { StoreDataGridProps } from "../StoreDataGrid";
import StoreFileViewerProvider, {
  StoreFileViewerProviderProps,
} from "../../hooks/context";

export interface StoreFileViewerProps
  extends StoreDataGridProps,
    StoreFileViewerProviderProps {}

const StoreFileViewer: FC<StoreFileViewerProps> = ({
  apiRef,
  defaultFilter,
  defaultSort,
  defaultSortBy,
  ...props
}) => {
  return (
    <StoreFileViewerProvider
      apiRef={apiRef}
      defaultFilter={defaultFilter}
      defaultSort={defaultSort}
      defaultSortBy={defaultSortBy}
    >
      <StoreDataGrid {...props} />
    </StoreFileViewerProvider>
  );
};

export default StoreFileViewer;
