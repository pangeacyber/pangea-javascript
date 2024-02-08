import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import MismatchEmailView from "../features/AuthFlow/views/MismatchEmail";

import data from "./data/flow_mismatch_email.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowMismatchEmail: FC<Props> = ({ data, options }) => {
  return (
    <MismatchEmailView options={options} data={data} error="" update={update} />
  );
};

const meta: Meta<typeof MismatchEmailView> = {
  title: "AuthFlow/MismatchEmail",
  component: FlowMismatchEmail,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowMismatchEmail>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowMismatchEmail options={context.args.options} data={data} />;
  },
};

export default meta;
