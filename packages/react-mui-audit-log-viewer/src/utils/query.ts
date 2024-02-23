// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation
import { AuditQuery, FieldFilter } from "../types/query";

export const parseLexTokenError = (error: string) => {
  // "syntax error at ): LexToken(CPAREN,')',1,6)"
  if (typeof error !== "string") return undefined;

  const parts = error.split(": LexToken(");
  if (parts.length !== 2) return { message: `Bad format: ${error}` };

  const token = parts[1].split(",");
  if (token.length !== 4) return { message: `Bad format error` };

  try {
    const length = Number(token[3].replace(")", ""));
    const start = Number(token[2]);

    return {
      message: `Bad format error, at ${start}, unexcepted: ${token[1]}`,
      length,
      start,
    };
  } catch (err) {
    return undefined;
  }
};

export const getQuerySymbol = (operation: FieldFilter) => {
  if (operation === FieldFilter.LessThan) {
    return "<";
  }

  if (operation === FieldFilter.GreaterThan) {
    return ">";
  }

  return ":";
};

export const constructQueryString = (queryObj: AuditQuery | null): string => {
  if (queryObj) {
    const queryList: string[] = [];
    Object.keys(queryObj)
      .filter(
        (key: string) =>
          !!queryObj[key] &&
          !["since", "before", "after", "active"].includes(key)
      )
      // @ts-ignore
      .forEach((key) => {
        const value = queryObj[key];
        if (typeof value === "object") {
          queryList.push(
            `${key}${getQuerySymbol(value.operation)}${value.value}`
          );
        } else {
          queryList.push(`${key}:${queryObj[key]}`);
        }
      });

    return queryList.join(" AND ");
  }

  return "";
};

// FIXME: Currently only filtering by date. Need to support filtering by time.
const getDateString = (dateString: string): string => {
  try {
    return new Date(dateString).toISOString();
  } catch {
    return dateString;
  }
};

interface TimeFilter {
  end?: string;
  start?: string;
}

export const getTimeFilterKwargs = (
  queryObj: AuditQuery | null
): TimeFilter => {
  const timeFilter: TimeFilter = {};
  if (queryObj != null && queryObj?.active) {
    if (queryObj.active === "between") {
      if (!!queryObj.before) {
        timeFilter.end = getDateString(queryObj.before);
      }

      if (!!queryObj.after) {
        timeFilter.start = getDateString(queryObj.after);
      }
    } else if (queryObj.active === "since" && !!queryObj.since) {
      timeFilter.start = queryObj.since;
    } else if (queryObj.active === "before" && !!queryObj.before) {
      timeFilter.end = getDateString(queryObj.before);
    } else if (queryObj.active === "after" && !!queryObj.after) {
      timeFilter.start = getDateString(queryObj.after);
    }
  }

  return timeFilter;
};
