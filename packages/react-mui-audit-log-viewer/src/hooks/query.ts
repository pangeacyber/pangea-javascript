import { useEffect, useMemo, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { AuditQuery, PublicAuditQuery } from "../types/query";
import { parseLexTokenError } from "../utils/query";

export const useAuditQueryState = (
  initialQuery: string | undefined,
  publicQueryObj: PublicAuditQuery | undefined
) => {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [queryObj, setQueryObj] = useState<AuditQuery | null>(
    !!publicQueryObj
      ? {} // Default to empty object since public user facing query obj is structured differently
      : {
          since: "7day",
          active: "since",
        }
  );

  useEffect(() => {
    if (initialQuery !== undefined) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (!publicQueryObj?.range && !publicQueryObj?.query) {
      if (isEmpty(queryObj))
        setQueryObj({
          since: "7day",
          active: "since",
        });
      return;
    }

    const { range, query } = publicQueryObj;

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
  }, [JSON.stringify(publicQueryObj)]);

  return {
    query,
    setQuery,
    queryObj,
    setQueryObj,
  };
};

export const useAuditSearchError = (
  error: any
):
  | undefined
  | {
      message: string;
      start?: number;
      length?: number;
    } => {
  const err = useMemo(() => {
    if (!error) return undefined;

    const response = error?.response ?? {};
    let searchError = {
      message: `${response?.data?.summary ?? error}`,
    };

    if (
      response?.data?.status === "ValidationError" &&
      response?.data?.result?.errors
    ) {
      (response?.data?.result?.errors ?? []).forEach((err: any) => {
        if (err.code === "BadFormat") {
          const lexError = parseLexTokenError(err.detail);
          if (lexError) {
            searchError = lexError;
          }
        }
      });
    }

    return searchError;
  }, [error]);

  return err;
};
