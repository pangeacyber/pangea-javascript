import { FC, useEffect, useRef } from "react";
import FieldControl from "../FieldControl";
import { UnControlledStringField } from "./StringField";
import { FieldComponentProps, InputFieldComponentProps } from "../types";
import { JsonFieldSchemaProps } from "../types";

const getObjectString = (
  value: any,
  format: boolean
): { value: string; obj: object; isObject: boolean } => {
  if (typeof value === "object") {
    return {
      value: !!value ? JSON.stringify(value, null, 2) : "",
      obj: value,
      isObject: true,
    };
  }

  try {
    const jsonValue = JSON.parse(value);
    return {
      value: format ? JSON.stringify(jsonValue, null, 2) : value,
      obj: jsonValue,
      isObject: true,
    };
  } catch {
    return { value, obj: value, isObject: false };
  }
};

const UnControlledJsonField: FC<
  InputFieldComponentProps<JsonFieldSchemaProps>
> = ({ onChange, ...props }) => {
  const value = props.value;

  const ref = useRef({ isMount: true });
  const obj = getObjectString(value, ref.current?.isMount);

  useEffect(() => {
    if (!obj.isObject && props.onError) {
      props.onError("Valid JSON is expected.");
    }

    ref.current.isMount = false;

    // onError may not be wrapped in useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obj.value, obj.isObject]);

  return (
    <UnControlledStringField
      {...props}
      onValueChange={(val) => {
        if (!!props.onValueChange)
          props.onValueChange(getObjectString(val, false).obj);
      }}
      value={obj.value}
      FieldProps={{
        type: "text",
        TextFieldProps: {
          multiline: true,
          rows: 4,
          onKeyDown: (event) => event.stopPropagation(),
        },
        InputProps: {
          onKeyDown: (event) => event.stopPropagation(),
        },
      }}
    />
  );
};

const MultilineJsonField: FC<FieldComponentProps<JsonFieldSchemaProps>> = (
  props
) => {
  return (
    <FieldControl {...props}>
      <UnControlledJsonField
        {...props}
        FieldControlProps={{
          ignoreErrors: true,
        }}
      />
    </FieldControl>
  );
};

export default MultilineJsonField;
