// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import { useMemo } from "react";
import { GenericGroupedFields, BaseFieldSchema } from "./types";

type FieldsSchema<FieldSchema extends BaseFieldSchema> =
  | Record<string, FieldSchema>
  | Record<string, GenericGroupedFields<Record<string, FieldSchema>>>;

type Groupings<FieldSchema extends BaseFieldSchema> = Record<
  string,
  {
    metadata?: GenericGroupedFields<Record<string, FieldSchema>>;
    fields: FieldSchema[];
  }
>;

export const useGroupedFields = <FieldSchema extends BaseFieldSchema>(
  fieldsProps: FieldsSchema<FieldSchema>,
  options: { displayReadOnly?: boolean } = {}
): [FieldSchema[], Groupings<FieldSchema>] => {
  const [fields, groups] = useMemo(() => {
    const fields: Groupings<FieldSchema> = {};

    const findValidFields = (
      group: string,
      fields_: FieldsSchema<FieldSchema>
    ) => {
      Object.keys(fields_).forEach((fieldName) => {
        const field = fields_[fieldName];
        const fieldLabel = field.label ?? fieldName;
        if (!field) return;

        if (field.type === "grouping") {
          if (!fields[fieldLabel]) {
            fields[fieldLabel] = {
              metadata: field,
              fields: [],
            };
          }

          findValidFields(field.label, field.fields);
          return;
        }

        const isValid = options.displayReadOnly || !field.readonly;
        if (!isValid) return;

        if (!fields[group])
          fields[group] = {
            fields: [],
          };
        fields[group].fields.push({
          name: fieldName,
          ...field,
        });
      });
    };
    if (!!fieldsProps) findValidFields("", fieldsProps);

    const all: any[] = Object.values(fields).map((g) => g.fields);
    return [[].concat.apply([], all), fields];
  }, [JSON.stringify(fieldsProps)]);

  return [fields, groups];
};
