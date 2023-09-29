import { FC } from "react";
import FieldControl from "../FieldControl";
import { UnControlledStringField } from "./StringField";
import {
  FieldComponentProps,
  InputFieldComponentProps,
  MultilineFieldSchemaProps,
} from "../types/index";

const UnControlledMultilineField: FC<
  InputFieldComponentProps<MultilineFieldSchemaProps>
> = (props) => {
  const value = props.value;
  const { rows = 4 } = props?.FieldProps ?? {};

  return (
    <UnControlledStringField
      {...props}
      value={typeof value === "object" ? JSON.stringify(value, null, 2) : value}
      FieldProps={{
        type: "text",
        TextFieldProps: {
          multiline: true,
          rows,
          onKeyDown: (event) => event.stopPropagation(),
        },
        InputProps: {
          onKeyDown: (event) => event.stopPropagation(),
        },
      }}
    />
  );
};

const MultilineField: FC<FieldComponentProps<MultilineFieldSchemaProps>> = (
  props
) => {
  return (
    <FieldControl
      {...props}
      FieldControlProps={{
        ignoreErrors: true,
      }}
    >
      <UnControlledMultilineField {...props} />
    </FieldControl>
  );
};

export default MultilineField;
