import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import SignupView from "../features/AuthFlow/views/Signup";

import data from "./data/flow_signup.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowSignup: FC<Props> = ({ data, options }) => {
  return <SignupView options={options} data={data} error="" update={update} />;
};

const meta: Meta<typeof SignupView> = {
  title: "AuthFlow/Signup",
  component: FlowSignup,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowSignup>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowSignup options={context.args.options} data={data} />;
  },
};

export default meta;
