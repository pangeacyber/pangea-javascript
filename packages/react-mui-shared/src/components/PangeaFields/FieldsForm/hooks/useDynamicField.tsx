import { FormikValues } from "formik";
import merge from "lodash/merge";
import { FormObject } from "../../types";
import { FieldFormSchema } from "../types";
import { useEffect, useState } from "react";

export const useDynamicField = (
  field: FieldFormSchema<FormObject>,
  values: FormikValues | undefined
): FieldFormSchema<FormObject> => {
  const [newField, setNewField] = useState(field);

  useEffect(() => {
    if (field.type !== "field" || field.type === undefined) return;

    if (!!field?.dynamicFieldOverrides) {
      field
        ?.dynamicFieldOverrides(values ?? {})
        .then((overrides) => {
          const newField = merge(field, overrides);
          setNewField(newField);
        })
        .catch(() => {
          setNewField(field);
        });
    }
  }, [field, values]);

  useEffect(() => {
    if (field.type !== "field" || field.type === undefined) return;
    if (!field?.dynamicFieldOverrides) {
      setNewField(field);
    }
  }, [field]);

  return newField;
};
