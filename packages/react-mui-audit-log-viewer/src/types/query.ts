export enum FieldFilter {
  Equal = "eq",
  LessThan = "lt",
  GreaterThan = "gt",
}

export type AuditFieldFilter =
  | string
  | number
  | undefined
  | {
      value: string;
      operation: FieldFilter;
    };

export interface AuditQuery {
  after?: string;
  before?: string;
  since?: string;
  active?: "after" | "before" | "between" | "since";

  [key: string]: AuditFieldFilter;
}

export interface AfterRange {
  type: "after";
  after: string;
}

export interface BeforeRange {
  type: "before";
  before: string;
}

export interface BetweenRange {
  type: "between";
  after: string;
  before: string;
}

export interface SinceRange {
  type: "relative";
  since: string;
}

export type AuditQueryRange =
  | SinceRange
  | BetweenRange
  | BeforeRange
  | AfterRange;

export interface QueryObj {
  type: "object";

  [key: string]: AuditFieldFilter;
}

export interface QueryString {
  type: "string";
  value: string;
}

export interface PublicAuditQuery {
  range?: AuditQueryRange;
  query?: QueryObj | QueryString;
}

export interface Sort {
  order: string;
  order_by: string;
}
