import { AuditFieldFilter } from "./FilterField";

export const getAppliedFiltersQuery = (
  query: string,
  filters: AuditFieldFilter[],
  operand: string = "OR"
): string => {
  const validFilters = filters.filter(
    (filter) => !!filter.id && !!filter.operator && !!filter.value
  );

  if (!validFilters.length) return query;

  const formattedFilters = validFilters
    .map((filter) => `${filter.id}${filter.operator}${filter.value}`)
    .join(` ${operand} `);
  const filterString =
    validFilters.length > 1 ? `(${formattedFilters})` : formattedFilters;

  // Ensure proper spacing and conjunction handling
  query = query.trim();
  if (query && !/\b(AND|OR)\s*$/i.test(query)) {
    query += " AND";
  }

  return query ? `${query} ${filterString}` : filterString;
};
