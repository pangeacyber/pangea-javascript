import { FC, useCallback, useEffect, useMemo } from "react";
import pick from "lodash/pick";
import merge from "lodash/merge";
import find from "lodash/find";
import cloneDeep from "lodash/cloneDeep";

import { Box } from "@mui/material";
import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef, GridSortModel } from "@mui/x-data-grid";

import { Audit } from "../../types";
import { PublicAuditQuery, useAuditQuery } from "../../utils/query";
import { useAuditContext, usePagination } from "../../hooks/context";
import { PangeaDataGrid } from "@pangeacyber/react-mui-shared";
import AuditPreviewRow from "../AuditPreviewRow";
import { AuditSecureColumn } from "./secureColumn";
import AuditTimeFilterButton from "./AuditTimeFilterButton";
import {
  useAuditColumns,
  useAuditColumnsWithErrors,
  useAuditConditionalOptions,
  useAuditFilterFields,
  useDefaultOrder,
  useDefaultVisibility,
} from "../../hooks/schema";

export interface ViewerProps<Event = Audit.DefaultEvent> {
  initialQuery?: string;
  logs: Audit.FlattenedAuditRecord<Event>[];
  schema: Audit.Schema;
  root?: Audit.Root;
  loading: boolean;
  onSearch: (body: Audit.SearchRequest) => Promise<void>;
  sx?: SxProps;
  pageSize?: number;
  dataGridProps?: Partial<DataGridProps>;
  fields?: Partial<Record<keyof Event, Partial<GridColDef>>>;
  visibilityModel?: Partial<Record<keyof Event, boolean>>;
  filters?: PublicAuditQuery;
}

const AuditLogViewerComponent: FC<ViewerProps> = ({
  logs,
  schema,
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
  const defaultVisibility = useDefaultVisibility(schema);
  const defaultOrder = useDefaultOrder(schema);

  const schemaColumns = useAuditColumns(schema, fields);
  const columns = useAuditColumnsWithErrors(schemaColumns, logs);
  const filterFields = useAuditFilterFields(schema);
  const conditionalOptions = useAuditConditionalOptions(schema);

  const handleSearch = () => {
    if (!body) return;
    return onSearch(body);
  };

  useEffect(() => {
    if (!!body) handleSearch();
  }, [body]);

  const handleChange = useCallback(
    (newQuery: string) => {
      if (newQuery === query) {
        handleSearch();
      } else {
        setQuery(newQuery);
      }
    },
    [query, setQuery]
  );

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
          // @ts-ignore
          visibilityModel: visibilityModel ?? defaultVisibility,
          order: defaultOrder,
        }}
        ExpansionRow={{
          render: (object: any, open: boolean) => {
            if (!open) return null;

            return (
              <AuditPreviewRow
                record={object}
                isVerificationCheckEnabled={isVerificationCheckEnabled}
                schema={schema}
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
          onChange: handleChange,
          Filters: {
            // @ts-ignore
            filters: queryObj,
            onFilterChange: setQueryObj,
            // @ts-ignore
            options: filterFields,
          },
          conditionalOptions,
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
