import mapValues from "lodash/mapValues";
import get from "lodash/get";
import { Dictionary } from "lodash";
import { GridColDef } from "@mui/x-data-grid";
import { Visibility } from "./components/Search/ColumnsPopout";

export const getVisibilityFromModel = (
  model: Record<string, boolean>,
  columnsMap: Dictionary<GridColDef>
): Visibility => {
  return mapValues(model, (val, key) => ({
    isVisible: val,
    label: get(columnsMap, key, { headerName: key }).headerName ?? key,
  }));
};

export const getModelFromVisibility = (
  vis: Visibility
): Record<string, boolean> => {
  return mapValues(vis, (val) => val.isVisible);
};
