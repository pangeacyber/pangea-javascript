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

/**
 * @hidden
 */
export interface AuditQuery {
  after?: string;
  before?: string;
  since?: string;
  active?: "after" | "before" | "between" | "since";

  [key: string]: AuditFieldFilter;
}

/**
 * Query logs from after a specific date/time
 */
export interface AfterRange {
  type: "after";

  /**
   * The string date to filter by (Simplified ISO 8601 date)
   */
  after: string;
}

/**
 * Query logs from before a specific date/time
 */
export interface BeforeRange {
  type: "before";

  /**
   * The string date to filter by (Simplified ISO 8601 date)
   */
  before: string;
}

/**
 * Query logs between two date/times
 */
export interface BetweenRange {
  type: "between";

  /**
   * The after string date to filter by (Simplified ISO 8601 date)
   */
  after: string;

  /**
   * The before string date to filter by (Simplified ISO 8601 date)
   */
  before: string;
}

/**
 * Query logs since a specific date/time
 */
export interface SinceRange {
  type: "relative";

  /**
   * The string date to filter by (Simplified ISO 8601 date)
   */
  since: string;
}

/**
 * Defines the range of time to query by
 */
export type AuditQueryRange =
  | SinceRange
  | BetweenRange
  | BeforeRange
  | AfterRange;

/**
 * Describes an object to query by
 */
export interface QueryObj {
  type: "object";

  /**
   * Filter results by assigning filters to the properties you want to query by
   */
  [key: string]: AuditFieldFilter;
}

/**
 * Describes a string to query by
 */
export interface QueryString {
  type: "string";

  /**
   * The string value to query by
   */
  value: string;
}

/**
 * Describes a range and parameters for a query to be passed to the AuditLogViewer
 */
export interface PublicAuditQuery {
  /**
   * The range or time frame to search by
   */
  range?: AuditQueryRange;

  /**
   * The filters and parameters to query data by
   */
  query?: QueryObj | QueryString;
}

/**
 * @hidden
 */
export interface Sort {
  order: string;
  order_by: string;
}
