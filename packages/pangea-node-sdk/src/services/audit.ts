import PangeaResponse from "../response.js";
import BaseService from "./base.js";
import PangeaConfig from "../config.js";
import { Audit } from "../types.js";
import { PublishedRoots, getArweavePublishedRoots } from "../utils/arweave.js";
import {
  verifyRecordConsistencyProof,
  verifyLogHash,
  verifyLogMembershipProof,
  verifyRecordMembershipProof,
  verifySignature,
  verifyLogConsistencyProof,
} from "../utils/verification.js";
import { canonicalizeEvent } from "../utils/utils.js";
import { PangeaErrors } from "../errors.js";

const SupportedFields = ["actor", "action", "status", "source", "target", "timestamp", "tenant_id"];
const SupportedJSONFields = ["message", "new", "old"];

/**
 * AuditService class provides methods for interacting with the Audit Service
 * @extends BaseService
 */
class AuditService extends BaseService {
  publishedRoots: PublishedRoots;
  prevUnpublishedRootHash: string | undefined;
  tenantID: string | undefined;

  constructor(token: string, config: PangeaConfig, tenantID: string | undefined = undefined) {
    super("audit", token, config);
    this.publishedRoots = {};
    this.publishedRoots = {};
    this.apiVersion = "v1";
    this.prevUnpublishedRootHash = undefined;
    this.tenantID = tenantID;
  }

  /**
   * @summary Log an entry
   * @description Create a log entry in the Secure Audit Log.
   * @param {Object} content - A structured event describing an auditable activity. Supported fields are:
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
   * @param {Object} options - Log options. The following log options are supported:
   *   - verbose (bool): Return a verbose response, including the canonical event hash and received_at time.
   * @returns {Promise} - A promise representing an async call to the log endpoint.
   * @example
   * ```js
   * const auditData = {
   *    action: "add_employee",
   *    actor: user,
   *    target: data.email,
   *    status: "error",
   *    message: `Resume denied - sanctioned country from ${clientIp}`,
   *    source: "web",
   *  };
   *
   *  const logResponse = await audit.log(auditData);
   * ```
   */
  async log(
    content: Audit.Event,
    options: Audit.LogOptions = {}
  ): Promise<PangeaResponse<Audit.LogResponse>> {
    const event: Audit.Event = {
      message: "",
    };

    SupportedFields.forEach((key) => {
      if (key in content) {
        // @ts-ignore
        event[key] = content[key];
      }
    });

    SupportedJSONFields.forEach((key) => {
      if (key in content) {
        // @ts-ignore
        event[key] =
          // @ts-ignore
          content[key] instanceof Object
            ? // @ts-ignore
              JSON.stringify(content[key])
            : // @ts-ignore
              (event[key] = content[key]);
      }
    });

    // Always overwrite tenant_id field
    if (this.tenantID !== undefined) {
      event.tenant_id = this.tenantID;
    }

    const data: Audit.LogData = { event: event };

    if (options.signer && options.signMode == Audit.SignOptions.Local) {
      const signer = options.signer;
      const eventJson = canonicalizeEvent(event);
      const signature = signer.sign(eventJson);
      const pubKey = signer.getPublicKey();

      let publicKeyInfo: { [key: string]: any } = {};
      if (options.publicKeyInfo) {
        Object.assign(publicKeyInfo, options.publicKeyInfo);
      }
      publicKeyInfo["key"] = pubKey;

      data.signature = signature;
      data.public_key = JSON.stringify(publicKeyInfo);
    }

    if (options?.verbose) {
      data.verbose = options.verbose;
    }

    if (options?.verify) {
      data.verbose = true;
      if (this.prevUnpublishedRootHash != undefined) {
        data.prev_root = this.prevUnpublishedRootHash;
      }
    }

    const response: PangeaResponse<Audit.LogResponse> = await this.post("log", data);
    return this.processLogResponse(response, options);
  }

  async processLogResponse(
    response: PangeaResponse<Audit.LogResponse>,
    options: Audit.LogOptions
  ): Promise<PangeaResponse<Audit.LogResponse>> {
    if (!response.success) {
      return response;
    }

    let newUnpublishedRootHash = response.result.unpublished_root;

    if (!options?.skipEventVerification) {
      this.verifyHash(response.result.envelope, response.result.hash);
      response.result.signature_verification = verifySignature(response.result.envelope);
    }

    if (options?.verify) {
      response.result.membership_verification = verifyLogMembershipProof({
        log: response.result,
        newUnpublishedRootHash: newUnpublishedRootHash,
      });

      response.result.consistency_verification = verifyLogConsistencyProof({
        log: response.result,
        newUnpublishedRoot: newUnpublishedRootHash,
        prevUnpublishedRoot: this.prevUnpublishedRootHash,
      });
    }

    if (newUnpublishedRootHash !== undefined) {
      this.prevUnpublishedRootHash = newUnpublishedRootHash;
    }

    return response;
  }

  verifyHash(envelope: Audit.EventEnvelope | undefined, hash: string | undefined): void {
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
   * @summary Search for events
   * @description Search for events that match the provided search criteria.
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
   * const response = await audit.search("add_employee:Gumby")
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

    const response: PangeaResponse<Audit.SearchResponse> = await this.post("search", payload);
    return this.processSearchResponse(response, options);
  }

  /**
   * @summary Results of a search
   * @description Fetch paginated results of a previously executed search
   * @param {String} id - The id of a successful search
   * @param {number} limit (default 20) - The number of results returned
   * @param {number} offset (default 0) - The starting position of the first returned result
   * @param {boolean} verifyResponse (default false) - Verify consistency and membership proof of every record
   * @returns {Promise} - A promise representing an async call to the results endpoint
   * @example
   * ```js
   * const response = await audit.results(pxx_asd0987asdas89a8, 50, 100)
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

    const response: PangeaResponse<Audit.SearchResponse> = await this.post("results", payload);
    return this.processSearchResponse(response, options);
  }

  /**
   * @summary Retrieve tamperproof verification
   * @description Returns current root hash and consistency proof
   * @param {number} size - The size of the tree (the number of records)
   * @returns {Promise} - A promise representing an async call to the results endpoint
   * @example
   * ```js
   * const response = audit.root(7);
   * ```
   */
  root(size: number = 0): Promise<PangeaResponse<Audit.RootResponse>> {
    const data: Audit.RootParams = {};

    if (size > 0) {
      data.tree_size = size;
    }

    return this.post("root", data);
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
