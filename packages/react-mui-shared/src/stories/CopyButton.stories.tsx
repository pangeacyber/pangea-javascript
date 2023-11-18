import React, { FC, useEffect, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import CopyButton, { CopyProps } from "../components/IconButtons/CopyButton";

export default {
  title: "CopyButton",
  component: CopyButton,
  argTypes: {
    name: {
      type: "string",
    },
  },
} as ComponentMeta<typeof CopyButton>;

const Template: ComponentStory<FC<Partial<CopyProps>>> = (args) => {
  return <CopyButton value={"testing"} label="test" {...args} />;
};

export const CopyButtonDemo: {
  args: Partial<CopyProps>;
} = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

CopyButtonDemo.args = {};
