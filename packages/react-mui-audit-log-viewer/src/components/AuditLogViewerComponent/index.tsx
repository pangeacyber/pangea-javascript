import { FC, useEffect } from "react";

import { Box } from "@mui/material";
import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef } from "@mui/x-data-grid";

import AuditSearch from "../AuditSearch";
import AuditTable from "../AuditTable";

import { Audit } from "../../types";
import { PublicAuditQuery, useAuditQuery } from "../../utils/query";
import { useAuditContext } from "../../hooks/context";

export interface ViewerProps {
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

/*
    FIXME: Add feature to audit-log-viewer to support reading query from query parameters
    
    const router = useRouter();

    const { query: urlQuery } = router.query;
    useEffect(() => {
        if (!query && urlQuery) {
        // @ts-ignore
        setQuery(urlQuery);
        }
    }, [urlQuery]);
*/

const AuditLogViewerComponent: FC<ViewerProps> = ({
  logs,
  loading,
  onSearch,
  sx = {},
  dataGridProps = {},
  fields,
  filters,
}) => {
  const { limit } = useAuditContext();
  const { body, query, queryObj, setQuery, setQueryObj, setSort } =
    useAuditQuery(limit, filters);

  const handleSearch = () => {
    if (!body) return;
    return onSearch(body);
  };

  useEffect(() => {
    if (!!body) handleSearch();
  }, [body]);

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <AuditSearch
        query={query}
        queryObj={queryObj}
        setQuery={setQuery}
        setQueryObj={setQueryObj}
        refresh={handleSearch}
        loading={loading}
      />
      <AuditTable
        logs={logs}
        dataGridProps={dataGridProps}
        fields={fields}
        setSort={setSort}
      />
    </Box>
  );
};

export default AuditLogViewerComponent;
