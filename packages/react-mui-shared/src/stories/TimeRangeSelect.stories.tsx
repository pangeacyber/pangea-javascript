import React, { FC, useEffect, useState } from "react";
import pick from "lodash/pick";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import TimeRangeSelect, {
  TimeRangeSelectProps,
} from "../components/TimeRangeSelect";

export default {
  title: "TimeRangeSelect",
  component: TimeRangeSelect,
  argTypes: {
    name: {
      type: "string",
    },
  },
} as ComponentMeta<typeof TimeRangeSelect>;

const Template: ComponentStory<FC<Partial<TimeRangeSelectProps>>> = (args) => {
  const [filters, onFilterChange] = useState({});

  return (
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
  );
};

export const TimeRangeSelectDemo: {
  args: Partial<TimeRangeSelectProps>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

TimeRangeSelectDemo.args = {};
