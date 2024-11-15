import { FC, ReactNode, useMemo, useState } from "react";
import keyBy from "lodash/keyBy";

import { SxProps } from "@mui/system";
import { DataGridProps, GridColDef } from "@mui/x-data-grid";

import AuditLogViewerComponent from "./components/AuditLogViewerComponent";

import { Audit, AuthConfig, SchemaOptions } from "./types";
import AuditContextProvider from "./hooks/context";
import { usePublishedRoots } from "./hooks/root";
import { DEFAULT_AUDIT_SCHEMA, useSchema } from "./hooks/schema";
import { PublicAuditQuery } from "./types/query";
import { useAuditSearchError } from "./hooks/query";

/** Properties related to the behavior and use of the AuditLogViewer. */
export interface AuditLogViewerProps<Event = Audit.DefaultEvent> {
  /** The default initial search query */
  initialQuery?: string;

  /** Called when the user performs a search. Should make a call to the Audit Service /search endpoint proxied through your application server */
  onSearch: (body: Audit.SearchRequest) => Promise<Audit.SearchResponse>;

  /** Prevent the search input to auto search on change. If false will only search when the "Search" button is clicked or if the "Enter" key is typed while focused on the search input */

  /**
   * Flag to control if the onSearch callback should be triggered automatically as the user edits the search query. If false will only search when the "Search" button is clicked or if the "Enter" key is typed while focused on the search input.
   *
   * @defaultValue true
   */
  searchOnChange?: boolean;

  /** Flag to control if onSearch callback should be trigger on filter or sort changes. Default: true. Set to false if search should only be triggered when the Search button is clicked */
  searchOnFilterChange?: boolean;

  /**
   * Flag to control is onSearch callback should be trigger on component mount. Set to false to prevent search on component load.
   *
   * @defaultValue true
   */
  searchOnMount?: boolean;

  /** Called when the user navigates to a different page of results. It should make a call to the Audit Service /results endpoint proxied through your application server */
  onPageChange: (body: Audit.ResultRequest) => Promise<Audit.ResultResponse>;

  /** Called when the user requests to download results. It should make a call to the Audit Service /results endpoint proxied through your application server */
  onDownload?: (
    body: Audit.DownloadResultRequest
  ) => Promise<Audit.DownloadResultResponse>;

  /** Contains options that let you control whether or not to include client side verification on audit logs */
  verificationOptions?: {
    /** Called when the root data needs to be fetched. It should make a call to the Audit Service /root endpoint proxied through your application server */
    onFetchRoot: (body: Audit.RootRequest) => Promise<Audit.RootResponse>;

    /** Serves as a child component for the VerificationModal dialog. */
    ModalChildComponent?: FC;

    /** Called when the user copies a value from the component from the VerificationModal component */
    onCopy?: (message: string, value: string) => void;
  };

  /** Options for highlighting and retrieving format preserving encryption (FPE) context for each audit log. An audit event only has FPE context if FPE redaction was used on the log from a Pangea Redact Service integration */
  fpeOptions?: {
    /** Controls the highlight values in the log which we redacted with FPE */
    highlightRedaction?: boolean;
  };

  /** Additional SX style (MUI) properties to be applied to the component */
  sx?: SxProps;

  /** Number of items to display per page */
  pageSize?: number;

  /** Additional props to be passed to the underlying MUI DataGrid component */
  dataGridProps?: Partial<DataGridProps>;

  /** Partial definitions for the grid columns. The keys of the object correspond to the properties of the Event type, and the values are partial definitions of the GridColDef type */
  fields?: Partial<Record<keyof Event, Partial<GridColDef>>>;

  /** Partial definitions for the grid columns. The keys of the object correspond to the properties of the Event type, and the values are partial definitions of the GridColDef type */
  fieldTypes?: Partial<
    Record<keyof typeof Audit.SchemaFieldType, Partial<GridColDef>>
  >;

  /** Partial definitions for the visibility of the grid columns. The keys of the object correspond to properties of the Event type, and the values are boolean values indicating the visibility of the column */
  visibilityModel?: Partial<Record<keyof Event, boolean>>;

  /** The public audit query to filter the audit log data */
  filters?: PublicAuditQuery;

  /** Authentication configuration. It is used to fetch your project's custom Audit schema, so the AuditLogViewer component can dynamically update when you update your configuration in the Pangea Console */
  config?: AuthConfig;

  /** The Audit Schema. With Audit Service custom schema support, you can change the expected Audit schema. This will control which fields are rendered */
  schema?: Audit.Schema;

  /** Options of mutating the audit schema the component uses */
  schemaOptions?: SchemaOptions;
}

/**
 * @hidden
 */
const AuditLogViewerWithProvider = <Event,>({
  onSearch,
  onDownload,
  onPageChange,
  verificationOptions,
  config,
  schema: schemaProp,
  schemaOptions,
  initialQuery,
  filters,
  fpeOptions,
  ...props
}: AuditLogViewerProps<Event>): JSX.Element => {
  const { schema } = useSchema(config, schemaProp, schemaOptions);

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
    return onSearch({
      ...body,
      ...(!!fpeOptions?.highlightRedaction && {
        return_context: true,
      }),
    })
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
    return onPageChange({
      ...body,
      ...(!!fpeOptions?.highlightRedaction && {
        return_context: true,
      }),
    })
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
    return onDownload({
      ...body,
      ...(!!fpeOptions?.highlightRedaction && {
        return_context: true,
      }),
    })
      .then((response) => {
        setLoading(false);
        if (response?.dest_url) {
          window.open(response?.dest_url, "_blank");
          setError(undefined);
        } else {
          setError(
            new Error(
              "Error from download handler, expected dest_url to be returned in response"
            )
          );
        }
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
      loading={loading}
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
        initialQuery={initialQuery}
        {...props}
      />
    </AuditContextProvider>
  );
};

export default AuditLogViewerWithProvider;
