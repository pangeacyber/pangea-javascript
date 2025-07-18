import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { Audit, PangeaToken, PostOptions } from "@src/types.js";
import {
  PublishedRoots,
  getArweavePublishedRoots,
} from "@src/utils/arweave.js";
import {
  verifyRecordConsistencyProof,
  verifyLogHash,
  verifyLogMembershipProof,
  verifyRecordMembershipProof,
  verifySignature,
  verifyLogConsistencyProof,
} from "@src/utils/verification.js";
import {
  canonicalizeEvent,
  eventOrderAndStringifySubfields,
} from "@src/utils/utils.js";
import { PangeaErrors } from "@src/errors.js";

/**
 * AuditService class provides methods for interacting with the Audit Service
 * @extends BaseService
 */
class AuditService extends BaseService {
  private publishedRoots: PublishedRoots;
  private prevUnpublishedRootHash: string | undefined;
  tenantID: string | undefined;

  /**
   * Creates a new `AuditService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ domain: "pangea_domain" });
   * const audit = new AuditService("pangea_token", config);
   * ```
   *
   * @summary Audit
   */
  constructor(
    token: PangeaToken,
    config: PangeaConfig,
    tenantID?: string,
    configID?: string
  ) {
    super("audit", token, config, configID);
    this.publishedRoots = {};
    this.publishedRoots = {};
    this.prevUnpublishedRootHash = undefined;
    this.tenantID = tenantID;
  }

  /**
   * @summary Log an entry
   * @description Create a log entry in the Secure Audit Log.
   * @operationId audit_post_v1_log
   * @param event A structured event describing an auditable activity. Supported fields are:
   *   - actor (string): Record who performed the auditable activity.
   *   - action (string): The auditable action that occurred.
   *   - status (string): Record whether or not the activity was successful.
   *   - source (string): Used to record the location from where an activity occurred.
   *   - target (string): Used to record the specific record that was targeted by the auditable activity.
   *   - message (string|object): A message describing a detailed account of what happened.
   *     This can be recorded as free-form text or as a JSON-formatted string.
   *   - new (string|object): The value of a record after it was changed.
   *   - old (string|object): The value of a record before it was changed.
   *   - tenant_id (string): Used to record the tenant associated with this activity.
   * @param options Log options. The following log options are supported:
   *   - verbose (bool): Return a verbose response, including the canonical event hash and received_at time.
   * @returns A promise representing an async call to the /v1/log endpoint.
   * @example
   * ```js
   * const auditData = {
   *   action: "add_employee",
   *   actor: user,
   *   target: data.email,
   *   status: "error",
   *   message: `Resume denied - sanctioned country from ${clientIp}`,
   *   source: "web",
   * };
   * const options = { verbose: true };
   *
   * const response = await audit.log(auditData, options);
   * ```
   */
  async log(
    event: Audit.Event,
    options: Audit.LogOptions = {}
  ): Promise<PangeaResponse<Audit.LogResponse>> {
    const data = this.getLogEvent(event, options) as Audit.LogData;
    this.setRequestFields(data, options);
    const response: PangeaResponse<Audit.LogResponse> = await this.post(
      "v1/log",
      data
    );
    this.processLogResponse(response.result, options);
    return response;
  }

  /**
   * @summary Log multiple entries
   * @description Create multiple log entries in the Secure Audit Log.
   * @operationId audit_post_v2_log
   * @param {Audit.Event[]} events
   * @param {Audit.LogOptions} options
   * @returns {Promise} - A promise representing an async call to the /v2/log endpoint.
   * @example
   * ```js
   * const events = [
   *  { message: "hello world" },
   * ];
   * const options = { verbose: true };
   *
   * const response = await audit.logBulk(events, options);
   * ```
   */
  async logBulk(
    events: Audit.Event[],
    options: Audit.LogOptions = {}
  ): Promise<PangeaResponse<Audit.LogBulkResponse>> {
    const logEvents: Audit.LogEvent[] = [];
    // biome-ignore lint/complexity/noForEach: TODO
    events.forEach((event) => {
      logEvents.push(this.getLogEvent(event, options));
    });

    const data: Audit.LogBulkRequest = {
      events: logEvents,
      verbose: options.verbose,
    };

    options.verify = false; // Bulk API does not verify
    const response: PangeaResponse<Audit.LogBulkResponse> = await this.post(
      "v2/log",
      data
    );
    // biome-ignore lint/complexity/noForEach: TODO
    response.result.results.forEach((result) => {
      this.processLogResponse(result, options);
    });
    return response;
  }

  /**
   * @summary Log multiple entries asynchronously
   * @description Asynchronously create multiple log entries in the Secure Audit Log.
   * @operationId audit_post_v2_log_async
   * @param {Audit.Event[]} events
   * @param {Audit.LogOptions} options
   * @returns {Promise} - A promise representing an async call to the /v2/log_async endpoint.
   * @example
   * ```js
   * const events = [
   *  { message: "hello world" },
   * ];
   * const options = { verbose: true };
   *
   * const response = await audit.logBulkAsync(events, options);
   * ```
   */
  async logBulkAsync(
    events: Audit.Event[],
    options: Audit.LogOptions = {}
  ): Promise<PangeaResponse<Audit.LogBulkResponse>> {
    const logEvents: Audit.LogEvent[] = [];
    // biome-ignore lint/complexity/noForEach: TODO
    events.forEach((event) => {
      logEvents.push(this.getLogEvent(event, options));
    });

    const data: Audit.LogBulkRequest = {
      events: logEvents,
      verbose: options.verbose,
    };

    const postOptions: PostOptions = {
      pollResultSync: false,
    };

    let response: PangeaResponse<Audit.LogBulkResponse>;
    try {
      response = await this.post("v2/log_async", data, postOptions);
    } catch (e) {
      if (e instanceof PangeaErrors.AcceptedRequestException) {
        // TODO: bad type cast
        return e.pangeaResponse as unknown as PangeaResponse<Audit.LogBulkResponse>;
      }
      throw e;
    }

    options.verify = false; // Bulk API does not verify
    // biome-ignore lint/complexity/noForEach: TODO
    response.result.results.forEach((result) => {
      this.processLogResponse(result, options);
    });
    return response;
  }

  getLogEvent(event: Audit.Event, options: Audit.LogOptions): Audit.LogEvent {
    // Set tenant_id field if unset
    if (event.tenant_id === undefined && this.tenantID !== undefined) {
      event.tenant_id = this.tenantID;
    }

    event = eventOrderAndStringifySubfields(event);
    const data: Audit.LogEvent = { event };

    if (options.signer) {
      const signer = options.signer;
      const signature = signer.sign(canonicalizeEvent(event));
      const pubKey = signer.getPublicKey();
      const algorithm = signer.getAlgorithm();

      const publicKeyInfo: { [key: string]: any } = {};
      if (options.publicKeyInfo) {
        Object.assign(publicKeyInfo, options.publicKeyInfo);
      }
      publicKeyInfo.key = pubKey;
      publicKeyInfo.algorithm = algorithm;

      data.signature = signature;
      data.public_key = JSON.stringify(publicKeyInfo);
    }
    return data;
  }

  setRequestFields(data: Audit.LogData, options: Audit.LogOptions) {
    if (options?.verbose) {
      data.verbose = options.verbose;
    }

    if (options?.verify) {
      data.verbose = true;
      if (this.prevUnpublishedRootHash) {
        data.prev_root = this.prevUnpublishedRootHash;
      }
    }
  }

  processLogResponse(result: Audit.LogResponse, options: Audit.LogOptions) {
    const newUnpublishedRootHash = result.unpublished_root;

    if (!options?.skipEventVerification) {
      this.verifyHash(result.envelope, result.hash);
      result.signature_verification = verifySignature(result.envelope);
    }

    if (options?.verify) {
      result.membership_verification = verifyLogMembershipProof({
        log: result,
        newUnpublishedRootHash,
      });

      result.consistency_verification = verifyLogConsistencyProof({
        log: result,
        newUnpublishedRoot: newUnpublishedRootHash,
        prevUnpublishedRoot: this.prevUnpublishedRootHash,
      });
    }

    if (newUnpublishedRootHash !== undefined) {
      this.prevUnpublishedRootHash = newUnpublishedRootHash;
    }
  }

  verifyHash(
    envelope: Audit.EventEnvelope | undefined,
    hash: string | undefined
  ): void {
    if (envelope === undefined || hash === undefined) {
      return;
    }

    if (!verifyLogHash(envelope, hash)) {
      throw new PangeaErrors.AuditEventError(
        `Error: Fail event hash verification. Hash: ${hash}`,
        envelope
      );
    }
  }

  /**
   * @summary Search the log
   * @description Search for events that match the provided search criteria.
   * @operationId audit_post_v1_search
   * @param {String} query - Natural search string; list of keywords with optional
   *   `<option>:<value>` qualifiers. The following optional qualifiers are supported:
   *   - action:
   *   - actor:
   *   - message:
   *   - new:
   *   - old:
   *   - status:
   *   - target:
   * @param {Object} queryOptions - Search options. The following search options are supported:
   *   - limit (number): Maximum number of records to return per page.
   *   - start (string): The start of the time range to perform the search on.
   *   - end (string): The end of the time range to perform the search on. All records up to the latest if left out.
   *   - max_results (number): Maximum number of results to return.
   *   - order (string): Specify the sort order of the response.
   *   - order_by (string): Name of column to sort the results by.
   *   - search_restriction (Audit.SearchRestriction): A list of keys to restrict the search results to. Useful for partitioning data available to the query string.
   *   - verbose (boolean): If true, include the root hash of the tree and the membership proof for each record.
   *   - return_context (boolean): Return the context data needed to decrypt secure audit events that have been redacted with format preserving encryption.
   * @param {Object} options - Search options. The following search options are supported:
   *   - verifyConsistency (boolean): If true verify published roots and membership proof of each event
   *   - skipEventVerification (boolean): If true skip event hash verification
   * @returns {Promise} - A promise representing an async call to the search endpoint
   * @example
   * ```js
   * const response = await audit.search(
   *   "add_employee:Gumby"
   * );
   * ```
   */
  async search(
    query: string,
    queryOptions: Audit.SearchParamsOptions,
    options: Audit.SearchOptions
  ): Promise<PangeaResponse<Audit.SearchResponse>> {
    const defaults: Audit.SearchParamsOptions = {
      limit: 20,
      order: "desc",
      order_by: "received_at",
    };

    const payload: Audit.SearchParams = { query };
    Object.assign(payload, defaults);
    Object.assign(payload, queryOptions);

    if (options?.verifyConsistency) {
      payload.verbose = true;
    }

    const response: PangeaResponse<Audit.SearchResponse> = await this.post(
      "v1/search",
      payload
    );
    return this.processSearchResponse(response, options);
  }

  /**
   * @summary Results of a search
   * @description Fetch paginated results of a previously executed search.
   * @operationId audit_post_v1_results
   * @param {String} id - The id of a successful search
   * @param {number} limit (default 20) - The number of results returned
   * @param {number} offset (default 0) - The starting position of the first returned result
   * @param {Object} options - Search options. The following search options are supported:
   *   - verifyConsistency (boolean): If true verify published roots and membership proof of each event
   *   - skipEventVerification (boolean): If true skip event hash verification
   * @param {Object} queryOptions - Search options. The following search options are supported:
   *   - assert_search_restriction (Audit.SearchRestriction): A list of keys to restrict the search results to. Useful for partitioning data available to the query string.
   *   - return_context (boolean): Return the context data needed to decrypt secure audit events that have been redacted with format preserving encryption.
   * @returns {Promise} - A promise representing an async call to the results endpoint
   * @example
   * ```js
   * const response = await audit.results(
   *   "pas_sqilrhruwu54uggihqj3aie24wrctakr",
   *   50,
   *   100
   * );
   * ```
   */
  async results(
    id: string,
    limit = 20,
    offset = 0,
    options: Audit.SearchOptions = {},
    queryOptions: Audit.ResultOptions = {}
  ): Promise<PangeaResponse<Audit.ResultResponse>> {
    if (!id) {
      throw new Error("Missing required `id` parameter");
    }

    const payload = {
      id,
      limit,
      offset,
    };
    Object.assign(payload, queryOptions);

    const response: PangeaResponse<Audit.SearchResponse> = await this.post(
      "v1/results",
      payload
    );
    return this.processSearchResponse(response, options);
  }

  /**
   * @summary Log streaming endpoint
   * @description This API allows 3rd party vendors (like Auth0) to stream
   * events to this endpoint where the structure of the payload varies across
   * different vendors.
   * @operationId audit_post_v1_log_stream
   * @param data Event data. The exact schema of this will vary by vendor.
   * @returns A Pangea response.
   * @example
   * ```js
   * const data = {
   *   logs: [
   *     {
   *       log_id: "some log id",
   *       data: {
   *         date: "2024-03-29T17:26:50.193Z",
   *         type: "some_type",
   *         description: "Create a log stream",
   *         client_id: "test client ID",
   *         ip: "127.0.0.1",
   *         user_agent: "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0",
   *         user_id: "test user ID",
   *       },
   *     },
   *   ],
   * };
   * const response = await audit.logStream(data);
   * ```
   */
  logStream(data: object): Promise<PangeaResponse<{}>> {
    return this.post("v1/log_stream", data);
  }

  /**
   * @summary Export from the audit log
   * @description Bulk export of data from the Secure Audit Log, with optional
   * filtering.
   * @operationId audit_post_v1_export
   * @param request Request parameters.
   * @returns A Pangea response with a `request_id` that can be used to fetch
   * the exported results at a later time.
   * @example
   * ```js
   * const exportRes = await audit.export({ verbose: false });
   *
   * // Export may take several dozens of minutes, so polling for the result
   * // should be done in a loop. That is omitted here for brevity's sake.
   * try {
   *   await audit.pollResult(exportRes.request_id);
   * } catch (error) {
   *   if (error instanceof PangeaErrors.AcceptedRequestException) {
   *     // Retry later.
   *   }
   * }
   *
   * // Download the result when it's ready.
   * const downloadRes = await audit.downloadResults({ request_id: exportRes.request_id });
   * downloadRes.result.dest_url;
   * // => https://pangea-runtime.s3.amazonaws.com/audit/xxxxx/search_results_[...]
   * ```
   */
  async export(request: Audit.ExportRequest): Promise<PangeaResponse<{}>> {
    try {
      return await this.post("v1/export", request, { pollResultSync: false });
    } catch (error) {
      if (error instanceof PangeaErrors.AcceptedRequestException) {
        return error.pangeaResponse;
      }
      throw error;
    }
  }

  /**
   * @summary Tamperproof verification
   * @description Returns current root hash and consistency proof.
   * @operationId audit_post_v1_root
   * @param {number} size - The size of the tree (the number of records)
   * @returns {Promise} - A promise representing an async call to the endpoint
   * @example
   * ```js
   * const response = audit.root(7);
   * ```
   */
  root(size: number = 0): Promise<PangeaResponse<Audit.RootResult>> {
    const data: Audit.RootParams = {};

    if (size > 0) {
      data.tree_size = size;
    }

    return this.post("v1/root", data);
  }

  /**
   * @summary Download search results
   * @description Get all search results as a compressed (gzip) CSV file.
   * @operationId audit_post_v1_download_results
   * @param request Request parameters.
   * @returns URL where search results can be downloaded.
   * @example
   * ```js
   * const response = await audit.downloadResults({
   *   result_id: "pas_[...]",
   *   format: Audit.DownloadFormat.CSV,
   * });
   * ```
   */
  downloadResults(
    request: Audit.DownloadRequest
  ): Promise<PangeaResponse<Audit.DownloadResult>> {
    if (!request.request_id && !request.result_id) {
      throw new TypeError("Must specify one of `request_id` or `result_id`.");
    }

    if (request.request_id && request.result_id) {
      throw new TypeError(
        "Must specify only one of `request_id` or `result_id`."
      );
    }

    return this.post("v1/download_results", request);
  }

  async processSearchResponse(
    response: PangeaResponse<Audit.SearchResponse>,
    options: Audit.SearchOptions
  ): Promise<PangeaResponse<Audit.SearchResponse>> {
    if (!response.success) {
      return response;
    }

    const localRoot = async (treeSize: number) => {
      const response = await this.root(treeSize);
      const root: Audit.Root = response.result.data;
      return root;
    };

    const fixConsistencyProof = async (treeSize: number) => {
      // we can only fix if the root has been downloaded
      const pubRoot: Audit.Root | undefined = this.publishedRoots[treeSize];
      if (pubRoot === undefined) {
        return;
      }

      const root: Audit.Root = await localRoot(treeSize);

      // compare the root hash with the published root hash
      if (root?.root_hash !== pubRoot.root_hash) {
        return;
      }

      // override the proof
      pubRoot.consistency_proof = root.consistency_proof;
    };

    if (!options?.skipEventVerification) {
      // biome-ignore lint/complexity/noForEach: TODO
      response.result.events.forEach((record: Audit.AuditRecord) => {
        this.verifyHash(record.envelope, record.hash);
        record.signature_verification = verifySignature(record.envelope);
      });
    }

    if (options?.verifyConsistency) {
      const root = response.result.root;
      if (root !== undefined) {
        const treeName = root?.tree_name;
        const treeSizes = new Set<number>();
        treeSizes.add(root?.size ?? 0);

        // biome-ignore lint/complexity/noForEach: TODO
        response.result.events.forEach((record: Audit.AuditRecord) => {
          if (record.leaf_index !== undefined) {
            const idx = Number(record.leaf_index);
            treeSizes.add(idx + 1);
            if (idx > 0) {
              treeSizes.add(idx);
            }
          }
        });

        this.publishedRoots = await getArweavePublishedRoots(
          treeName,
          Array.from(treeSizes),
          localRoot
        );
      }

      const pending: Promise<void>[] = [];

      // biome-ignore lint/complexity/noForEach: TODO
      response.result.events.forEach((record: Audit.AuditRecord) => {
        record.membership_verification = verifyRecordMembershipProof({
          root: record.published ? root : response.result.unpublished_root,
          record,
        });

        record.consistency_verification = verifyRecordConsistencyProof({
          publishedRoots: this.publishedRoots,
          record,
        });

        if (
          record.consistency_verification === "fail" &&
          record.leaf_index !== undefined
        ) {
          pending.push(
            fixConsistencyProof(
              Number.parseInt(record.leaf_index, 10) + 1
            ).then(() => {
              record.consistency_verification = verifyRecordConsistencyProof({
                publishedRoots: this.publishedRoots,
                record,
              });
            })
          );
        }
      });

      await Promise.all(pending);
    }
    return response;
  }
}

export default AuditService;
