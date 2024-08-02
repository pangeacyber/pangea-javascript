// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

export namespace Audit {
  export interface Config {
    id: string;
    retention: string;
    hotstorage: string;
  }

  export interface FieldError {
    field: string;
    value: string;
    error: string;
  }

  /**
   * Describes the details of an event from Secure Audit Log
   */
  export interface DefaultEvent {
    /**
     * What action was performed on a record
     *
     * **Max Length:** 32
     */
    action?: string;

    /**
     * An identifier for _who_ the audit record is about.
     *
     * **Max Length:** 128
     */
    actor?: string;

    /**
     * A free form text field describing the event.
     *
     * **Max Length:** 32,766
     */
    message?: string;

    /**
     * The status or result of the event.
     *
     * **Max Length:** 32
     */
    status?: string;

    /**
     * The source of a record.
     *
     * **Max Length:** 128
     */
    source?: string;

    /**
     * The value of a record after it was changed.
     *
     * **Max Length:** 32,766
     */
    new?: string;
    /**
     * The value of a record before it was changed.
     *
     * **Max Length:** 32,766
     */
    old?: string;

    /**
     * An identifier for what the audit record is about.
     *
     * **Max Length:** 128
     */
    target?: string;

    /**
     * An optional client-supplied timestamp.
     *
     * **Max Length:** 128
     */
    timestamp?: string;

    /**
     * An optional client-supplied tenant_id.
     *
     * **Max Length:** 128
     */
    tenant_id?: string;

    /** FIXME: This is part of Envelope */
    /**
     * A Pangea provided timestamp of when the event was received.
     */
    received_at?: string;

    /**
     * Internal Field
     * @hidden
     */
    err?: string;
  }

  /**
   * A sealed envelope containing the event that was logged. Includes event metadata such as optional client-side signature details and server-added timestamps.
   */
  export interface Envelope<Event = DefaultEvent> {
    /** @typeParam {DefaultEvent} The related event data for the log */
    event: Event;

    /**
     * A Pangea provided timestamp of when the event was received.
     */
    received_at?: string;

    /**
     * The base64-encoded ed25519 public key used for the signature, if one is provided
     *
     * **Max Length:** 256
     */
    public_key?: string;

    /**
     * This is the signature of the hash of the canonicalized event that can be verified with the public key provided in the public_key field. Signatures cannot be used with the redaction feature turned on. If redaction is required, the user needs to perform redaction before computing the signature that is to be sent with the message. The SDK facilitates this for users.
     *
     * **Max Length:** 256
     */
    signature?: string;
  }

  /**
   * Describes a single log or record from Secure Audit Log
   */
  export interface AuditRecord {
    /**
     * The sealed envelope for the record
     */
    envelope: Envelope;

    /**
     * The index of the leaf in the tree
     */
    leaf_index?: string;

    /**
     * A proof for verifying that the buffer_root contains the received event
     */
    membership_proof?: string;

    /**
     * The hash of the event data.
     *
     * **Length:** 64
     */
    hash?: string;

    /**
     * Whether the record has been published
     */
    published?: boolean;

    /** Only present in logs if record is signed by Vault */
    valid_signature?: boolean;

    /** Present if FPE redection was used against the log */
    fpe_context?: string;
  }

  export interface FlattenedAuditRecord<Event = DefaultEvent>
    extends AuditRecord,
      Envelope {
    id: number;

    /** Internal Field */
    err?: string;
  }

  export interface VerificationArtifact<Event = DefaultEvent> {
    envelope: {
      event?: Event;
      received_at?: string;
      public_key?: string;
      signature?: string;
    };
    hash?: string;
    leaf_index?: string;
    root?: Root;
    unpublished_root?: Root;
  }

  /**
   * An identifier of a [merkle tree](https://pangea.cloud/docs/audit/merkle-trees)
   */
  export interface Root {
    /**
     * The URL where this root has been published
     */
    url?: string;

    /**
     * The date/time when this root was published
     */
    published_at?: string;

    /**
     * The size of the tree (the number of records)
     *
     * **Minimum:** 1
     */
    size: number;

    /**
     * The root hash
     *
     * **Length:** 64
     */
    root_hash: string;

    /**
     * Consistency proof to verify that this root is a continuation of the previous one
     */
    consistency_proof: string[];

    /**
     * The name of the Merkle Tree
     */
    tree_name: string;

    /**
     * The transaction ID for the root, added by the UI
     * @hidden
     */
    transactionId?: string;
  }

  export type AuditRecords = AuditRecord[];

  export type LogRequest = AuditRecord;
  export interface LogResponse {
    loggedCount: number;
  }

  /**
   * The payload for a request to search for logs from Secure Audit Log. The data is to be used in making a Secure Audit Log request through your servers.
   */
  export interface SearchRequest<Event = DefaultEvent> {
    /** Search fields */

    /**
     * Natural search string; a space-separated list of case-sensitive values used to search for records, which includes the optional `<field>:` prefix to limit the search to a specific field. Values with a space can be enclosed in double-quote (`\"`) characters:\n\n * `\"search text\"`: any field contains \"search text\"\n * `actor:\"Jane Doe\"`: the actor field contains \"Jane Doe\"\n * `actor:alice target:bob sent`: actor contains \"alice\", target contains \"bob\", and any field contains \"sent\".\n\n The following optional prefixes are supported: `action:`, `actor:`,  `message:`, `new:`, `old:`, `source:`, `status:`, `target:`.
     */
    query: string;

    /**
     * The start of the time range to perform the search on. Defaults to 14 days of data.
     *
     * **Max Length:** 128
     */
    start?: string;

    /**
     * The end of the time range to perform the search on. All records up to the latest if left out.
     *
     * **Max Length:** 128
     */
    end?: string;

    /**
     * A list of keys to restrict the search results to. Useful for partitioning data available to the query string.
     */
    search_restriction?: Record<keyof Event, string[]>;

    /**
     * Name of column to sort the results by.
     */
    order_by?: string;

    /**
     * Specify the sort order of the response.
     *
     * **Possible values:** "asc" | "desc"
     */
    order?: string;

    /** Result fields */
    limit?: number;

    /** If true, include the root hash of the tree and the membership proof for each record. */
    verbose?: boolean;

    /** Maximum number of results to return.
     *
     * **Min Length:** 1
     * **Max Length:** 10,000
     */
    max_results?: number;

    /** Used to indicate if fpe_context should be returned back with logs */
    return_context?: boolean;
  }

  /**
   * The payload for a request for returning a subset of logs from a previous search from Secure Audit Log. The data is to be used in making a Secure Audit Log request through your servers.
   */
  export interface ResultRequest {
    /** FIXME: This field name is probably changing */
    /**
     * The ID of the request
     */
    id: string;

    /**
     * The number of records to offset the query by
     */
    offset?: number;

    /**
     * The number of records to return in each page of the request
     */
    limit?: number;

    /**
     * The maximum number of results to fetch in the request
     */
    max_results?: number;

    /** Used to indicate if fpe_context should be returned back with logs */
    return_context?: boolean;
  }

  /**
   * The payload for a request to download logs from Secure Audit Log. The data is to be used in making a Secure Audit Log request through your servers.
   */
  export interface DownloadResultRequest {
    /** FIXME: This field name is probably changing */
    /**
     * The ID associated with the Secure Audit Log search request results to be downloaded
     */
    result_id: string;

    /**
     * The format to download the data in
     */
    format: "csv" | "json";

    /** Used to indicate if fpe_context should be returned back with logs */
    return_context?: boolean;
  }

  /** The payload for a request to get a tree root */
  export interface RootRequest {
    /**
     * TODO
     */
    tree_size?: number;
  }

  /**
   * Describes the response structure for a search query
   */
  export interface SearchResponse {
    /**
     * The ID of the request
     */
    id: string;

    /**
     * The number of records returned
     */
    count: number;

    /**
     * The array of records
     */
    events: AuditRecord[];

    /**
     * TODO
     */
    expires_at: string;

    /**
     * TODO
     */
    root?: Root;

    /**
     * TODO
     */
    unpublished_root?: Root;
  }

  /**
   * Describes the response structure for paged results from a search query
   */
  export interface ResultResponse {
    /**
     * An array of records returned
     */
    events: AuditRecord[];

    /**
     * The number of records returned
     */
    count: number;

    /**
     * TODO
     */
    root?: Root;

    /**
     * TODO
     */
    unpublished_root?: Root;
  }

  /**
   * Describes the response structure returned from requesting a download of a log result
   */
  export interface DownloadResultResponse {
    /**
     * A pre-signed URL which the result can be downloaded
     */
    dest_url: string;
  }

  /**
   * The resonse of a merkle tree root request
   */
  export interface RootResponse {
    data: Root;
  }

  /**
   * @hidden
   */
  export enum SchemaFieldType {
    Boolean = "boolean",
    DateTime = "datetime",
    Integer = "integer",
    String = "string",
    NonIndexed = "string-unindexed",
  }

  export interface SchemaField {
    /** ^[a-z][a-z_]*$ */
    id: string;

    /** Safe */
    description?: string;
    name: string;

    ui_default_visible?: boolean;

    /** Breaking */
    required?: boolean;
    size?: number;
    type:
      | "boolean"
      | "datetime"
      | "integer"
      | "string"
      | "string-unindexed"
      | "text";

    redact?: boolean;
  }

  export interface Schema {
    client_signable?: boolean;
    tamper_proofing?: boolean;
    fields: SchemaField[];
  }
}

/**
 * Authentication configuration. It is used to fetch your project's custom Audit schema, so the AuditLogViewer component can dynamically update when you update your configuration in the Pangea Console
 */
export interface AuthConfig {
  /** The client token to use */
  clientToken: string;

  /** The api domain to point to */
  domain: string;

  /** The ID of the configuration to use */
  configId?: string;
}

/**
 * Modify the schema using these options
 */
export interface SchemaOptions {
  /** An array of field keys to hide */
  hiddenFields?: string[];
}
