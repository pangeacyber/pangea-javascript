// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

export namespace Audit {
  export interface Config {
    id: string;
    retention: string;
    redact_service_config_id: string;
    hotstorage: string;
  }

  export interface AuditRecord {
    // Only used in the model data grid
    id: number;
    actor: string;
    action: string;
    message: string;
    new: string;
    old: string;
    status: string;
    target: string;
    received_at?: string;
    source: string;
    leaf_index?: string;
    membership_proof?: string;
    public_key?: string;
    signature?: string;
    envelope?: any;
    hash?: string;
  }

  export interface VerificationArtifact {
    envelope: {
      event?: {
        action?: string;
        actor?: string;
        message?: string;
        status?: string;
        source?: string;
        new?: string;
        old?: string;
      };
      received_at?: string;
      public_key?: string;
      signature?: string;
    };
    hash?: string;
    leaf_index?: string;
    root?: Root;
  }

  export interface Root {
    url: string;
    published_at: string;
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

  export interface SearchRequest {
    // Search fields
    query: string;
    start?: string;
    end?: string;
    search_restriction?: {
      sources?: string[];
      actor?: string[];
      target?: string[];
    };
    order_by?: string;
    order?: string;
    // Result fields
    limit?: number;
    // Optional include params
    include_membership_proof?: boolean;
    include_root?: boolean;
    include_hash?: boolean;
  }

  export interface ResultRequest {
    id: string; // FIXME: This field name is probably changing
    offset?: number;
    limit?: number;

    // Optional include params
    include_membership_proof?: boolean;
    include_root?: boolean;
    include_hash?: boolean;
  }

  export interface RootRequest {
    tree_size?: number;
  }

  export interface SearchResponse {
    id: string;
    count: number;
    events: AuditRecord[];
    expires_at: string;
    root: Root;
  }

  export interface ResultResponse {
    events: AuditRecord[];
    count: number;
    root: Root;
  }

  export interface RootResponse extends Root {}
}
