import React, { FC } from "react";
import { StoryFn, Meta } from "@storybook/react";

import CopyButton, { CopyProps } from "../components/IconButtons/CopyButton";

export default {
  title: "CopyButton",
  component: CopyButton,
  argTypes: {
    name: {
      type: "string",
    },
  },
} as Meta<typeof CopyButton>;

const Template: StoryFn<FC<Partial<CopyProps>>> = (args) => {
  return <CopyButton value={"testing"} label="test" {...args} />;
};

export const CopyButtonDemo: {
  args: Partial<CopyProps>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

CopyButtonDemo.args = {};
