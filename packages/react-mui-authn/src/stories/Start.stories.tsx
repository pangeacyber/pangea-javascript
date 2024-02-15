import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import StartView from "../features/AuthFlow/views/Start";

import data from "./data/flow_start.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowStart: FC<Props> = ({ data, options }) => {
  return <StartView options={options} data={data} error="" update={update} />;
};

const meta: Meta<typeof StartView> = {
  title: "AuthFlow/Start",
  component: FlowStart,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowStart>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowStart options={context.args.options} data={data} />;
  },
};

export default meta;
