// Copyright 2021 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation
import { FC, ReactNode } from "react";
import { LabelProps } from "../FieldLabel";
import { FormObject, GenericGroupedFields } from "../types";

export type PreviewFieldType =
  | "string"
  | "stringWithCopy"
  | "date"
  | "dateTime"
  | "relativeDateRange"
  | "boolean"
  | "stringArray"
  | "json";

export interface PreviewFieldSchema<T = FormObject> {
  label?: string;
  LabelProps?: LabelProps;

  type?: PreviewFieldType;
  render?: (data: Partial<T>) => JSX.Element;
  isPrimary?: boolean;
  hideIfUndefined?: boolean;
  isHidden?: (values: Partial<T>) => boolean;

  renderValue?: (data: Partial<T>) => JSX.Element;
  getValue?: (data: Partial<T>, fieldKey: string) => any;
  renderControls?: (data: Partial<T>, fieldKey: string) => ReactNode;

  ValueRenderer?: FC<PreviewFieldValueProps<T>>;
}

type FieldsPreviewSchema_<T = FormObject> = Partial<
  Record<keyof T, PreviewFieldSchema<T>>
>;

export type FieldsPreviewSchema<T = FormObject> =
  | FieldsPreviewSchema_<T>
  | Record<string, GenericGroupedFields<FieldsPreviewSchema_<T>, T>>;

export interface PreviewFieldValueProps<T = FormObject> {
  value: any;
  data?: Partial<T>;
  fieldKey: string;
  label: string;
  fieldType?: PreviewFieldType;
}
