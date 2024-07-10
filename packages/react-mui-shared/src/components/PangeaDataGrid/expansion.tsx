import { FC, useState, useEffect, ReactNode } from "react";
import { Collapse, Box } from "@mui/material";
import {
  GridRow,
  GridRowProps,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { Stack, IconButton } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const EXPAND_COLUMN = "__expand__";

const ExpandCell: FC<{ params: GridRenderCellParams<any, any> }> = ({
  params,
}) => {
  const open = params.row?._state?.rowOpen ?? false;
  const setOpen = (open: boolean) => {
    params.row?._state?.setRowOpen(open);
  };

  return (
    <Stack direction="row" sx={{ marginLeft: "auto" }}>
      <IconButton onClick={() => !!setOpen && setOpen(!open)}>
        {open ? (
          <KeyboardArrowDownIcon fontSize="small" color="action" />
        ) : (
          <KeyboardArrowRightIcon fontSize="small" color="action" />
        )}
      </IconButton>
    </Stack>
  );
};

export const constructExpandColumn = <T extends any = any>(
  renderExpandedRow: (object: T, open: boolean) => ReactNode,
  overrides: Partial<GridColDef> = {}
): GridColDef => {
  return {
    field: EXPAND_COLUMN,
    sortable: false,
    resizable: false,
    width: 50,
    editable: false,
    filterable: false,
    headerName: "",
    renderCell: (params) => {
      return <ExpandCell params={params} />;
    },
    ...overrides,
    // @ts-ignore
    renderExpandedRow,
  };
};

export const ExpandableRow: FC<GridRowProps> = (props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [props.row?.hash]);

  const gridRowProps: Partial<GridRowProps> = {};
  const expansionColumn = props.renderedColumns.find(
    (c) => c.field === EXPAND_COLUMN
  );
  if (expansionColumn && !!props.row) {
    props.row._state = {
      rowOpen: open,
      setRowOpen: (open: boolean) => setOpen(open),
    };
    gridRowProps.selected = open;
  }

  // @ts-ignore
  const getExpandedRow = !!expansionColumn && expansionColumn.renderExpandedRow;
  return (
    <>
      <GridRow key={`${props.rowId}-${open}`} {...props} {...gridRowProps} />

      {!!getExpandedRow && (
        <Collapse in={open} timeout={0}>
          <Box>{getExpandedRow(props.row, open)}</Box>
        </Collapse>
      )}
    </>
  );
};
