import { FC, useMemo } from "react";
import pick from "lodash/pick";
import merge from "lodash/merge";
import find from "lodash/find";
import cloneDeep from "lodash/cloneDeep";
import { Box } from "@mui/material";

import { AuditRecordFields } from "../../utils/fields";
import { Audit } from "../../types";
import { DataGridProps, GridColDef, GridSortModel } from "@mui/x-data-grid";
import AuditPreviewRow from "../AuditPreviewRow";
import { AuditSecureColumn } from "./secureColumn";
import { useAuditContext, usePagination } from "../../hooks/context";
import { Sort } from "../../utils/query";

import { useFormSchemaColumns } from "../../hooks";
import { PangeaDataGrid } from "@pangeacyber/react-shared"

enum AuditTableView {
  Preview = "preview",
  Detail = "detail",
}

interface Props {
  logs: Audit.AuditRecords;
  dataGridProps?: Partial<DataGridProps>;
  fields?: Partial<Record<keyof Audit.AuditRecord, Partial<GridColDef>>>;
  options?: {
    view: AuditTableView;
  };
  setSort: (sort?: Sort) => void;
}

const AuditTable: FC<Props> = ({
  logs,
  dataGridProps = {},
  fields,
  setSort,
  options,
}) => {
  const { visibility, order, limit } = useAuditContext();
  const pagination = usePagination();
  // FIXME: This doesn't feel right
  const gridFields: any = useMemo(() => {
    return merge(
      cloneDeep(AuditRecordFields),
      pick(fields, [
        "actor",
        "action",
        "message",
        "new",
        "old",
        "status",
        "target",
        "received_at",
      ])
    );
  }, [fields]);
  const columns = useFormSchemaColumns(gridFields, order);

  return (
    <Box
      sx={{
        ".MuiDataGrid-cell--withRenderer.MuiDataGrid-cell": {
          border: "none",
        },
        ".MuiDataGrid-footerContainer": {
          justifyContent: "center",
        },
      }}
    >
      <PangeaDataGrid
        data={logs.map((log, idx) => ({ ...log, id: idx }))}
        columns={columns}
        ExpansionRow={{
          render: (object: any, open: boolean) => {
            if (!open) return null;

            return <AuditPreviewRow record={object} />;
          },
          GridColDef: {
            ...AuditSecureColumn,
            field: "__expand__",
          },
        }}
        ServerPagination={pagination}
        DataGridProps={{
          ...dataGridProps,
          filterMode: "server",
          sortingMode: "server",
          onSortModelChange: (model: GridSortModel) => {
            const created = find(model, (sort) => sort.field === "received_at");
            if (created) {
              return setSort({
                order_by: "received_at",
                // @ts-ignore
                order: created.sort,
              });
            }

            return setSort(undefined);
          },
          columnVisibilityModel: visibility,
        }}
      />
    </Box>
  );
};

export default AuditTable;
