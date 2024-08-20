import { useMemo, useState, useEffect } from "react";
import merge from "lodash/merge";
import pick from "lodash/pick";
import map from "lodash/map";
import get from "lodash/get";
import some from "lodash/some";
import cloneDeep from "lodash/cloneDeep";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";

import { Audit, AuthConfig, SchemaOptions } from "../types";
import { GridColDef } from "@mui/x-data-grid";
import {
  FilterOptions,
  PDG,
  useGridSchemaColumns,
} from "@pangeacyber/react-mui-shared";
import { AuditErrorsColumn } from "../components/AuditLogViewerComponent/errorColumn";
import DateTimeFilterCell from "../components/AuditLogViewerComponent/DateTimeFilterCell";
import { StringCell } from "../components/AuditLogViewerComponent/StringCell";

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
      (f) =>
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
  fields: Partial<Record<keyof Event, Partial<GridColDef>>> | undefined
) => {
  const gridFields: PDG.GridSchemaFields<Event> = useMemo(() => {
    const schemaFields = cloneDeep(schema?.fields ?? []);

    // @ts-ignore
    const defaultColumnDefinitions: PDG.GridSchemaFields<Event> = mapValues(
      keyBy(schemaFields, "id"),
      (field) => {
        const isLarge =
          (field.type === "string" ||
            field.type === "string-unindexed" ||
            field.type === "text") &&
          (field.size ?? 0) > 128;
        const column: Partial<PDG.GridField> = {
          label: field.name ?? field.id,
          description: `Field: ${field.id}${
            !!field.description ? ". " + field.description : ""
          }`,
          type: get(COLUMN_TYPE_MAP, field.type, "string"),
          sortable: field.type !== "string-unindexed", // FIXME: What fields exactly should be sortable
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
        };

        return column;
      }
    );

    return merge(
      defaultColumnDefinitions,
      pick(
        fields ?? {},
        map(schemaFields, (f) => f.id)
      )
    );
  }, [fields, schema]);

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
      (field) => !!field.ui_default_visible
    );
  }, [schema]);

  return visibility;
};

export const useDefaultOrder = <Event,>(schema: Audit.Schema) => {
  const order = useMemo(() => {
    const schemaFields = schema?.fields ?? [];

    return map(schemaFields, (field) => field.id);
  }, [schema]);

  return order;
};

export const useAuditFilterFields = <Event,>(schema: Audit.Schema) => {
  const fields: FilterOptions<Event> = useMemo(() => {
    const filterableFields = (schema?.fields ?? []).filter(
      (field) => field.type !== "string-unindexed"
    );

    // @ts-ignore
    const fields: FilterOptions<Event> = mapValues(
      keyBy(filterableFields, "id"),
      (field) => {
        return {
          label: field.name ?? field.id,
        };
      }
    );

    return fields;
  }, [schema]);

  return fields;
};

const operators = new Set(["AND", "OR"]);

export const useAuditConditionalOptions = <Event,>(schema: Audit.Schema) => {
  const options = useMemo(() => {
    const optionalFields = (schema?.fields ?? []).filter(
      (field) => field.type !== "string-unindexed"
    );

    return [
      {
        match: (current: string, previous: string) =>
          (!previous || operators.has(previous)) && !current.includes(":"),
        options: optionalFields.map((field) => ({
          value: `${field.id}:`,
          label: field.name ?? field.id,
        })),
      },
      {
        match: (current: string, previous: string) =>
          !operators.has(previous) && !current.includes(":"),
        options: [
          { value: "AND", label: "And" },
          { value: "OR", label: "Or" },
        ],
      },
    ];
  }, [schema]);

  return options;
};
