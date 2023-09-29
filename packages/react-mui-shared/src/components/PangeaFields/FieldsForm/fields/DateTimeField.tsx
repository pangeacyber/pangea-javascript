import { ClickAwayListener, TextField, TextFieldProps } from "@mui/material";
import { FC, useState } from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import FieldControl from "../FieldControl";
import { FieldComponentProps, DateTimeFieldSchemaProps } from "../types/index";
import { getISO } from "../../../../utils";

const DateTextField: FC<TextFieldProps> = (props) => {
  return (
    <TextField {...props} size="small" sx={{ width: "100%", marginTop: 0 }} />
  );
};

const UnControlledDateTimeField: FC<
  FieldComponentProps<DateTimeFieldSchemaProps>
> = ({ value, onValueChange = () => {} }) => {
  return (
    <DateTimePicker
      value={dayjs(value ?? "")}
      onChange={(newValue) => {
        onValueChange(getISO(newValue));
      }}
      slots={{
        textField: DateTextField,
      }}
      disablePast
    />
  );
};

const DateTimeField: FC<FieldComponentProps<DateTimeFieldSchemaProps>> = (
  props
) => {
  return (
    <FieldControl {...props}>
      <UnControlledDateTimeField {...props} />
    </FieldControl>
  );
};

export default DateTimeField;
