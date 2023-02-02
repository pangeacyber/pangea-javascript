// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { useState, useMemo, useEffect } from "react";
import { Audit } from "../types";

export interface AuditQuery {
  after?: string;
  before?: string;
  since?: string;
  active?: "after" | "before" | "between" | "since";

  actor?: string;
  action?: string;
  message?: string;
  new?: string;
  old?: string;
  status?: string;
  target?: string;
}

export interface Sort {
  order: string;
  order_by: string;
}

const constructQueryString = (queryObj: AuditQuery | null): string => {
  if (queryObj) {
    const queryList: string[] = [];
    Object.keys(queryObj)
      .filter(
        // @ts-ignore
        (key: keyof AuditQuery) =>
          !!queryObj[key] &&
          !["since", "before", "after", "active"].includes(key)
      )
      // @ts-ignore
      .forEach((key: keyof AuditQuery) => {
        queryList.push(`${key}:${queryObj[key]}`);
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

const getTimeFilterKwargs = (queryObj: AuditQuery | null): TimeFilter => {
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

interface UseAuditQuery {
  body: Audit.SearchRequest;
  query: string;
  queryObj: AuditQuery | null;
  setQuery: (query: string) => void;
  setQueryObj: (queryObj: AuditQuery) => void;
  sort?: Sort;
  setSort: (sort?: Sort) => void;
}

export const useAuditQuery = (limit: number): UseAuditQuery => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>();
  const [queryObj, setQueryObj] = useState<AuditQuery | null>({
    since: "7d",
    active: "since",
  });

  const body = useMemo<Audit.SearchRequest>(() => {
    return {
      query: query,
      ...getTimeFilterKwargs(queryObj),
      ...(sort ?? {}),
      limit,
      verbose: true,
    };
  }, [query, queryObj, sort]);

  useEffect(() => {
    const queryString = constructQueryString(queryObj);
    if (queryString) setQuery(queryString);
  }, [queryObj]);

  return { body, query, queryObj, setQuery, setQueryObj, sort, setSort };
};
