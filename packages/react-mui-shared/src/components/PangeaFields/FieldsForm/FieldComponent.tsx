import { FC, useState, ChangeEvent, useCallback } from "react";
import get from "lodash/get";

import SwitchField from "./fields/SwitchField";
import SelectField from "./fields/SelectField";
import StringField from "./fields/StringField";
import {
  FieldComponentProps,
  InputFieldComponentProps,
  FormFieldComponentProps,
  FieldType,
} from "./types";

import MultilineField from "./fields/MultilineField";
import StringArrayField from "./fields/StringArrayField";
import DateTimeField from "./fields/DateTimeField";
import JsonField from "./fields/JsonField";
import CheckboxField from "./fields/CheckboxField";
import { getFieldPropsFromFormik } from "./utils/formik";
import { useDynamicField } from "./hooks/useDynamicField";

const FIELD_TYPE_COMPONENT_MAP: Partial<
  Record<FieldType, FC<FieldComponentProps<any>>>
> = {
  singleSelect: SelectField,
  multiSelect: SelectField,
  switch: SwitchField,
  checkbox: CheckboxField,
  text: StringField,
  json: JsonField,
  multiline: MultilineField,
  stringArray: StringArrayField,
  dateTime: DateTimeField,
};

const FieldComponent: FC<FormFieldComponentProps> = (props) => {
  const { field: originalField, formik, name } = props;

  const field = useDynamicField(originalField, formik?.values);
  const [type, setType] = useState(field?.FieldProps?.type ?? "");

  const handleFieldChanged = useCallback(
    (val: string) => {
      if (!field.onFieldChanged) return;
      const values = field.onFieldChanged(val, formik?.values ?? {});
      if (values) {
        formik?.setValues({
          ...(formik.values ?? {}),
          ...values,
        });
      }
    },
    [formik?.values, formik?.setValues, field.onFieldChanged]
  );

  if (field?.isHidden && field.isHidden(formik?.values ?? {})) {
    return null;
  }

  let disabled = props.disabled || field.readonly;
  if (field?.isReadonly && field.isReadonly(formik?.values ?? {})) {
    disabled = true;
  }

  const Component: FC<FieldComponentProps<any>> =
    field?.component ?? get(FIELD_TYPE_COMPONENT_MAP, type, StringField);

  const props_: FieldComponentProps<any> | InputFieldComponentProps<any> = {
    name: props.name,

    label: field.label,
    LabelProps: {
      ...(props?.LabelProps ?? {}),
      // @ts-ignore
      minWidth: field.labelProps?.minWidth ?? props?.LabelProps?.minWidth,
      TypographyProps:
        field?.LabelProps?.TypographyProps ??
        props?.LabelProps?.TypographyProps,
      FormControlLabelSx:
        field.LabelProps?.FormControlLabelSx ??
        props?.LabelProps?.FormControlLabelSx,
    },

    description: field.description,
    DescriptionProps: field.DescriptionProps,

    ...(!!formik ? getFieldPropsFromFormik(name, formik) : {}),

    value: props.value ?? formik?.values[name],
    default: field.default,
    disabled,
    autoFocus: field.autoFocus,

    formik,
    values: formik?.values,

    FieldProps: field.FieldProps,
  };

  if (field.getFieldValue !== undefined) {
    props_.value = field.getFieldValue(formik?.values ?? {});
  }

  if (field.onFieldChanged !== undefined) {
    props_.onValueChange = handleFieldChanged;
    // @ts-ignore
    props_.onChange = (event: ChangeEvent<any>) => {
      const val = event.target.value;
      if (!val) return;

      handleFieldChanged(val);
    };
  }

  return (
    <>
      <Component {...props_} />
    </>
  );
};

export default FieldComponent;
