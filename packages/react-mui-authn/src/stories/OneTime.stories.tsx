import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import LoginView from "../features/AuthFlow/views/Login";

import data_sms from "./data/flow_onetime_sms.json";
import data_email from "./data/flow_onetime_email.json";
import data_password from "./data/flow_onetime_password.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowOneTime: FC<Props> = ({ data, options }) => {
  return <LoginView options={options} data={data} error={{}} update={update} />;
};

const meta: Meta<typeof LoginView> = {
  title: "AuthFlow/OneTime",
  component: FlowOneTime,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowOneTime>;

export const OneTimeSMS: Story = {
  render: (_, context) => {
    return <FlowOneTime options={context.args.options} data={data_sms} />;
  },
};

export const OneTimeEmail: Story = {
  render: (_, context) => {
    return <FlowOneTime options={context.args.options} data={data_email} />;
  },
};

export const OneTimePassword: Story = {
  render: (_, context) => {
    return <FlowOneTime options={context.args.options} data={data_password} />;
  },
};

export default meta;
