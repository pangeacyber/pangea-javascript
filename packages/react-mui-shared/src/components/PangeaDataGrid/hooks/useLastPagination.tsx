// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation
import mapKeys from "lodash/mapKeys";
import mapValues from "lodash/mapValues";
import pickBy from "lodash/pickBy";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

import { useEffect, useState } from "react";

type TrackedPages = Record<
  string,
  {
    last: string | undefined;
  }
>;

export const useLastPagination = () => {
  const [last, setLast] = useState<string | undefined>();
  const [current, setCurrentLast] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [trackedPages, setTrackedPages] = useState<TrackedPages>({
    [page]: {
      last: undefined,
    },
  });

  const lastKnownPage = Math.max(
    ...Object.keys(trackedPages).map((k) => Number(k))
  );

  useEffect(() => {
    if (current) {
      setTrackedPages((state) => ({
        ...state,
        [page + 1]: {
          last: current,
        },
      }));
    }
  }, [current, page]);

  useEffect(() => {
    if (trackedPages[page]) {
      setLast(trackedPages[page].last);
    } else {
      setPage(1);
    }
  }, [page]);

  return {
    last,
    page,
    setPage,
    lastKnownPage,
    setCurrentLast,
  };
};
