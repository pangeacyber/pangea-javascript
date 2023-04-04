// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation
import isEmpty from "lodash/isEmpty";
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

interface AfterRange {
  type: "after";
  after: string;
}

interface BeforeRange {
  type: "before";
  before: string;
}

interface BetweenRange {
  type: "between";
  after: string;
  before: string;
}

interface SinceRange {
  type: "relative";
  since: string;
}

type AuditQueryRange = SinceRange | BetweenRange | BeforeRange | AfterRange;

interface QueryObj {
  type: "object";
  actor?: string;
  action?: string;
  message?: string;
  new?: string;
  old?: string;
  status?: string;
  target?: string;
}

interface QueryString {
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
  body: Audit.SearchRequest | null;
  query: string;
  queryObj: AuditQuery | null;
  setQuery: (query: string) => void;
  setQueryObj: (queryObj: AuditQuery) => void;
  sort?: Sort;
  setSort: (sort?: Sort) => void;
}

export const useAuditQuery = (
  limit: number,
  maxResults: number,
  auditQuery: PublicAuditQuery | undefined = undefined,
  initialQuery: string | undefined = undefined
): UseAuditQuery => {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<Sort>();
  const [queryObj, setQueryObj] = useState<AuditQuery | null>(
    !!auditQuery
      ? {}
      : {
          since: "7day",
          active: "since",
        }
  );

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (!auditQuery?.range && !auditQuery?.query) {
      if (isEmpty(queryObj))
        setQueryObj({
          since: "7day",
          active: "since",
        });
      return;
    }

    const { range, query } = auditQuery;

    // Handle optional query param in filters
    const { type: queryType, ...newQueryObj_ } = query ?? {};
    let newQueryObj = {};
    if (queryType === "object") {
      newQueryObj = newQueryObj_;
    }

    // Handle optional range param in filters
    const { type, ...timeFields } = range ?? {};
    const active =
      type === "relative" ? "since" : type ?? queryObj?.active ?? "since";

    const newQuery = {
      since: "7day",
      ...newQueryObj,
      ...timeFields,
      active,
    };

    setQueryObj(newQuery);

    if (query?.type === "string") {
      setQuery(query.value);
    }
  }, [JSON.stringify(auditQuery)]);

  const body = useMemo<Audit.SearchRequest | null>(() => {
    if (isEmpty(queryObj)) return null;
    return {
      query: query,
      ...getTimeFilterKwargs(queryObj),
      ...(sort ?? {}),
      limit,
      max_results: maxResults,
      verbose: true,
    };
  }, [query, queryObj, sort, maxResults]);

  useEffect(() => {
    const queryString = constructQueryString(queryObj);
    if (queryString) setQuery(queryString);
  }, [queryObj]);

  return { body, query, queryObj, setQuery, setQueryObj, sort, setSort };
};
