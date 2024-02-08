import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import LoginView from "../features/AuthFlow/views/Login";

import data from "./data/flow_login.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowLogin: FC<Props> = ({ data, options }) => {
  return <LoginView options={options} data={data} error={{}} update={update} />;
};

const meta: Meta<typeof LoginView> = {
  title: "AuthFlow/Login",
  component: FlowLogin,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowLogin>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowLogin options={context.args.options} data={data} />;
  },
};

export default meta;
