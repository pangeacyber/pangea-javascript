import { FC, ReactNode, useMemo, useState } from "react";
import keyBy from "lodash/keyBy";

import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef } from "@mui/x-data-grid";

import AuditLogViewerComponent from "./components/AuditLogViewerComponent";

import { Audit } from "./types";
import AuditContextProvider from "./hooks/context";
import { usePublishedRoots } from "./hooks/root";
import { PublicAuditQuery } from "./utils/query";
import { DEFAULT_AUDIT_SCHEMA } from "./hooks/schema";

export interface AuditLogViewerProps<Event = Audit.DefaultEvent> {
  initialQuery?: string;
  onSearch: (body: Audit.SearchRequest) => Promise<Audit.SearchResponse>;
  onPageChange: (body: Audit.ResultRequest) => Promise<Audit.ResultResponse>;
  verificationOptions?: {
    onFetchRoot: (body: Audit.RootRequest) => Promise<Audit.RootResponse>;
    ModalChildComponent?: FC;
    onCopy?: (message: string, value: string) => void;
  };
  sx?: SxProps;
  pageSize?: number;
  dataGridProps?: Partial<DataGridProps>;

  fields?: Partial<Record<keyof Event, Partial<GridColDef>>>;
  visibilityModel?: Partial<Record<keyof Event, boolean>>;

  filters?: PublicAuditQuery;

  schema?: Audit.Schema;
}

const AuditLogViewerWithProvider = <Event,>({
  onSearch,
  onPageChange,
  verificationOptions,
  schema: schemaProp,
  ...props
}: AuditLogViewerProps<Event>): JSX.Element => {
  const schema = useMemo(() => {
    return schemaProp ?? DEFAULT_AUDIT_SCHEMA;
  }, [schemaProp]);

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
        console.error(`Error from search handler - ${err}`);
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
        console.error(`Error from search handler - ${err}`);
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
  const unpublishedRoot =
    resultsResponse?.unpublished_root || searchResponse?.unpublished_root;
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
      VerificationModalChildComp={verificationOptions?.ModalChildComponent}
      handleVerificationCopy={verificationOptions?.onCopy}
      root={root}
      unpublishedRoot={unpublishedRoot}
      publishedRoots={publishedRoots}
      rowToLeafIndex={rowToLeafIndex}
    >
      <AuditLogViewerComponent
        schema={schema}
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
