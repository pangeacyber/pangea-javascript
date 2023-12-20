import keyBy from "lodash/keyBy";
import pickBy from "lodash/pickBy";
import mapValues from "lodash/mapValues";

import {
  FieldComponentProps,
  FieldFormSchema,
  InputFieldComponentProps,
} from "../types";
import { FormikObject } from "../types/formik";

export const getFieldPropsFromFormik = (
  name: string,
  formik: FormikObject
): Partial<FieldComponentProps<any> | InputFieldComponentProps<any>> => {
  return {
    name,
    value: formik?.values[name],
    onValueChange: (val: any) => formik?.setFieldValue(name, val),
    onError: (err: string) => {
      formik?.setFieldError(name, err);
    },
    errors: !!formik?.touched[name] ? formik?.errors[name] : undefined,

    onChange: formik?.handleChange,
    onBlur: formik?.handleBlur,
  };
};

export const cleanFormikValues = (
  values: Record<string, any>,
  fields: FieldFormSchema[]
): Record<string, any> => {
  const fieldMap = keyBy(fields, "name");
  return pickBy(
    mapValues(values, (v, k) => {
      const field = fieldMap[k];
      if (!field) return v;

      if (field.FieldProps?.type === "number") {
        try {
          // @ts-ignore
          return Number(v);
        } catch {}
      }

      if (
        field.FieldProps?.type === "switch" ||
        field.FieldProps?.type === "checkbox"
      ) {
        if (typeof v === "boolean") {
          return v;
        } else {
          return undefined;
        }
      }

      if (field.FieldProps?.type === "stringArray") {
        if (!Array.isArray(v)) {
          return undefined;
        }
      }

      return v;
    }),
    (v, k) => v !== undefined
  );
};

export const parseFieldErrors = (error: any): any => {
  const response = error.response ?? {};
  const fieldErrors =
    response?.data?.result?.field_errors ?? error?.field_errors ?? {};

  return fieldErrors;
};
