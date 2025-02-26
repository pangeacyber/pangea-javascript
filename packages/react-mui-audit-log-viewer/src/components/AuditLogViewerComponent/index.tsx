import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import mapValues from "lodash/mapValues";

import { Box } from "@mui/material";
import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef, GridSortModel } from "@mui/x-data-grid";

import { Audit, FilterOptions } from "../../types";
import {
  useAuditContext,
  usePagination,
  useAuditBody,
} from "../../hooks/context";
import { LinedPangeaDataGrid } from "@pangeacyber/react-mui-shared";
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
import AuditLogViewerFiltersForm from "../AuditLogViewerFiltersForm";

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
  onVisibilityModelChange?: (visibilityModel: Record<any, boolean>) => void;

  order?: string[];
  onOrderChange?: (order: string[]) => void;

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

  initialQuery = "",

  onVisibilityModelChange,

  order,
  onOrderChange,
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

    filterOptions,
  } = useAuditContext();
  const { body, bodyWithoutQuery } = useAuditBody(limit, maxResults);
  const pagination = usePagination();
  const defaultVisibility = useDefaultVisibility(schema);
  const defaultOrder = useDefaultOrder(schema);

  const schemaColumns = useAuditColumns(schema, fields, fieldTypes);
  const columns = useAuditColumnsWithErrors(schemaColumns, logs);
  const filterFields = useAuditFilterFields(schema, filterOptions);
  const conditionalOptions = useAuditConditionalOptions(schema, filterOptions);

  const hasMountedRef = useRef<string | undefined>(undefined);

  const bodyRef = useRef(body);
  bodyRef.current = body;

  const handleSearch = () => {
    if (!bodyRef.current) return;
    return onSearch(bodyRef.current);
  };

  useEffect(() => {
    const initialQuery_ = initialQuery ?? "";
    if (
      !!bodyWithoutQuery &&
      (searchOnFilterChange || searchOnMount) &&
      !searchOnChange
    ) {
      if (!searchOnFilterChange && hasMountedRef.current === initialQuery_) {
        return;
      }

      if (!searchOnMount && hasMountedRef.current === undefined) {
        hasMountedRef.current = initialQuery_;
        return;
      }

      hasMountedRef.current = initialQuery_;
      setTimeout(() => {
        handleSearch();
        // Add slight delay since since filters may update the query string
      }, 100);
    }
  }, [
    bodyWithoutQuery,
    searchOnFilterChange,
    searchOnMount,
    searchOnChange,
    initialQuery,
  ]);

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
          onVisibilityModelChange,

          order: order ?? defaultOrder,
          onOrderChange,

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
            // Note: This doesn't have to accept the queryObj, and it doesn't have update the queryObj
            // since the thinking to directly just "Apply Filters" then it would make more
            // sense to have this callback directly feed into the query, and not mess with the current
            // queryObj (only may be onFiltersChange wouldn't apply... currently that is default enabled)
            onFilterChange: (values) =>
              setQueryObj(
                mapValues(values, (v: any) =>
                  typeof v === "string" ? v.trim() : v
                )
              ),

            // @ts-ignore
            options: filterFields,

            // @ts-ignore AuditFiltersObject is a different format than standard, that is okay
            FiltersFormComponent: AuditLogViewerFiltersForm,
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
