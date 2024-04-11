import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { Audit, PostOptions } from "@src/types.js";
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
    token: string,
    config: PangeaConfig,
    tenantID?: string,
    configID?: string
  ) {
    // FIXME: Temporary check to still support configID from PangeaConfig
    if (!configID && config.configID) {
      configID = config.configID;
    }
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
    let data = this.getLogEvent(event, options) as Audit.LogData;
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
    let logEvents: Audit.LogEvent[] = [];
    events.forEach((event) => {
      logEvents.push(this.getLogEvent(event, options));
    });

    let data: Audit.LogBulkRequest = {
      events: logEvents,
      verbose: options.verbose,
    };

    options.verify = false; // Bulk API does not verify
    const response: PangeaResponse<Audit.LogBulkResponse> = await this.post(
      "v2/log",
      data
    );
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
    let logEvents: Audit.LogEvent[] = [];
    events.forEach((event) => {
      logEvents.push(this.getLogEvent(event, options));
    });

    let data: Audit.LogBulkRequest = {
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
        return e.pangeaResponse;
      } else {
        throw e;
      }
    }

    options.verify = false; // Bulk API does not verify
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
    const data: Audit.LogEvent = { event: event };

    if (options.signer) {
      const signer = options.signer;
      const signature = signer.sign(canonicalizeEvent(event));
      const pubKey = signer.getPublicKey();
      const algorithm = signer.getAlgorithm();

      let publicKeyInfo: { [key: string]: any } = {};
      if (options.publicKeyInfo) {
        Object.assign(publicKeyInfo, options.publicKeyInfo);
      }
      publicKeyInfo["key"] = pubKey;
      publicKeyInfo["algorithm"] = algorithm;

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
      if (this.prevUnpublishedRootHash != undefined) {
        data.prev_root = this.prevUnpublishedRootHash;
      }
    }
  }

  processLogResponse(result: Audit.LogResponse, options: Audit.LogOptions) {
    let newUnpublishedRootHash = result.unpublished_root;

    if (!options?.skipEventVerification) {
      this.verifyHash(result.envelope, result.hash);
      result.signature_verification = verifySignature(result.envelope);
    }

    if (options?.verify) {
      result.membership_verification = verifyLogMembershipProof({
        log: result,
        newUnpublishedRootHash: newUnpublishedRootHash,
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
        "Error: Fail event hash verification. Hash: " + hash,
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
   * @param {Object} options - Search options. The following search options are supported:
   *   - limit (number): Maximum number of records to return per page.
   *   - start (string): The start of the time range to perform the search on.
   *   - end (string): The end of the time range to perform the search on. All records up to the latest if left out.
   *   - sources (array): A list of sources that the search can apply to. If empty or not provided, matches only the default source.
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
   * @param {boolean} verifyResponse (default false) - Verify consistency and membership proof of every record
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
    options: Audit.SearchOptions
  ): Promise<PangeaResponse<Audit.ResultResponse>> {
    if (!id) {
      throw new Error("Missing required `id` parameter");
    }

    const payload = {
      id,
      limit,
      offset,
    };

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

    if (!options?.skipEventVerification) {
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

      response.result.events.forEach((record: Audit.AuditRecord) => {
        record.membership_verification = verifyRecordMembershipProof({
          root: record.published ? root : response.result.unpublished_root,
          record: record,
        });

        record.consistency_verification = verifyRecordConsistencyProof({
          publishedRoots: this.publishedRoots,
          record: record,
        });
      });
    }
    return response;
  }
}

export default AuditService;
