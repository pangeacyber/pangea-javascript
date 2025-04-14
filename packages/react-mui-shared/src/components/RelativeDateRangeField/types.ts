/**
 * A period of time.
 *
 * Regex: ^(\\d+)(d|da|day|days|h|hour|hr|hrs|hours|mi|min|mins|minute|minutes|mo|mon|month|months|s|sec|secs|second|seconds|w|week|weeks|y|year|years)$
 * Examples: "7d", "1day", "120min", "2months"
 */
export type TimeRangeString = string;

export enum RelativeRange {
  Year = "year",
  Month = "month",
  Week = "week",
  Day = "day",
  Hour = "hour",
  Minute = "minute",
  Second = "second",
}

export interface RelativeRangeObject {
  amount: number;
  span: string;
  relativeRange: RelativeRange;
  prefix: string;
}
