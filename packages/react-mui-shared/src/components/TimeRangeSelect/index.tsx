import { FC, useState, useRef, useEffect } from "react";
import { Button, ButtonProps, Stack } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTheme } from "@mui/material/styles";

import BasicTabs, { BasicTab } from "../BasicTabs";

import PopperCard from "../PopoutCard";
import RelativeDateRangeField, {
  getRelativeDateRange,
  getDisplayDateRange,
  RelativeRange,
} from "../RelativeDateRangeField";
import QuickTimeRanges from "./QuickTimeRanges";
import DateTimeField from "./DateTimeField";

/**
 * FIXME: Cleanup - Hard coded "between" | "after" | "before" values
 *  Active shouldn't be in the time range object. Should be controlled separately.
 */
export const getDisplayValue = (value: TimeRangeObject): string => {
  if (value?.active === "since") {
    const display = getDisplayDateRange(value?.since ?? "");
    return display;
  }

  if (value?.active === "between") {
    return `${new Date(value?.after ?? "").toDateString()} - ${new Date(
      value?.before ?? ""
    ).toDateString()}`;
  }

  if (value?.active === "after") {
    return `After: ${new Date(value.after ?? "").toDateString()}`;
  }

  if (value?.active === "before") {
    return `Before: ${new Date(value?.before ?? "").toDateString()}`;
  }

  return "";
};

const TimeRangeTab: FC<{
  label: string;
  id: string;
  setValue: (update: any) => void;
  value: any;
  setOpen: (open: boolean) => void;
  children?: React.ReactNode;
}> = ({ children, setValue, value, setOpen, ...props }) => {
  return (
    <BasicTab paddingY="8px 0px" {...props}>
      <Stack spacing={2} pt={1}>
        {children}
        <Button
          sx={{ alignSelf: "end" }}
          variant="contained"
          onClick={() => {
            setValue({ ...value, active: props.id });
            setOpen(false);
          }}
        >
          Apply
        </Button>
      </Stack>
    </BasicTab>
  );
};

export interface TimeRangeObject {
  after?: string;
  before?: string;
  since?: string;

  active?: "after" | "before" | "between" | "since";
}

export interface TimeRangeSelectProps {
  value: TimeRangeObject;
  setValue: (value: TimeRangeObject) => void;
  ButtonProps?: Partial<ButtonProps>;
}

const TimeRangeSelect: FC<TimeRangeSelectProps> = ({
  value: parentValue,
  setValue,
  ButtonProps = {},
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setInternalValue] = useState(parentValue);

  useEffect(() => {
    setInternalValue(parentValue);
  }, [parentValue]);

  const buttonRef = useRef(null);

  const displayValue = getDisplayValue(parentValue);
  return (
    <>
      <Button
        ref={buttonRef}
        color="inherit"
        onClick={() => setOpen(() => !open)}
        endIcon={<ArrowDropDownIcon />}
        {...ButtonProps}
        sx={{
          borderColor: theme.palette.divider,
          ...ButtonProps.sx,
          ...(open
            ? {
                borderColor: theme.palette.divider,
                borderLeft: "solid",
                marginLeft: "-1px",
              }
            : {}),
        }}
      >
        {displayValue}
      </Button>
      <PopperCard
        anchorRef={buttonRef}
        open={open}
        setOpen={setOpen}
        placement={"bottom-end"}
        flatTop
      >
        <Stack spacing={1} sx={{ width: "400px" }}>
          <QuickTimeRanges
            value={value.since}
            onSelect={(newValue) => {
              setValue({ ...value, since: newValue, active: "since" });
              setOpen(false);
            }}
          />
          <BasicTabs defaultTab={parentValue.active ?? "since"}>
            <TimeRangeTab
              label="Relative"
              id="since"
              value={value}
              setValue={setValue}
              setOpen={setOpen}
            >
              <RelativeDateRangeField
                name="since"
                label="From the last"
                autoFocus
                value={value["since"] ?? ""}
                setValue={(newValue) =>
                  setInternalValue({ ...value, since: newValue })
                }
                options={[
                  RelativeRange.Week,
                  RelativeRange.Day,
                  RelativeRange.Hour,
                  RelativeRange.Minute,
                  RelativeRange.Second,
                ]}
              />
            </TimeRangeTab>
            <TimeRangeTab
              label="Between"
              id="between"
              value={value}
              setValue={setValue}
              setOpen={setOpen}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <DateTimeField
                  name="beginning"
                  label="Beginning"
                  value={value?.after ?? ""}
                  setValue={(after) => setInternalValue({ ...value, after })}
                />
                <DateTimeField
                  name="end"
                  label="End"
                  value={value?.before ?? ""}
                  setValue={(before) => setInternalValue({ ...value, before })}
                />
              </Stack>
            </TimeRangeTab>
            <TimeRangeTab
              label="Before"
              id="before"
              value={value}
              setValue={setValue}
              setOpen={setOpen}
            >
              <Stack direction="row">
                <DateTimeField
                  name="end"
                  label="Before"
                  value={value?.before ?? ""}
                  setValue={(before) => setInternalValue({ ...value, before })}
                />
              </Stack>
            </TimeRangeTab>
            <TimeRangeTab
              label="After"
              id="after"
              value={value}
              setValue={setValue}
              setOpen={setOpen}
            >
              <Stack direction="row">
                <DateTimeField
                  name="beginning"
                  label="After"
                  value={value?.after ?? ""}
                  setValue={(after) => setInternalValue({ ...value, after })}
                />
              </Stack>
            </TimeRangeTab>
          </BasicTabs>
        </Stack>
      </PopperCard>
    </>
  );
};

export default TimeRangeSelect;
