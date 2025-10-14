import { useMemo, useState, useEffect } from "react";
import merge from "lodash/merge";
import pick from "lodash/pick";
import map from "lodash/map";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";
import find from "lodash/find";
import some from "lodash/some";

import {
  Audit,
  AuthConfig,
  FieldFilterOptions,
  FilterOptions,
  SchemaOptions,
} from "../types";
import { GridColDef } from "@mui/x-data-grid";
import {
  AutocompleteValueOption,
  ConditionalOption,
  FilterOptions as FilterComponentOptions,
  PDG,
  useGridSchemaColumns,
} from "@pangeacyber/react-mui-shared";
import { AuditErrorsColumn } from "../components/AuditLogViewerComponent/errorColumn";
import DateTimeFilterCell from "../components/AuditLogViewerComponent/DateTimeFilterCell";
import { StringCell } from "../components/AuditLogViewerComponent/StringCell";
import { Box, IconButton, Typography } from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

export const DEFAULT_AUDIT_SCHEMA: Audit.Schema = {
  client_signable: true,
  tamper_proofing: true,
  fields: [
    {
      id: "received_at",
      name: "Time",
      type: "datetime",
      ui_default_visible: true,
    },
    {
      id: "timestamp",
      name: "Timestamp",
      type: "datetime",
    },
    {
      id: "actor",
      name: "Actor",
      type: "string",
      size: 32766,
    },
    {
      id: "action",
      name: "Action",
      type: "string",
      size: 32766,
    },
    {
      id: "status",
      name: "Status",
      type: "string",
      size: 32766,
    },
    {
      id: "target",
      name: "Target",
      type: "string",
      size: 32766,
    },
    {
      id: "source",
      name: "Source",
      type: "string",
      size: 32766,
    },
    {
      id: "tenant_id",
      name: "Tenant ID",
      type: "string",
      size: 32766,
    },
    {
      id: "old",
      name: "Old",
      type: "string",
      size: 32766,
    },
    {
      id: "new",
      name: "New",
      type: "string",
      size: 32766,
    },
    {
      id: "message",
      name: "Message",
      type: "string",
      size: 32766,
      ui_default_visible: true,
    },
  ],
};

export const useSchema = (
  auth: AuthConfig | undefined,
  schemaProp: Audit.Schema | undefined,
  options: SchemaOptions | undefined = undefined
): {
  schema: Audit.Schema;
  loading: boolean;
  error: string | null;
} => {
  const [schema_, setSchema_] = useState<Audit.Schema>(DEFAULT_AUDIT_SCHEMA);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth || !!schemaProp) return;
    if (!auth?.clientToken || !auth?.domain) {
      setError(
        "Invalid authentication. Both clientToken and domain are required."
      );
      return;
    }

    setLoading(true);
    fetch(`https://audit.${auth.domain}/v1/schema`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.clientToken}`,
      },
      body: JSON.stringify({
        ...(!!auth.configId && {
          config_id: auth.configId,
        }),
      }),
    }).then(async (res) => {
      const data = await res.json();
      if (data.result && Array.isArray(data.result?.fields)) {
        setSchema_({
          ...data.result,
          fields: [
            {
              id: "received_at",
              name: "Time",
              type: "datetime",
              ui_default_visible: true,
            },
            ...data.result.fields,
          ],
        });
        setError(null);
      } else
        setError(data.summary ?? "Unable to retrieve branding configuration");

      setLoading(false);
      return;
    });
  }, [auth?.clientToken, auth?.domain]);

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  const schema = useMemo(() => {
    const schema = cloneDeep(schemaProp ?? schema_);
    schema.fields = schema.fields?.filter(
      (f: Audit.SchemaField) =>
        !options?.hiddenFields?.length || !options?.hiddenFields?.includes(f.id)
    );

    return schema;
  }, [schemaProp, schema_, options]);

  return { schema, loading, error };
};

const COLUMN_TYPE_MAP = {
  [Audit.SchemaFieldType.DateTime]: "stringDateTime",
};

const CUSTOM_CELLS = {
  [Audit.SchemaFieldType.DateTime]: DateTimeFilterCell,
  [Audit.SchemaFieldType.String]: StringCell,
};

export const useAuditColumns = <Event,>(
  schema: Audit.Schema,
  fields: Partial<Record<keyof Event, Partial<GridColDef>>> | undefined,
  fieldTypes:
    | Partial<Record<keyof typeof Audit.SchemaFieldType, Partial<GridColDef>>>
    | undefined,

  onFilterOpen?: (field: string, event: React.MouseEvent) => void,
  getFilterRef?: (field: string) => React.RefCallback<HTMLDivElement>
) => {
  const gridFields: PDG.GridSchemaFields<Event> = useMemo(() => {
    const schemaFields = cloneDeep(schema?.fields ?? []);

    // @ts-ignore
    const defaultColumnDefinitions: PDG.GridSchemaFields<Event> = mapValues(
      keyBy(schemaFields, "id"),
      (field: Audit.SchemaField) => {
        const isLarge =
          (field.type === "string" ||
            field.type === "string-unindexed" ||
            field.type === "text") &&
          (field.size ?? 0) > 128;

        let fieldTypeColumnOverrides: Partial<GridColDef> = {};
        if (!!fieldTypes && !!field.type) {
          const idx = Object.values(Audit.SchemaFieldType).indexOf(
            field.type as Audit.SchemaFieldType
          );
          if (idx >= 0) {
            const fieldTypeKey = Object.keys(Audit.SchemaFieldType)[idx];
            fieldTypeColumnOverrides = {
              ...fieldTypes[fieldTypeKey as keyof typeof Audit.SchemaFieldType],
            };
          }
        }

        const column: Partial<PDG.GridField> = {
          label: field.name ?? field.id,
          description: `Field: ${field.id}${
            !!field.description ? ". " + field.description : ""
          }`,
          // @ts-ignore
          type: get(COLUMN_TYPE_MAP, field.type, "string"),

          sortable: field.type !== "string-unindexed", // FIXME: What fields exactly should be sortable

          ...(!!onFilterOpen &&
            !!getFilterRef &&
            field.type !== "string-unindexed" && {
              renderHeader: (params: any) => (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  ref={getFilterRef(field.id)}
                >
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {params.colDef.headerName ?? params.field}
                  </Typography>
                  <IconButton
                    className="AuditLogViewer-FilterButton"
                    onClick={(event) => {
                      onFilterOpen(field.id, event);
                      event.stopPropagation(); // prevent sort toggle
                    }}
                    size="small"
                    sx={{}}
                  >
                    <FilterAltOutlinedIcon color="action" fontSize="small" />
                  </IconButton>
                </Box>
              ),
            }),

          width: 150,
          ...(field.type === "datetime" && {
            width: 194,
          }),
          ...(isLarge
            ? {
                flex: 1,
                minWidth: 200,
              }
            : {}),
          renderCell: get(CUSTOM_CELLS, field.type, undefined),
          ...fieldTypeColumnOverrides,
        };

        return column;
      }
    );

    return merge(
      defaultColumnDefinitions,
      pick(
        fields ?? {},
        map(schemaFields, (f: Audit.SchemaField) => f.id)
      )
    );
  }, [fields, fieldTypes, schema]);

  const columns = useGridSchemaColumns(gridFields);
  return columns;
};

export const useAuditColumnsWithErrors = <Event,>(
  schemaColumns: GridColDef[],
  logs: Audit.FlattenedAuditRecord<Event>[]
) => {
  const hasErrors = some(logs, "err");
  const columns = useMemo(() => {
    if (hasErrors) {
      return [AuditErrorsColumn, ...schemaColumns];
    }

    return schemaColumns;
  }, [hasErrors, schemaColumns]);

  return columns;
};

export const useDefaultVisibility = <Event,>(schema: Audit.Schema) => {
  const visibility = useMemo(() => {
    const schemaFields = schema?.fields ?? [];

    return mapValues(
      keyBy(schemaFields, "id"),
      (field: Audit.SchemaField) => !!field.ui_default_visible
    );
  }, [schema]);

  return visibility;
};

export const useDefaultOrder = <Event,>(schema: Audit.Schema) => {
  const order = useMemo(() => {
    const schemaFields = schema?.fields ?? [];

    return map(schemaFields, (field: Audit.SchemaField) => field.id);
  }, [schema]);

  return order;
};

export const useAuditFilterFields = <Event,>(
  schema: Audit.Schema,
  options: FilterOptions | undefined = undefined
) => {
  const fields: FilterComponentOptions<Event> = useMemo(() => {
    const filterableFields = (schema?.fields ?? []).filter(
      (field) =>
        field.type !== "string-unindexed" &&
        (!options?.filterableFields ||
          options?.filterableFields?.includes(field.id))
    );

    // @ts-ignore
    const fields: FilterComponentOptions<Event> = mapValues(
      keyBy(filterableFields, "id"),
      (field: Audit.SchemaField) => {
        return {
          label: field.name ?? field.id,
          valueOptions: find(options?.fieldOptions, (fo) => fo.id === field.id)
            ?.valueOptions,
        };
      }
    );

    return fields;
  }, [schema, options?.filterableFields]);

  return fields;
};

const operators = new Set(["AND", "OR"]);
const fieldOperatorsList = [":", "=", ">", "<"];
const fieldOperators = new Set(fieldOperatorsList);

const getFieldsOperationOptions = (fields: Audit.SchemaField[]) => {
  const options: AutocompleteValueOption[] = [];

  fields.forEach((field) => {
    if (field.type === "boolean") {
      options.push({
        value: `${field.id}=`,
        label: `${field.name ?? field.id}`,
        caption: "is",
      });
    } else if (field.type === "integer" || field.type === "datetime") {
      options.push({
        value: `${field.id}=`,
        label: `${field.name ?? field.id}`,
        caption: "is",
      });
      options.push({
        value: `${field.id}<`,
        label: `${field.name ?? field.id}`,
        caption: "less than",
      });
      options.push({
        value: `${field.id}>`,
        label: `${field.name ?? field.id}`,
        caption: "greater than",
      });
    } else {
      options.push({
        value: `${field.id}=`,
        label: `${field.name ?? field.id}`,
        caption: "is",
      });

      options.push({
        value: `${field.id}:`,
        label: `${field.name ?? field.id}`,
        caption: "contains",
      });
    }
  });

  return options;
};

export const getFieldValueOptions = (
  field: Audit.SchemaField,
  options: FieldFilterOptions | undefined,

  knownLogs: Audit.FlattenedAuditRecord<any>[] | undefined = undefined
) => {
  if (options?.valueOptions) {
    return options.valueOptions;
  }

  if (field.type === "boolean") {
    return [
      {
        label: "True",
        value: "true",
      },
      {
        label: "False",
        value: "false",
      },
    ] as AutocompleteValueOption[];
  }

  if (field.type === "datetime") {
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);

    const anHourAgo = new Date(today.getTime() - 60 * 60 * 1000);

    return [
      {
        label: "Today",
        value: `"${today.toISOString().split("T")[0]}"`,
        caption: today.toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: undefined,
          minute: undefined,
          second: undefined,
        }),
      },
      {
        label: "Current time",
        value: `"${today.toISOString()}"`,
        caption: today.toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
      {
        label: "An hour ago",
        value: `"${anHourAgo.toISOString()}"`,
        caption: anHourAgo.toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      },
      {
        label: "Yesterday",
        value: `"${yesterday.toISOString().split("T")[0]}"`,
        caption: yesterday.toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: undefined,
          minute: undefined,
          second: undefined,
        }),
      },
    ] as AutocompleteValueOption[];
  }

  const seen = new Set<string>();
  for (const log of knownLogs ?? []) {
    // @ts-ignore
    const val = log[field.id];
    if (typeof val === "string" && val.length <= 64) {
      seen.add(val);
    }
  }

  return Array.from(seen).map((value) => ({
    value: value.includes(" ") ? `"${value}"` : value,
    label: value.includes(" ") ? `"${value}"` : value,
  })) as AutocompleteValueOption[];
};

const getFieldsConditionalOptions = (
  fields: Audit.SchemaField[],
  filterOptions: FieldFilterOptions[]
) => {
  const options: ConditionalOption[] = [];

  fields.forEach((field) => {
    const fieldFilterOptions = find(filterOptions, (fo) => fo.id === field.id);
    const valueOptions = getFieldValueOptions(field, fieldFilterOptions);

    if (!valueOptions?.length) {
      return; // continue, no value options for field
    }

    fieldOperators.forEach((operator) => {
      options.push({
        match: (current: string, previous: string) => {
          return (
            (!previous || operators.has(previous)) &&
            current?.startsWith(`${field.id}${operator}`)
          );
        },
        options: valueOptions?.map((vo) => ({
          ...vo,
          value: `${field.id}${operator}${vo.value} `,
        })),
      });
    });
  });

  return options;
};

export const useAuditConditionalOptions = <Event,>(
  schema: Audit.Schema,
  options: FilterOptions | undefined = undefined
) => {
  const autocomplete = useMemo(() => {
    const optionalFields = (schema?.fields ?? []).filter(
      (field) =>
        field.type !== "string-unindexed" &&
        (!options?.filterableFields ||
          options?.filterableFields?.includes(field.id))
    );

    return [
      {
        match: (current: string, previous: string) => {
          return (
            (!previous || operators.has(previous)) &&
            !some(fieldOperatorsList, (v: string) => current.includes(v))
          );
        },
        options: getFieldsOperationOptions(optionalFields),
      },
      ...getFieldsConditionalOptions(
        optionalFields,
        options?.fieldOptions ?? []
      ),
      {
        match: (current: string, previous: string) =>
          !operators.has(previous) && !current.includes(":"),
        options: [
          { value: "AND ", label: "AND" },
          { value: "OR ", label: "OR" },
        ],
      },
    ];
  }, [schema, options?.fieldOptions]);

  return autocomplete;
};
