import React, { FC, useState } from "react";
import pick from "lodash/pick";
import { StoryFn, Meta } from "@storybook/react";

import TimeRangeSelect, {
  TimeRangeSelectProps,
} from "../components/TimeRangeSelect";
import { Alert, Stack, Typography } from "@mui/material";

export default {
  title: "TimeRangeSelect",
  component: TimeRangeSelect,
  argTypes: {
    name: {
      type: "string",
    },
  },
} as Meta<typeof TimeRangeSelect>;

const CUSTOM_QUICK_TIME_RANGES = ["1day", "4week", "1year"];

const Template: StoryFn<FC<Partial<TimeRangeSelectProps>>> = (args) => {
  const [filters, onFilterChange] = useState({});

  return (
    <Stack direction="row" spacing={2}>
      <TimeRangeSelect
        value={pick(filters, ["after", "before", "since", "active"]) ?? {}}
        setValue={(rangeObj) => onFilterChange({ ...filters, ...rangeObj })}
        ButtonProps={{
          className: "PangeaInput-root",
          sx: {
            borderLeft: "none",
            borderBottomLeftRadius: "0!important",
            borderTopLeftRadius: "0!important",
          },
        }}
        {...args}
      />
      <TimeRangeSelect
        quickTimeRanges={CUSTOM_QUICK_TIME_RANGES}
        value={pick(filters, ["after", "before", "since", "active"]) ?? {}}
        setValue={(rangeObj) => onFilterChange({ ...filters, ...rangeObj })}
        ButtonProps={{
          className: "PangeaInput-root",
          sx: {
            borderLeft: "none",
            borderBottomLeftRadius: "0!important",
            borderTopLeftRadius: "0!important",
          },
        }}
        {...args}
      >
        <Alert severity="warning">
          <Typography variant="body2">
            Exceeding warm storage search range of 30 days
          </Typography>
        </Alert>
      </TimeRangeSelect>
    </Stack>
  );
};

export const TimeRangeSelectDemo: {
  args: Partial<TimeRangeSelectProps>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

TimeRangeSelectDemo.args = {};
