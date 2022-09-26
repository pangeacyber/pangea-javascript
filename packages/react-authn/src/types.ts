import { InputProps } from "@mui/material";
import {
  FormikErrors,
  FormikTouched,
  FormikValues,
  FormikState
} from "formik";

export interface FormField {
  label: string;
  labelPlacement?: "top" | "start";
  field?: string;
  placeholder?: string;
  InputProps?: Partial<InputProps>;
  default?: string | boolean | number | string[];
  width?: number | string;
  readonly?: boolean;
  getValueIdentifier?: (value: any) => string;
  required?: boolean;
  info?: string;
}

export interface FormikObject<Values extends FormikValues = FormikValues> {
  initialValues: Values;
  initialErrors: FormikErrors<unknown>;
  initialTouched: FormikTouched<unknown>;
  initialStatus: any;
  handleReset: (e: any) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void; 
  setErrors: (errors: FormikErrors<FormikValues>) => void;
  setFieldTouched: (
    field: string,
    touched?: boolean,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<Values>> | Promise<void>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<Values>> | Promise<void>;
  submitForm: () => Promise<any>;
  values: Values;
  errors: FormikErrors<Values>;
  touched: FormikTouched<Values>;
  isSubmitting: boolean;
  isValidating: boolean;
}

export interface FieldComponentProps {
  name: string;
  value?: any;
  setValue?: (value: any) => void;
  formik?: FormikObject;
  field: FormField;
  variant?: "standard" | "outlined";
  disabled?: boolean;
}