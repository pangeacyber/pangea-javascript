import { Stack } from "@mui/material";
import find from "lodash/find";
import { GridColumnHeaders } from "@mui/x-data-grid";
import { UseGridColumnHeadersProps } from "@mui/x-data-grid/internals";
import { FC, forwardRef, useEffect, useMemo, useRef } from "react";
import { PDG } from "../../types";
import { ACTION_COLUMN } from "../../action";

interface Props extends UseGridColumnHeadersProps {
  ActionColumn?: PDG.ActionColumn<any>;
}

const ColumnHeaders = forwardRef<any, Props>((props, ref) => {
  const [renderHeader, actionColumn] = useMemo(() => {
    const actionColumn = find(
      props?.visibleColumns,
      (f) => f.field === ACTION_COLUMN
    );
    // @ts-ignore
    const renderHeader = actionColumn?.renderPinnedHeader;
    return [renderHeader, actionColumn];
  }, [props?.visibleColumns]);

  if (!actionColumn || !renderHeader) {
    return <GridColumnHeaders {...props} ref={ref} />;
  }

  return (
    <Stack className="PangeaDataGrid-columnHeaders" direction="row">
      <GridColumnHeaders {...props} ref={ref} />
      <Stack
        className="MuiDataGrid-columnHeaders MuiDataGrid-withBorderColor MuiDataGrid-columnHeader MuiDataGrid-withBorderColor PangeaDataGrid-Pinned-Right"
        sx={{
          marginLeft: `-${actionColumn?.computedWidth ?? actionColumn?.width}px`,
          width: actionColumn?.computedWidth ?? actionColumn?.width,
          minWidth: actionColumn?.minWidth,
          maxWidth: actionColumn?.maxWidth,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="end"
          width="100%"
          height="100%"
        >
          <div
            className="MuiDataGrid-columnHeaderTitleContainer"
            style={{
              marginLeft: "auto",
              flex: "initial",
            }}
          >
            <div className="MuiDataGrid-columnHeaderTitleContainerContent">
              {!!renderHeader &&
                renderHeader({
                  field: ACTION_COLUMN,
                  colDef: actionColumn,
                })}
            </div>
          </div>
        </Stack>
      </Stack>
    </Stack>
  );
});

export default ColumnHeaders;
