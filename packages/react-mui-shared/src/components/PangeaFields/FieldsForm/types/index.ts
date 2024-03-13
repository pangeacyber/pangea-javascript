import React, {
  FC,
  ChangeEventHandler,
  FocusEventHandler,
  ReactNode,
} from "react";
import { SxProps } from "@mui/system";
import {
  InputProps,
  MenuItemProps,
  SelectProps,
  TextFieldProps,
  TypographyProps,
} from "@mui/material";
import { FormObject, GenericGroupedFields } from "../../types";
import { FormikValues } from "formik";
import { FormikObject } from "./formik";
import { PasswordPolicy } from "../fields/AuthPassword/types";

export type ValueOptions =
  | string
  | number
  | {
      value: any;
      valueIdentifier?: string;
      label: string;
      caption?: string;
      description?: string;
      info?: string;
      type?: undefined;
    }
  | {
      label: string;
      type: "category";
      description?: string;
      onChecked?: (checked: boolean) => void;
    };

export type FieldType =
  | "text"
  | "file"
  | "password"
  | "number"
  | "date"
  | "stringArray"
  | "multiSelect"
  | "singleSelect"
  | "json"
  | "multiline"
  | "dateTime"
  | "switch"
  | "checkbox"
  | "passwordWithPolicy";

export type FormFieldType = "field" | "unknownField" | "grouping";

export interface FormFieldLabelProps {
  placement?: "top" | "start";
  info?: string;
  minWidth?: string;
  TypographyProps?: Partial<TypographyProps>;
  FormControlLabelSx?: SxProps;
}

interface FormFieldDescriptionProps {
  placement?: "top" | "bottom";
}

export interface ValueOptionsSchemaProps {
  valueOptions?: ValueOptions[];
  fetchedValueOptions?: (
    values: Record<string, any> | undefined
  ) => Promise<ValueOptions[]>;
  fetchedDependantFields?: string[];
}

export interface StringFieldSchemaProps {
  type: "text" | "file" | "password" | "number" | "date";
  InputProps?: InputProps;
  TextFieldProps?: Partial<TextFieldProps>;
  dataTestId?: string;

  placeholder?: string;

  options?: ValueOptionsSchemaProps;
}

export interface AuthPasswordFieldSchemaProps {
  type: "passwordWithPolicy";
  InputProps?: InputProps;
  TextFieldProps?: Partial<TextFieldProps>;
  dataTestId?: string;

  placeholder?: string;

  options?: ValueOptionsSchemaProps;

  policy?: PasswordPolicy;
}

export interface StringArrayFieldSchemaProps {
  type: "stringArray";
  dedup?: boolean;

  InputProps?: InputProps;
}

export interface SelectFieldSchemaProps {
  type: "multiSelect" | "singleSelect";

  options?: ValueOptionsSchemaProps;

  autoSelectFirstOption?: boolean;
  searchable?: boolean;
  minSearchOptions?: number;

  ValueTypographyProps?: Partial<TypographyProps>;
  CustomValueEl?: FC<{ value: any; labels: string[] }>;

  CustomMenuItem?: FC<MenuItemProps>;

  useLabelInValue?: boolean;
  CaptionSx?: SxProps;
  SelectFieldProps?: Partial<SelectProps>;
  endAdornment?: ReactNode;
  menuItems?: ReactNode;
}

export interface JsonFieldSchemaProps {
  type: "json";
}

export interface MultilineFieldSchemaProps {
  type: "multiline";
  rows?: number;

  placeholder?: string;
  TextFieldProps?: Partial<TextFieldProps>;
}

export interface DateTimeFieldSchemaProps {
  type: "dateTime";
  maxDate?: any;
}

export interface SwitchFieldSchemaProps {
  type: "switch";
}

export interface CheckboxFieldSchemaProps {
  type: "checkbox";
}

export interface BaseFormFieldSchema<T = FormObject> {
  // Auto-filled if used within FieldsFormSchema
  name?: string;

  label: string;
  LabelProps?: FormFieldLabelProps;

  description?: string | React.ReactNode;
  DescriptionProps?: FormFieldDescriptionProps;

  default?: string | boolean | number | string[];
  width?: number | string;

  autoFocus?: boolean;

  readonly?: boolean;
  isReadonly?: (values: Partial<T>) => boolean;

  required?: boolean;
  schema?: any;

  FieldProps?:
    | StringFieldSchemaProps
    | StringArrayFieldSchemaProps
    | SelectFieldSchemaProps
    | JsonFieldSchemaProps
    | MultilineFieldSchemaProps
    | DateTimeFieldSchemaProps
    | SwitchFieldSchemaProps
    | CheckboxFieldSchemaProps
    | AuthPasswordFieldSchemaProps;

  getFieldValue?: (values: Partial<T>) => any;
  onFieldChanged?: (value: string, values: Partial<T>) => Partial<T> | void;

  // Applys to only form fields
  isHidden?: (values: Partial<T>) => boolean;

  component?: FC<FieldComponentProps<any>>;
}

export interface GenericFormFieldSchema<
  T = FormObject,
  FieldSchema = BaseFormFieldSchema
> extends BaseFormFieldSchema<T> {
  type?: "field";

  dynamicFieldOverrides?: (
    values: FormikValues
  ) => Promise<Partial<FieldSchema>>;

  getFieldValue?: (values: Partial<T>) => any;
  onFieldChanged?: (value: string, values: Partial<T>) => Partial<T> | void;
}

export interface CustomFormFieldSchema<T = FormObject>
  extends BaseFormFieldSchema<T> {
  type: "unknownField";

  getFieldValue: (values: Partial<T>) => any;
  onFieldChanged: (value: string, values: Partial<T>) => Partial<T> | void;
}

export type FieldFormSchema<T extends FormObject = any> =
  | GenericFormFieldSchema<T>
  | CustomFormFieldSchema<T>;

export type FieldFormSchemaWithGrouping<T extends FormObject = any> =
  | FieldFormSchema<T>
  | GenericGroupedFields<FieldsFormSchemaWithoutGrouping<T>, T>;

export type FieldsFormSchemaWithoutGrouping<T extends FormObject = any> =
  | Partial<Record<keyof T, GenericFormFieldSchema<T>>>
  | Record<string, CustomFormFieldSchema<T>>;

export type FieldsFormSchema<T extends FormObject = any> =
  | Partial<Record<keyof T, GenericFormFieldSchema<T>>>
  | Record<
      string,
      | CustomFormFieldSchema<T>
      | GenericGroupedFields<FieldsFormSchemaWithoutGrouping<T>, T>
    >;

export interface FieldComponentProps<SpecificFieldProps = unknown> {
  name?: string;

  label?: string;
  LabelProps?: FormFieldLabelProps;

  description?: string | ReactNode;
  DescriptionProps?: FormFieldDescriptionProps;

  autoFocus?: boolean;

  value?: any;
  onValueChange?: (value: any) => void;
  onError?: (err: string) => void;
  errors?: any;
  disabled?: boolean;
  default?: any;

  values?: any;
  formik?: FormikObject;

  variant?: "standard" | "outlined";
  size?: "small" | "medium";
  sx?: SxProps;

  // Custom field specific props;
  FieldProps?: SpecificFieldProps;

  FieldControlProps?: {
    ignoreErrors?: boolean;
    ignoreFormGroup?: boolean;
    formGroupSx?: SxProps;
    formControlLabelSx?: SxProps;
    componentStackSx?: SxProps;
    descriptionPosition?: "component" | "label" | "none";
  };
}

export interface InputFieldComponentProps<SpecificFieldProps = unknown>
  extends FieldComponentProps<SpecificFieldProps> {
  onChange?: ChangeEventHandler;
  onBlur?: FocusEventHandler;
  onFocus?: FocusEventHandler;
}

export interface FormFieldComponentProps<T extends FormObject = any> {
  name: string;
  value?: string;
  formik?: FormikObject;
  disabled?: boolean;
  field: FieldFormSchema<T>;
  LabelProps?: FormFieldLabelProps;
}
