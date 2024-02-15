import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import ResetPasswordView from "../features/AuthFlow/views/ResetPassword";

import data from "./data/flow_reset_password.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowResetPassword: FC<Props> = ({ data, options }) => {
  return (
    <ResetPasswordView options={options} data={data} error="" update={update} />
  );
};

const meta: Meta<typeof ResetPasswordView> = {
  title: "AuthFlow/ResetPassword",
  component: FlowResetPassword,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowResetPassword>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowResetPassword options={context.args.options} data={data} />;
  },
};

export default meta;
