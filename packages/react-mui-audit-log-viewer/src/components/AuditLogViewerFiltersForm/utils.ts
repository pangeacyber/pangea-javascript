import { AuditFieldFilter } from "./FilterField";

export const getAppliedFiltersQuery = (
  query: string,
  filters: AuditFieldFilter[]
): string => {
  if (!filters.length) return query;

  const formattedFilters = filters
    .filter((filter) => !!filter.id && !!filter.operator && !!filter.value)
    .map((filter) => `${filter.id}${filter.operator}${filter.value}`)
    .join(" OR ");
  const filterString =
    filters.length > 1 ? `(${formattedFilters})` : formattedFilters;

  // Ensure proper spacing and conjunction handling
  query = query.trim();
  if (query && !/\b(AND|OR)\s*$/i.test(query)) {
    query += " AND";
  }

  return query ? `${query} ${filterString}` : filterString;
};
