import { FC, useEffect, useMemo } from "react";
import pick from "lodash/pick";
import merge from "lodash/merge";
import find from "lodash/find";
import cloneDeep from "lodash/cloneDeep";

import { Box } from "@mui/material";
import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef, GridSortModel } from "@mui/x-data-grid";

import { Audit } from "../../types";
import { PublicAuditQuery, useAuditQuery } from "../../utils/query";
import {
  DefaultOrder,
  DefaultVisibility,
  useAuditContext,
  usePagination,
} from "../../hooks/context";
import {
  PangeaDataGrid,
  PDG,
  useGridSchemaColumns,
} from "@pangeacyber/react-mui-shared";
import { AuditFilterFields, AuditRecordFields } from "../../utils/fields";
import AuditPreviewRow from "../AuditPreviewRow";
import { AuditSecureColumn } from "./secureColumn";
import AuditTimeFilterButton from "./AuditTimeFilterButton";
import { CONDITIONAL_AUDIT_OPTIONS } from "../../utils/autocomplete";

export interface ViewerProps {
  initialQuery?: string;
  logs: Audit.FlattenedAuditRecord[];
  root?: Audit.Root;
  loading: boolean;
  onSearch: (body: Audit.SearchRequest) => Promise<void>;
  sx?: SxProps;
  pageSize?: number;
  dataGridProps?: Partial<DataGridProps>;
  fields?: Partial<Record<keyof Audit.Event, Partial<GridColDef>>>;
  visibilityModel?: Partial<Record<keyof Audit.Event, boolean>>;
  filters?: PublicAuditQuery;
}

const AuditLogViewerComponent: FC<ViewerProps> = ({
  logs,
  loading,
  onSearch,
  sx = {},
  dataGridProps = {},
  fields,
  filters,
  initialQuery,
}) => {
  const { visibilityModel, limit, isVerificationCheckEnabled } =
    useAuditContext();
  const { body, query, queryObj, setQuery, setQueryObj, setSort } =
    useAuditQuery(limit, filters, initialQuery);
  const pagination = usePagination();

  const handleSearch = () => {
    if (!body) return;
    return onSearch(body);
  };

  useEffect(() => {
    if (!!body) handleSearch();
  }, [body]);

  const gridFields: PDG.GridSchemaFields = useMemo(() => {
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
        "timestamp",
        "tenant_id",
      ])
    );
  }, [fields]);

  const columns = useGridSchemaColumns(gridFields);

  return (
    <Box
      sx={{
        width: "100%",
        ".MuiDataGrid-cell--withRenderer.MuiDataGrid-cell": {
          border: "none",
        },
        ".MuiDataGrid-footerContainer": {
          justifyContent: "center",
        },
        ...sx,
      }}
    >
      <PangeaDataGrid
        data={logs}
        columns={columns}
        loading={loading}
        ColumnCustomization={{
          visibilityModel: visibilityModel ?? DefaultVisibility,
          order: DefaultOrder,
        }}
        ExpansionRow={{
          render: (object: any, open: boolean) => {
            if (!open) return null;

            return (
              <AuditPreviewRow
                record={object}
                isVerificationCheckEnabled={isVerificationCheckEnabled}
              />
            );
          },
          GridColDef: {
            ...(isVerificationCheckEnabled ? AuditSecureColumn : {}),
            field: "__expand__",
          },
        }}
        Search={{
          query: query,
          onChange: setQuery,
          Filters: {
            // @ts-ignore
            filters: queryObj,
            onFilterChange: setQueryObj,
            // @ts-ignore
            options: AuditFilterFields,
          },
          conditionalOptions: CONDITIONAL_AUDIT_OPTIONS,
          // @ts-ignore
          EndFilterButton: AuditTimeFilterButton,
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
        }}
      />
    </Box>
  );
};

export default AuditLogViewerComponent;
