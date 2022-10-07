import { FC, useMemo, useState } from "react";
import keyBy from "lodash/keyBy";

import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef } from "@mui/x-data-grid";

import AuditLogViewerComponent from "./components/AuditLogViewerComponent";

import { Audit } from "./types";
import AuditContextProvider from "./hooks/context";
import { usePublishedRoots } from "./hooks/root";

export interface AuditLogViewerProps {
  onSearch: (body: Audit.SearchRequest) => Promise<Audit.SearchResponse>;
  onPageChange: (body: Audit.ResultRequest) => Promise<Audit.ResultResponse>;
  verificationOptions?: {
    onFetchRoot: (body: Audit.RootRequest) => Promise<Audit.RootResponse>;
  };
  sx?: SxProps;
  pageSize?: number;
  dataGridProps?: Partial<DataGridProps>;

  fields?: Partial<Record<keyof Audit.Event, Partial<GridColDef>>>;
  visibilityModel?: Partial<Record<keyof Audit.Event, boolean>>;
}

const AuditLogViewerWithProvider: FC<AuditLogViewerProps> = ({
  onSearch,
  onPageChange,
  verificationOptions,
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
    return onSearch(body)
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
    return onPageChange(body)
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

  const logs: Audit.FlattenedAuditRecord[] = useMemo(
    () =>
      (resultsResponse?.events || searchResponse?.events || []).map(
        (log, idx) => {
          return {
            id: idx,
            ...log,
            // @ts-ignore
            ...(log.envelope ?? {}),
            // @ts-ignore
            ...(log.envelope?.event ?? {}),
          };
        }
      ),
    [resultsResponse?.events, searchResponse?.events]
  );

  const root = resultsResponse?.root || searchResponse?.root;
  const count = searchResponse?.count || 0;
  const limit = props.pageSize;

  const isVerificationCheckEnabled = !!verificationOptions;
  const publishedRoots = usePublishedRoots({
    isVerificationCheckEnabled,
    root,
    logs,
    onFetchRoot: verificationOptions?.onFetchRoot,
  });

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
      visibilityModel={props.visibilityModel}
      limit={limit}
      // Props required for calculating verification
      isVerificationCheckEnabled={isVerificationCheckEnabled}
      root={root}
      publishedRoots={publishedRoots}
      rowToLeafIndex={rowToLeafIndex}
    >
      <AuditLogViewerComponent
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
