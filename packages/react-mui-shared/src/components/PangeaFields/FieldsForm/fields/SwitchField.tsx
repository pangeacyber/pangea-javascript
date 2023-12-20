import { Switch } from "@mui/material";
import { FC } from "react";
import { FieldComponentProps, SwitchFieldSchemaProps } from "../types";
import FieldControl from "../FieldControl";

const UnControlledSwitchField: FC<
  FieldComponentProps<SwitchFieldSchemaProps>
> = ({ name, value, disabled, onValueChange = () => {} }) => {
  return (
    <Switch
      id={name}
      name={name}
      color="success"
      sx={{
        marginLeft: 1.5,
        alignSelf: "end",
      }}
      checked={!!value}
      disabled={disabled}
      onChange={(event) => {
        onValueChange(event.target.checked);
      }}
    />
  );
};

const SwitchField: FC<FieldComponentProps<SwitchFieldSchemaProps>> = (
  props
) => {
  return (
    <FieldControl
      {...props}
      FieldControlProps={{
        formControlLabelSx: {
          justifyContent: "space-between",
          width: "100%",
          marginRight: 1,
        },
        formGroupSx: {
          alignItems: "start",
          marginRight: 1,
        },
        componentStackSx: {
          width: "50px",
        },
        descriptionPosition: "label",
      }}
    >
      <UnControlledSwitchField {...props} />
    </FieldControl>
  );
};

export default SwitchField;
