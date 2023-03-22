import { useMemo } from "react";
import merge from "lodash/merge";
import pick from "lodash/pick";
import map from "lodash/map";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";

import { Audit } from "../types";
import { GridColDef } from "@mui/x-data-grid";
import {
  FilterOptions,
  PDG,
  useGridSchemaColumns,
} from "@pangeacyber/react-mui-shared";

export const DEFAULT_AUDIT_SCHEMA: Audit.Schema = {
  client_signable: true,
  tamper_proofing: true,
  fields: [
    {
      id: "received_at",
      name: "Time",
      type: "datetime",
      uiDefaultVisible: true,
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
      uiDefaultVisible: true,
    },
  ],
};

const COLUMN_TYPE_MAP = {
  [Audit.SchemaFieldType.DateTime]: "dateTime",
};

export const useAuditColumns = <Event,>(
  schema: Audit.Schema,
  fields: Partial<Record<keyof Event, Partial<GridColDef>>> | undefined
) => {
  const gridFields: PDG.GridSchemaFields<Event> = useMemo(() => {
    const schemaFields = schema?.fields ?? [];

    // @ts-ignore
    const defaultColumnDefinitions: PDG.GridSchemaFields<Event> = mapValues(
      keyBy(schemaFields, "id"),
      (field) => {
        const column: Partial<PDG.GridField> = {
          label: field.name ?? field.id,
          description: field.description,
          type: get(COLUMN_TYPE_MAP, field.type, "string"),
          sortable: field.type === "datetime", // FIXME: What fields exactly should be sortable
          // SpecialField: Message is treated as a special field here, there is no UX for how customers define what is the flex field
          // Potentially this could just become the last field in the display order?
          ...(field.id === "message"
            ? {
                flex: 10,
                minWidth: 200,
              }
            : {}),
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

export const useDefaultVisibility = <Event,>(schema: Audit.Schema) => {
  const visibility = useMemo(() => {
    const schemaFields = schema?.fields ?? [];

    return mapValues(
      keyBy(schemaFields, "id"),
      (field) => !!field.uiDefaultVisible
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
      (field) => field.type === "string"
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
      (field) => field.type === "string"
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
