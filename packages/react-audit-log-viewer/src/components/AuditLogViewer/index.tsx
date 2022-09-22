import { FC, useMemo, useEffect, useState } from "react";
import merge from "lodash/merge";
import keyBy from "lodash/keyBy";

import { Box } from "@mui/material";
import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef } from "@mui/x-data-grid";
import { ThemeProvider, createTheme, ThemeOptions } from "@mui/material/styles";

import AuditSearch from "../AuditSearch";
import AuditTable from "../AuditTable";


import { Audit } from "../../types";
import { useAuditQuery } from "../../utils/query";
import AuditContextProvider, { useAuditContext } from "../../hooks/context";
import { PublishedRoots, getArweavePublishedRoots } from "../../utils/arweave";

export interface ViewerProps {
  logs: Audit.AuditRecords;
  root?: Audit.Root;
  loading: boolean;
  onSearch: (body: Audit.SearchRequest) => Promise<void>;
  themeOptions?: ThemeOptions;
  sx?: SxProps;
  pageSize?: number;
  dataGridProps?: Partial<DataGridProps>;
  fields?: Partial<Record<keyof Audit.AuditRecord, Partial<GridColDef>>>;
  visibilityModel?: Partial<Record<keyof Audit.AuditRecord, boolean>>;
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

const AuditLogViewer: FC<ViewerProps> = ({
  logs,
  loading,
  onSearch,
  themeOptions,
  sx = {},
  dataGridProps = {},
  fields,
}) => {
  const { limit } = useAuditContext();
  const { body, query, queryObj, setQuery, setQueryObj, setSort } =
    useAuditQuery(limit);

  const handleSearch = () => {
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

export interface AuditLogViewerProps {
  search: (body: Audit.SearchRequest) => Promise<Audit.SearchResponse>;
  fetchResults: (body: Audit.ResultRequest) => Promise<Audit.ResultResponse>;
  fetchRoot: (body: Audit.RootRequest) => Promise<Audit.RootResponse>;
  themeOptions?: ThemeOptions;
  sx?: SxProps;
  pageSize?: number;
  dataGridProps?: Partial<DataGridProps>;
  fields?: Partial<Record<keyof Audit.AuditRecord, Partial<GridColDef>>>;
  visibilityModel?: Partial<Record<keyof Audit.AuditRecord, boolean>>;
}

const AuditLogViewerWithProvider: FC<AuditLogViewerProps> = ({
  search,
  fetchResults,
  fetchRoot,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState<
    Audit.SearchResponse | undefined
  >();
  const [resultsResponse, setResultsResponse] = useState<
    Audit.ResultResponse | undefined
  >();

  const handleSearch = (body: Audit.SearchRequest): Promise<void> => {
    setLoading(true);
    return search(body)
      .then((response) => {
        setLoading(false);
        if (!response) return;

        setSearchResponse(response);
        setResultsResponse(undefined);
      })
      .catch((err) => {
        setLoading(false);
        
        // FIXME: Can we assume how to show erros?
        // FIXME: onError, default way to display search errors
        // showNotification(parseError(err));
      });
  };

  const handleResults = (body: Audit.ResultRequest): Promise<void> => {
    setLoading(true);
    return fetchResults(body)
      .then((response) => {
        setLoading(false);
        if (!response) return;

        setResultsResponse(response);
      })
      .catch((err) => {
        setLoading(false);
        // FIXME: handleException, default way to display search errors
        // showNotification(parseError(err));
      });
  };

  const logs: Audit.AuditRecords = useMemo(
    () =>
      (resultsResponse?.events || searchResponse?.events || []).map((log) => {
        // Currently the audit log viewer just wants flat logs, it doesn't do anything with signing
        // so doesn't look to separate fields like "actor", "action"... from fields like "hash".
        // It mainly wants to simply render data in a table.. basically.
        // For beta, internal audit viewer will simply flatten result. Shipped component will respect the audit
        // response format within the code, to keep consistency. At this time, no need to make a larger refactor of it.
        return {
          // @ts-ignore
          ...(log.event ?? {}),
          // @ts-ignore
          ...(log.envelope ?? {}),
          // @ts-ignore
          ...(log.envelope?.event ?? {}),
          ...log,
        };
      }),
    [resultsResponse?.events, searchResponse?.events]
  );
  const root = resultsResponse?.root || searchResponse?.root;
  const count = searchResponse?.count || 0;
  const limit = props.pageSize;
  const [publishedRoots, setPublishedRoots] = useState<
    PublishedRoots | undefined
  >();

  useEffect(() => {
    if (!root?.tree_name) return;
    const treeName = root?.tree_name;
    const treeSizes = new Set<number>();
    treeSizes.add(root?.size ?? 0);
    logs
      .filter((log) => log.leaf_index !== undefined)
      .forEach((log) => {
        const idx = Number(log.leaf_index);
        treeSizes.add(idx);
        if (idx > 0) {
          treeSizes.add(idx - 1);
        }
      });

    getArweavePublishedRoots(treeName, Array.from(treeSizes), fetchRoot).then(
      (publishedRoots) => {
        setPublishedRoots(publishedRoots);
      }
    );
  }, [root?.tree_name, logs]);

  const rowToLeafIndex = useMemo(() => {
    return keyBy(
      (logs ?? []).map((log, idx) => ({
        idx,
        leaf_index: log.leaf_index,
      })),
      "idx"
    );
  }, [logs]);

  return (
    <AuditContextProvider
      total={count}
      resultsId={searchResponse?.id}
      fetchResults={handleResults}
      limit={limit}
      root={root}
      publishedRoots={publishedRoots}
      rowToLeafIndex={rowToLeafIndex}
      visibilityModel={props.visibilityModel}
    >
      <AuditLogViewer
        logs={logs}
        root={root}
        loading={loading}
        onSearch={handleSearch}
        {...props}
      />
    </AuditContextProvider>
  );
};

export default AuditLogViewerWithProvider;
