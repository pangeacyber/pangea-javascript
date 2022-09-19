import {
    FormControlLabel,
    FormGroup,
    Typography,
    TextField,
  } from "@mui/material";
  import { FC } from "react";
  import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
  import { getISO } from "../../utils";

  interface DateTimeFieldProps {
      name?: string;
      value: string;
      setValue: (value: string) => void;
      label: string
  }
  
  const DateTimeField: FC<DateTimeFieldProps> = ({ value, setValue, label }) => {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <DateTimePicker
              value={value || null}
              onChange={(newValue) => {
                if (setValue) setValue(getISO(newValue));
              }}
              renderInput={(params) => (
                <TextField {...params} size="small" sx={{ marginTop: 0 }} />
              )}
            />
          }
          label={
            <Typography
              sx={{ alignSelf: "start", marginBottom: 0.5 }}
              color="textSecondary"
              variant="body2"
            >
              {label}
            </Typography>
          }
          labelPlacement="top"
          sx={{ margin: 0 }}
        />
      </FormGroup>
    );
  };
  
  export default DateTimeField;
  