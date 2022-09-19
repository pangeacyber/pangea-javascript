// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { useGridApiRef } from "@mui/x-data-grid";

export const usePagination = (
  pageSizeProp: number | undefined,
  paginationCurrentPage: number | undefined
): {
  page: number;
  pageSize: number;
  totalPages: number;
  goToPage: (page: number) => void;
  hasPrevious: boolean;
  hasNext: boolean;
} => {
  const apiRef = useGridApiRef();
  const page = paginationCurrentPage ?? 0;
  const pageSize = pageSizeProp ?? 1;

  const getRowsCount = apiRef.current?.getRowsCount || (() => 0);

  const totalPages = Math.ceil(getRowsCount() / pageSize);

  const goToPage = (page: number) => {
    if (apiRef.current) {
      apiRef.current.setPage(page);
    }
  };

  const hasPrevious = pageSize > 1;
  const hasNext = pageSize < totalPages;

  return {
    page,
    pageSize,
    totalPages,
    goToPage,
    hasPrevious,
    hasNext,
  };
};

export const useTotalPages = (rowCount: number, pageSize: number) => {
  return Math.max(Math.ceil(rowCount / pageSize), 1);
};
