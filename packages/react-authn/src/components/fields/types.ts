import { FormField, FormikObject } from "@src/types";

export interface FieldComponentProps {
  name: string;
  value?: any;
  setValue?: (value: any) => void;
  formik?: FormikObject;
  field: FormField;
  variant?: "standard" | "outlined";
  disabled?: boolean;
}