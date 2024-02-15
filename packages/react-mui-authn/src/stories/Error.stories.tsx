import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import ErrorView from "../features/AuthFlow/views/Error";

import data from "./data/flow_error.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowError: FC<Props> = ({ data, options }) => {
  const error = {
    status: "DisabledUser",
    summary: "This account has been disabled",
  };
  return (
    <ErrorView options={options} data={data} error={error} update={update} />
  );
};

const meta: Meta<typeof ErrorView> = {
  title: "AuthFlow/Error",
  component: FlowError,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowError>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowError options={context.args.options} data={data} />;
  },
};

export default meta;
