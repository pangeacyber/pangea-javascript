import { TextField, TextFieldProps } from "@mui/material";
import { FC } from "react";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import FieldControl from "../FieldControl";
import { FieldComponentProps, DateTimeFieldSchemaProps } from "../types/index";
import { getISO } from "../../../../utils";

const DateTextField: FC<TextFieldProps> = (props) => {
  return (
    <TextField
      {...props}
      error={undefined}
      size="small"
      sx={{ width: "100%", marginTop: 0 }}
    />
  );
};

const UnControlledDateTimeField: FC<
  FieldComponentProps<DateTimeFieldSchemaProps>
> = ({ value, onValueChange = () => {}, FieldProps }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        value={dayjs(value ?? "")}
        onChange={(newValue) => {
          onValueChange(getISO(newValue));
        }}
        slots={{
          textField: DateTextField,
        }}
        disablePast
        maxDate={FieldProps?.maxDate}
      />
    </LocalizationProvider>
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
