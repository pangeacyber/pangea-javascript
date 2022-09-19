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
  
  export enum RelativeRange {
    Year = "y",
    Month = "m",
    Week = "w",
    Day = "d",
    Hour = "h",
    Minute = "tm",
    Second = "s",
  }
  
  const RANGE_TO_SECONDS = {
    [RelativeRange.Year]: 3.154e7,
    [RelativeRange.Month]: 2.628e6,
    [RelativeRange.Week]: 604800,
    [RelativeRange.Day]: 86400,
    [RelativeRange.Hour]: 3600,
    [RelativeRange.Minute]: 60,
    [RelativeRange.Second]: 1,
  };
  
  const RANGE_TO_DISPLAY = {
    [RelativeRange.Year]: "year",
    [RelativeRange.Month]: "month",
    [RelativeRange.Week]: "week",
    [RelativeRange.Day]: "day",
    [RelativeRange.Hour]: "hour",
    [RelativeRange.Minute]: "minute",
    [RelativeRange.Second]: "second",
  };
  
  export const getRelativeDateRange = (
    range: string
  ): {
    amount: number | string;
    span: string;
    relativeRange: RelativeRange;
    prefix: string;
  } => {
    if (!range)
      return {
        amount: 0,
        span: RelativeRange.Day,
        relativeRange: RelativeRange.Day,
        prefix: "",
      };
    const prefix = range.startsWith("t") ? "t" : "";
    const range_ = !!prefix ? range.substring(1) : range;
  
    const spanMatch = range_.match(/[a-z]*$/g)?.filter((m) => !!m);
    if (
      spanMatch?.length !== 1 ||
      !Object.values(RelativeRange).includes(spanMatch[0] as RelativeRange)
    ) {
      return {
        prefix: "",
        amount: 0,
        span: RelativeRange.Day,
        relativeRange: RelativeRange.Day,
      };
    }
  
    // @ts-ignore
    let relativeRange: RelativeRange = spanMatch[0];
    if (!!prefix && relativeRange === RelativeRange.Month) {
      relativeRange = RelativeRange.Minute;
    }
  
    const amountMatch = range_.match(/[0-9]*/g)?.filter((m) => !!m);
    if (amountMatch?.length !== 1 || isNaN(Number(amountMatch[0]))) {
      return { amount: "", span: relativeRange, relativeRange, prefix };
    }
  
    return {
      amount: Number(amountMatch[0]),
      span: spanMatch[0],
      relativeRange,
      prefix,
    };
  };
  
  export const compareRelativeDateRanges = (
    aRange: string | undefined,
    bRange: string | undefined
  ): number => {
    if (!aRange) return 0;
    if (!bRange) return 0;
  
    const { amount: aAmount, relativeRange: aType } =
      getRelativeDateRange(aRange);
    const { amount: bAmount, relativeRange: bType } =
      getRelativeDateRange(bRange);
  
    // @ts-ignore
    const aValue = RANGE_TO_SECONDS[aType] * (aAmount ?? 0);
    // @ts-ignore
    const bValue = RANGE_TO_SECONDS[bType] * (bAmount ?? 0);
  
    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  };
  
  export const getDisplayDateRange = (range: string): string => {
    const { amount, span, relativeRange } = getRelativeDateRange(range);
  
    const spanDisplay = get(RANGE_TO_DISPLAY, relativeRange, startCase(span));
    const plural = !spanDisplay.endsWith("s") && amount > 1 ? "s" : "";
    return `${amount} ${spanDisplay}${plural}`;
  };
  
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
      if (value.length > 2) {
        console.error(`Invalid span ${value}`);
        return;
      }
  
      const [prefix, span] = value.length === 2 ? value.split("") : ["", value];
      const range = `${prefix}${amount}${span}`;
  
      if (setValue) {
        setValue(range);
      }
    };
  
    const plural = amount > 1 ? "s" : "";
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
                    id={name ?? 'relative-number-field'}
                    name={name ?? 'relative-number-field'}
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
                    id={name ?? 'relative-range-field'}
                    name={name ?? 'relative-range-field'}
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
  