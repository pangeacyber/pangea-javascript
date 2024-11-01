import {
  FormControlLabel,
  FormGroup,
  Typography,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { getISO } from "../../utils";
import moment, { Moment } from "moment";

interface DateTimeFieldProps {
  name?: string;
  value: string;
  setValue: (value: string) => void;
  label: string;
}

const SmallTextField: FC<TextFieldProps> = (params) => (
  <TextField {...params} error={false} size="small" sx={{ marginTop: 0 }} />
);

const DateTimeField: FC<DateTimeFieldProps> = ({ value, setValue, label }) => {
  const [adaptDate, setAdaptDate] = useState<Moment | null>(null);

  useEffect(() => {
    const adaptedDate = moment(value);
    if (adaptedDate) setAdaptDate(adaptedDate);
  }, [value]);

  useEffect(() => {
    const dateString = getISO(adaptDate);
    if (dateString && dateString !== value) {
      setValue(dateString);
    }
  }, [adaptDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <FormGroup>
        <FormControlLabel
          control={
            <DesktopDateTimePicker
              value={adaptDate}
              onChange={(newValue) => {
                setAdaptDate(newValue);
              }}
              slots={{
                textField: SmallTextField,
              }}
              viewRenderers={{
                hours: null,
                minutes: null,
                seconds: null,
              }}
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
    </LocalizationProvider>
  );
};

export default DateTimeField;
