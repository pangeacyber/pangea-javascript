import { Checkbox } from "@mui/material";
import { FC } from "react";
import FieldControl from "../FieldControl";
import { FieldComponentProps, CheckboxFieldSchemaProps } from "../types/index";

const UnControlledCheckboxField: FC<
  FieldComponentProps<CheckboxFieldSchemaProps>
> = ({ name, value, disabled, onValueChange = () => {} }) => {
  return (
    <Checkbox
      id={name}
      name={name}
      color="primary"
      size="small"
      checked={!!value}
      disabled={disabled}
      onChange={(event) => {
        onValueChange(event.target.checked);
      }}
    />
  );
};

const CheckboxField: FC<FieldComponentProps<CheckboxFieldSchemaProps>> = (
  props
) => {
  return (
    <FieldControl
      {...props}
      FieldControlProps={{
        componentStackSx: {
          alignItems: "start",
          justifyContent: "start",
        },
      }}
    >
      <UnControlledCheckboxField {...props} />
    </FieldControl>
  );
};

export default CheckboxField;
