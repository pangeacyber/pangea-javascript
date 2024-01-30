import { FC, useCallback, useEffect, useMemo } from "react";
import find from "lodash/find";

import { Box } from "@mui/material";
import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef, GridSortModel } from "@mui/x-data-grid";

import { Audit } from "../../types";
import { useAuditBody } from "../../utils/query";
import { useAuditContext, usePagination } from "../../hooks/context";
import {
  LinedPangeaDataGrid,
  PangeaDataGrid,
} from "@pangeacyber/react-mui-shared";
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
import { PublicAuditQuery } from "../../types/query";

export interface ViewerProps<Event = Audit.DefaultEvent> {
  initialQuery?: string;
  logs: Audit.FlattenedAuditRecord<Event>[];
  searchError?: {
    message: string;
    start?: number;
    length?: number;
  };
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
  searchError,
  schema,
  loading,
  onSearch,
  sx = {},
  dataGridProps = {},
  fields,
}) => {
  const {
    visibilityModel,
    limit,
    maxResults,
    isVerificationCheckEnabled,

    query,
    queryObj,

    setQuery,
    setQueryObj,
    setSort,
  } = useAuditContext();
  const { body } = useAuditBody(limit, maxResults);
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
    [query, setQuery, body]
  );

  return (
    <Box
      sx={{
        width: "100%",
        ".MuiDataGrid-footerContainer": {
          justifyContent: "center",
        },
        ".PangeaDataGrid-ExpansionRow": {
          borderBottom: "1px solid rgba(224, 224, 224, 1)",
        },
        ".MuiDataGrid-root .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        ...sx,
      }}
    >
      <LinedPangeaDataGrid
        data={logs}
        columns={columns}
        loading={loading}
        ColumnCustomization={{
          // @ts-ignore
          visibilityModel: visibilityModel ?? defaultVisibility,
          order: defaultOrder,
          dynamicFlexColumn: true,
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
          error: searchError,
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
            const sort = !!model.length ? model[0] : undefined;
            if (sort) {
              return setSort({
                order_by: sort.field,
                // @ts-ignore
                order: sort.sort,
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
