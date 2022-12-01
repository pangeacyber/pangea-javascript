// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

export namespace Audit {
  export interface Config {
    id: string;
    retention: string;
    hotstorage: string;
  }

  export interface Event {
    action?: string;
    actor?: string;
    message?: string;
    status?: string;
    source?: string;
    new?: string;
    old?: string;
    target?: string;

    // FIXME: This is part of Envelope
    received_at?: string;
  }

  export interface Envelope {
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
  }

  export interface FlattenedAuditRecord extends AuditRecord, Envelope, Event {
    // Added to the component for PangeaDataGrid
    id: number;
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
