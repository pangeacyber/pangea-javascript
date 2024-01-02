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

  export interface DefaultEvent {
    action?: string;
    actor?: string;
    message?: string;
    status?: string;
    source?: string;
    new?: string;
    old?: string;
    target?: string;
    timestamp?: string;
    tenant_id?: string;

    // FIXME: This is part of Envelope
    received_at?: string;

    // Internal Field
    err?: string;
  }

  export interface Envelope<Event = DefaultEvent> {
    event: Event;
    received_at?: string;
    public_key?: string;
    signature?: string;
  }

  export interface AuditRecord {
    envelope: Envelope;
    leaf_index?: string;
    membership_proof?: string;
    hash?: string;
    published?: boolean;

    // Only present in logs if record is signed by Vault
    valid_signature?: boolean;
  }

  export interface FlattenedAuditRecord<Event = DefaultEvent>
    extends AuditRecord,
      Envelope {
    id: number;

    // Internal Field
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

  export interface Root {
    url?: string;
    published_at?: string;
    size: number;
    root_hash: string;
    consistency_proof: string[];
    tree_name: string;
    // Added by the UI.
    transactionId?: string;
  }

  export type AuditRecords = AuditRecord[];

  export type LogRequest = AuditRecord;
  export interface LogResponse {
    loggedCount: number;
  }

  export interface SearchRequest<Event = DefaultEvent> {
    // Search fields
    query: string;
    start?: string;
    end?: string;
    search_restriction?: Record<keyof Event, string[]>;
    order_by?: string;
    order?: string;
    // Result fields
    limit?: number;
    // Optional include params
    verbose?: boolean;

    max_results?: number;
  }

  export interface ResultRequest {
    id: string; // FIXME: This field name is probably changing
    offset?: number;
    limit?: number;
    max_results?: number;
  }

  export interface RootRequest {
    tree_size?: number;
  }

  export interface SearchResponse {
    id: string;
    count: number;
    events: AuditRecord[];
    expires_at: string;
    root?: Root;
    unpublished_root?: Root;
  }

  export interface ResultResponse {
    events: AuditRecord[];
    count: number;
    root?: Root;
    unpublished_root?: Root;
  }

  export interface RootResponse extends Root {}

  export enum SchemaFieldType {
    Boolean = "boolean",
    DateTime = "datetime",
    Integer = "integer",
    String = "string",
    NonIndexed = "string-unindexed",
  }

  export interface SchemaField {
    id: string; // ^[a-z][a-z_]*$

    // Safe
    description?: string;
    name: string;

    ui_default_visible?: boolean;

    // Breaking
    required?: boolean;
    size?: number;
    type: "boolean" | "datetime" | "integer" | "string" | "string-unindexed";

    redact?: boolean;
  }

  export interface Schema {
    client_signable?: boolean;
    tamper_proofing?: boolean;
    fields: SchemaField[];
  }
}

export interface AuthConfig {
  clientToken: string;
  domain: string;
  configId?: string;
}
