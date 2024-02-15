import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import CaptchaView from "../features/AuthFlow/views/Captcha";

import data from "./data/flow_captcha.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowCaptcha: FC<Props> = ({ data, options }) => {
  return <CaptchaView options={options} data={data} error="" update={update} />;
};

const meta: Meta<typeof CaptchaView> = {
  title: "AuthFlow/Captcha",
  component: FlowCaptcha,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowCaptcha>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowCaptcha options={context.args.options} data={data} />;
  },
};

export default meta;
