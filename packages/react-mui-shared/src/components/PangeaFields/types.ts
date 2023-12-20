// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

export interface FormObject {
  [key: string]: any;
}

export interface BaseFieldSchema {
  label?: string;
  type?: undefined | "field" | "unknownField";
  readonly?: boolean;
}

export type GenericGroupedFields<FieldsSchema = any, T = FormObject> = {
  label: string;
  description?: string | React.ReactNode;
  collaspable?: boolean;
  type: "grouping";
  defaultOpen?: boolean;
  isHidden?: (values: Partial<T>) => boolean;
  hideLabel?: boolean;
  fields: FieldsSchema;

  renderControls?: (data: Partial<T>) => JSX.Element;
};
