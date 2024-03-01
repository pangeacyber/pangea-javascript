import { useTheme, lighten, darken } from "@mui/material/styles";
import PangeaDataGrid, { PangeaDataGridProps } from "../PangeaDataGrid";
import { GridValidRowModel } from "@mui/x-data-grid";

const LinedPangeaDataGrid = <
  DataType extends GridValidRowModel = { id: string },
  FiltersObj extends { [key: string]: string } = Record<string, string>
>(
  props: PangeaDataGridProps<DataType, FiltersObj>
): JSX.Element => {
  const theme = useTheme();

  const modify = theme.palette.mode === "dark" ? darken : lighten;
  return (
    <PangeaDataGrid
      {...props}
      DataGridProps={{
        className: "LinedPangeaDataGrid-root",
        columnHeaderHeight: 50,
        rowHeight: 50,
        ...(props?.DataGridProps ?? {}),
      }}
      sx={{
        ".PangeaDataGrid-WrappingStack-root": {
          borderTop: "1px solid rgba(224, 224, 224, 1)",
        },
        ".PangeaDataGrid-PreviewPanel-root": {
          borderLeft: "1px solid rgba(224, 224, 224, 1)",
        },
        ".LinedPangeaDataGrid-root.MuiDataGrid-root .MuiDataGrid-columnHeaders":
          {
            borderRadius: "0px",
            textTransform: "capitalize",
            backgroundColor: "inherit",
            fontWeight: "400",
            fontSize: "14px",
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
            color: theme.palette.text.primary,
            ".MuiDataGrid-columnHeaderTitle": {
              fontWeight: "400",
            },
            ".MuiDataGrid-columnSeparator": {
              opacity: "0!important",
            },
          },
        ".MuiDataGrid-root .MuiDataGrid-cell": {
          borderBottom: "1px solid rgba(224, 224, 224, 1)",
        },
        ".MuiDataGrid-row, .MuiDataGrid-row.Mui-selected": {
          borderRadius: "0px",
        },
        ".MuiDataGrid-root .MuiDataGrid-row.Mui-selected": {
          backgroundColor: modify(theme.palette.info.main, 0.9),
          ".PangeaDataGrid-Pinned-Right": {
            backgroundColor: modify(theme.palette.info.main, 0.9),
          },
          ":hover": {
            backgroundColor: modify(theme.palette.info.main, 0.85),
            ".PangeaDataGrid-Pinned-Right": {
              backgroundColor: modify(theme.palette.info.main, 0.85),
            },
          },
        },
        ".MuiDataGrid-root .MuiDataGrid-row": {
          ":hover": {
            backgroundColor: modify(theme.palette.info.main, 0.85),
            ".PangeaDataGrid-Pinned-Right": {
              backgroundColor: modify(theme.palette.info.main, 0.85),
            },
          },
        },
        ...(props?.sx ?? {}),
      }}
    />
  );
};

export default LinedPangeaDataGrid;
