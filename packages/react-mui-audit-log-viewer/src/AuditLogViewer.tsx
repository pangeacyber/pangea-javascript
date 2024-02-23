import { FC, ReactNode, useMemo, useState } from "react";
import keyBy from "lodash/keyBy";

import { saveAs } from "file-saver";

import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef } from "@mui/x-data-grid";

import AuditLogViewerComponent from "./components/AuditLogViewerComponent";

import { Audit, AuthConfig } from "./types";
import AuditContextProvider from "./hooks/context";
import { usePublishedRoots } from "./hooks/root";
import { DEFAULT_AUDIT_SCHEMA, useSchema } from "./hooks/schema";
import { PublicAuditQuery } from "./types/query";
import { useAuditSearchError } from "./hooks/query";

export interface AuditLogViewerProps<Event = Audit.DefaultEvent> {
  initialQuery?: string;

  onSearch: (body: Audit.SearchRequest) => Promise<Audit.SearchResponse>;
  onPageChange: (body: Audit.ResultRequest) => Promise<Audit.ResultResponse>;
  onDownload?: (body: Audit.DownloadResultRequest) => Promise<any>;

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

  config?: AuthConfig;
  schema?: Audit.Schema;
}

const AuditLogViewerWithProvider = <Event,>({
  onSearch,
  onDownload,
  onPageChange,
  verificationOptions,
  config,
  schema: schemaProp,
  initialQuery,
  filters,
  ...props
}: AuditLogViewerProps<Event>): JSX.Element => {
  const { schema } = useSchema(config, schemaProp);

  const [loading, setLoading] = useState(false);
  const [searchResponse, setSearchResponse] = useState<
    Audit.SearchResponse | undefined
  >();
  const [resultsResponse, setResultsResponse] = useState<
    Audit.ResultResponse | undefined
  >();
  const [error, setError] = useState<any>();

  const handleSearch = (body: Audit.SearchRequest): Promise<void> => {
    setLoading(true);
    return onSearch(body)
      .then((response) => {
        setLoading(false);
        if (!response || response?.events === undefined) {
          // @ts-ignore If response.result appears to be 202 result, communicate additional details
          if (!!response?.location && response?.retry_counter !== undefined) {
            setError(
              "Search callback returned empty result, your request is still in progress and requires polling"
            );
            return;
          }

          setError("Search callback returned unexcepted response");
          return;
        }

        setError(undefined);
        setSearchResponse(response);
        setResultsResponse(undefined);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        console.error(`Error from search handler - ${err}`);
      });
  };

  const handleResults = (body: Audit.ResultRequest): Promise<void> => {
    setLoading(true);
    return onPageChange(body)
      .then((response) => {
        setLoading(false);
        if (!response) return;

        setError(undefined);
        setResultsResponse(response);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        console.error(`Error from search handler - ${err}`);
      });
  };

  const handleDownloadResults = async (
    body: Audit.DownloadResultRequest
  ): Promise<void> => {
    if (!onDownload) return;

    setLoading(true);
    return onDownload(body)
      .then(async (response: Response) => {
        let blob = await response.blob();
        let name = `results_${body.result_id}.json.gz`;

        const parts: string[] =
          response.headers.get("Content-Disposition")?.split(";") ?? [];
        parts.forEach((part) => {
          if (part.startsWith("filename=")) {
            name = part.split("filename=")[1];
          }
        });

        saveAs(blob, name);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
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

  const searchError = useAuditSearchError(error);

  return (
    <AuditContextProvider
      total={count}
      resultsId={searchResponse?.id}
      fetchResults={handleResults}
      downloadResults={!!onDownload ? handleDownloadResults : undefined}
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
      initialQuery={initialQuery}
      filters={filters}
    >
      <AuditLogViewerComponent
        schema={schema}
        logs={logs}
        searchError={searchError}
        root={root}
        loading={loading}
        onSearch={handleSearch}
        {...props}
      />
    </AuditContextProvider>
  );
};

export default AuditLogViewerWithProvider;
