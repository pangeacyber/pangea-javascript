import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import mapValues from "lodash/mapValues";

import { Box } from "@mui/material";
import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef, GridSortModel } from "@mui/x-data-grid";

import { Audit } from "../../types";
import {
  useAuditContext,
  usePagination,
  useAuditBody,
} from "../../hooks/context";
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
import DownloadButton from "./DownloadButton";

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
  fieldTypes?: Partial<
    Record<keyof typeof Audit.SchemaFieldType, Partial<GridColDef>>
  >;

  visibilityModel?: Partial<Record<keyof Event, boolean>>;
  filters?: PublicAuditQuery;
  searchOnChange?: boolean;
  searchOnFilterChange?: boolean;
  searchOnMount?: boolean;
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
  fieldTypes,

  searchOnChange = true,
  searchOnFilterChange = true,
  searchOnMount = true,
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
  const { body, bodyWithoutQuery } = useAuditBody(limit, maxResults);
  const pagination = usePagination();
  const defaultVisibility = useDefaultVisibility(schema);
  const defaultOrder = useDefaultOrder(schema);

  const schemaColumns = useAuditColumns(schema, fields, fieldTypes);
  const columns = useAuditColumnsWithErrors(schemaColumns, logs);
  const filterFields = useAuditFilterFields(schema);
  const conditionalOptions = useAuditConditionalOptions(schema);

  const hasMountedRef = useRef(false);

  const bodyRef = useRef(body);
  bodyRef.current = body;

  const handleSearch = () => {
    if (!bodyRef.current) return;
    return onSearch(bodyRef.current);
  };

  useEffect(() => {
    if (
      !!bodyWithoutQuery &&
      (searchOnFilterChange || searchOnMount) &&
      !searchOnChange
    ) {
      if (!searchOnFilterChange && hasMountedRef.current === true) {
        return;
      }

      if (!searchOnMount && hasMountedRef.current === false) {
        hasMountedRef.current = true;
        return;
      }

      hasMountedRef.current = true;
      setTimeout(() => {
        handleSearch();
        // Add slight delay since since filters may update the query string
      }, 100);
    }
  }, [bodyWithoutQuery, searchOnFilterChange, searchOnMount, searchOnChange]);

  useEffect(() => {
    if (!!body && searchOnChange) handleSearch();
  }, [body, searchOnChange]);

  const handleChange = useCallback(
    (newQuery: string) => {
      if (newQuery === query && searchOnChange) {
        handleSearch();
      } else if (newQuery !== query) {
        setQuery(newQuery);
      }
    },
    [query, setQuery, body, searchOnChange]
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
          onSearch: handleSearch,
          onChange: handleChange,
          Filters: {
            // @ts-ignore
            filters: queryObj,
            onFilterChange: (values) =>
              setQueryObj(
                mapValues(values, (v) => (typeof v === "string" ? v.trim() : v))
              ),
            // @ts-ignore
            options: filterFields,
          },
          conditionalOptions,
          // @ts-ignore
          EndFilterButton: AuditTimeFilterButton,
          EndBarComponent: <DownloadButton />,
          SearchButtonProps: {
            color: "primary",
          },
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
