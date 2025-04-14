import {
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { FC } from "react";
import get from "lodash/get";
import startCase from "lodash/startCase";
import { getRelativeDateRange, RANGE_TO_DISPLAY } from "./utils";
import { RelativeRange } from "./types";

interface RelativeDateRangeFieldProps {
  name?: string;
  label: string;
  readonly?: boolean;
  options?: RelativeRange[];
  autoFocus?: boolean;
  variant?: "outlined";
  value: string;
  setValue: (value: string) => void;
  error?: string;
}

const RelativeDateRangeField: FC<RelativeDateRangeFieldProps> = ({
  name,
  label,
  value,
  setValue,
  variant = "outlined",
  options = [
    RelativeRange.Year,
    RelativeRange.Month,
    RelativeRange.Week,
    RelativeRange.Day,
  ],
  autoFocus,
  readonly = false,
  error,
}) => {
  const { amount, span, prefix } = getRelativeDateRange(value);
  const setAmount = (value: any) => {
    const range = `${prefix}${value}${span}`;
    if (setValue) {
      setValue(range);
    }
  };

  const setSpan = (value: RelativeRange) => {
    const [prefix, span] = value.length === 2 ? value.split("") : ["", value];
    const range = `${prefix}${amount}${span}`;

    if (setValue) {
      setValue(range);
    }
  };

  const plural = typeof amount === "number" && amount > 1 ? "s" : "";
  return (
    <>
      <FormGroup
        sx={{
          alignSelf: "start",
          marginTop: 1,
          alignItems: "center",
          width: "fit-content",
        }}
      >
        <FormControlLabel
          control={
            <Stack spacing={1} alignSelf="start" sx={{ margin: "auto", ml: 1 }}>
              <Stack direction="row" spacing={1} alignSelf="start">
                <TextField
                  id={name ?? "relative-number-field"}
                  name={name ?? "relative-number-field"}
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                  }}
                  type="number"
                  disabled={readonly}
                  variant={variant}
                  size="small"
                  sx={{ width: "80px", margin: "0px" }}
                  inputProps={{ style: { textAlign: "center" } }}
                  InputProps={{ autoFocus }}
                />
                <Select
                  id={name ?? "relative-range-field"}
                  name={name ?? "relative-range-field"}
                  onChange={(event) => {
                    // @ts-ignore Options are all relative ranges
                    setSpan(event.target.value);
                  }}
                  value={span}
                  fullWidth
                  disabled={readonly}
                  variant={variant}
                  size="small"
                  className="slim-no-label"
                  sx={{
                    width: "150px",
                    margin: "0px",
                    ".MuiInputBase-root&.MuiInputBase-sizeSmall": {
                      marginTop: "0px",
                    },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={`relative-option-${option}`} value={option}>
                      {startCase(get(RANGE_TO_DISPLAY, option, option))}
                      {plural}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Stack>
          }
          label={
            <Typography
              sx={{ alignSelf: "start", margin: "auto" }}
              color="textSecondary"
              variant="body2"
            >
              {label}
            </Typography>
          }
          labelPlacement="start"
          sx={{ margin: 0, alignItems: "center" }}
        />
      </FormGroup>
      {!!error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
    </>
  );
};

export default RelativeDateRangeField;
