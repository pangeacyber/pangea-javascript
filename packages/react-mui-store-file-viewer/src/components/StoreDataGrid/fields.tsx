import { FilterOptions, PDG, TextCell } from "@pangeacyber/react-mui-shared";
import { ObjectStore } from "../../types";
import StoreObjectIcon from "../StoreObjectIcon";
import { Box, Stack } from "@mui/material";
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
        const value = params.value;
        try {
          if (!isNaN(value)) {
            const numValue = Number(value);
            if (typeof numValue === "number") {
              params.value = formatBytes(numValue);
            }
          }
        } catch {}

        return <TextCell params={params} />;
      },
    },
  };

export const StoreViewerFilters: FilterOptions<ObjectStore.Filter> = {
  folder: {
    label: "Folder",
  },
  tags: {
    label: "Tags",
    type: "csv",
  },
};
