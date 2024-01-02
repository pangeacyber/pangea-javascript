import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";
import pickBy from "lodash/pickBy";
import mapValues from "lodash/mapValues";
import mapKeys from "lodash/mapKeys";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { useLastPagination } from "./useLastPagination";

export interface PangeaListOrderRequest {
  order?: string;
  order_by?: string;
}

export interface PangeaListRequest<Filter = any>
  extends PangeaListOrderRequest {
  filter?: Filter;

  last?: string;
  limit?: number;
}

interface FilterObj {
  [key: string]: any;
}

export const getListRequestFilter = (
  filters: Record<string, any>,
  fieldKeyMap: Record<
    string,
    {
      ignoreFalsy?: boolean;
      key: string;
    }
  > = {}
): Record<string, any> | undefined => {
  const filter = mapValues(
    mapKeys(
      pickBy(filters, (v, k) => {
        const k_ = get(fieldKeyMap, k);
        if (k_ && k_.ignoreFalsy === true) return true;
        return !!v;
      }),
      (v, k) => {
        const k_ = get(fieldKeyMap, k);
        if (k_) return k_.key;

        if (typeof v === "string" && !k.endsWith("__contains")) {
          return `${k}__contains`;
        }

        return k;
      }
    ),
    (v, k) => {
      if (k.endsWith("__contains")) {
        return [v];
      }

      return v;
    }
  );

  if (isEmpty(filter)) return undefined;

  return filter;
};

interface ListRequestDefaults<Filter = any> {
  defaultFilter?: Filter;
  defaultSort?: "asc" | "desc";
  defaultSortBy?: string;
}

export interface PangeaListRequestProps<Filter = any> {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;

  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;

  last: string | undefined;
  setCurrentLast: Dispatch<SetStateAction<string | undefined>>;
  lastKnownPage: number;

  sorting: PangeaListOrderRequest;
  setSorting: Dispatch<SetStateAction<PangeaListOrderRequest>>;

  filters: Filter;
  setFilters: Dispatch<SetStateAction<Filter>>;

  body: PangeaListRequest;
}

export const usePangeaListRequest = <Filter extends FilterObj = FilterObj>(
  request?: ListRequestDefaults,
  fieldKeyMap: Record<
    string,
    {
      key: string;
      ignoreFalsy?: boolean;
    }
  > = {}
): PangeaListRequestProps => {
  const { defaultFilter, defaultSort, defaultSortBy } = request ?? {};
  const [pageSize, setPageSize] = useState(20);

  const { page, setPage, last, lastKnownPage, setCurrentLast } =
    useLastPagination();

  const [sorting, setSorting] = useState<PangeaListOrderRequest>({});

  // @ts-ignore
  const [filters, setFilters] = useState<Filter>(defaultFilter ?? {});

  useEffect(() => {
    if (defaultFilter) setFilters(defaultFilter);
  }, [defaultFilter]);

  useEffect(() => {
    if (defaultSort && defaultSortBy)
      setSorting({ order: defaultSort, order_by: defaultSortBy });
  }, [defaultSort, defaultSortBy]);

  const body = useMemo<PangeaListRequest>(() => {
    return pickBy(
      {
        filter: getListRequestFilter(filters, fieldKeyMap),
        last,
        size: pageSize,
        ...sorting,
      },
      (v) => v !== undefined
    );
  }, [pageSize, sorting, filters, last]);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,

    last,
    lastKnownPage,
    setCurrentLast,

    sorting,
    setSorting,

    filters,
    setFilters,

    body,
  };
};
