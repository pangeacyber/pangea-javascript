import { FilterOptions, PDG, TextCell } from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../types";
import StoreObjectIcon from "../StoreObjectIcon";
import { Stack } from "@mui/material";
import { formatBytes } from "../../utils";

export const StoreViewerFields: PDG.GridSchemaFields<ObjectStore.ObjectResponse> =
  {
    name: {
      label: "Name",
      cellClassName: "columnPrimary",
      width: 250,
      flex: 10,
      renderCell: (params) => {
        const { value } = params;
        const obj = params?.row;

        const mimeType = (obj.name ?? "").split(".").at(-1) ?? "";
        return (
          <Stack direction="row" alignItems="center" spacing={1}>
            <StoreObjectIcon type={obj.type} mimeType={mimeType} />
            <TextCell params={params} />
          </Stack>
        );
      },
    },
    updated_at: {
      label: "Modified At",
      type: "stringDateTime",
      minWidth: 190,
    },
    size: {
      label: "Size",
      renderCell: (params) => {
        params.value = formatBytes(params.value);
        return <TextCell params={params} />;
      },
    },
  };

export const StoreViewerFilters: FilterOptions<ObjectStore.Filter> = {
  size: {
    label: "Size",
  },
  parent_id: {
    label: "Folder Id",
  },
};
