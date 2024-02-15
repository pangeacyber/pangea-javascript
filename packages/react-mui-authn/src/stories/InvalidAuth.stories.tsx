import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import InvalidAuthView from "../features/AuthFlow/views/InvalidAuth";

import data from "./data/flow_invalid_auth.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowInvalidAuth: FC<Props> = ({ data, options }) => {
  const error = {
    result: {
      display_name: "Google",
      provider: "google",
    },
  };
  return (
    <InvalidAuthView
      options={options}
      data={data}
      error={error}
      update={update}
    />
  );
};

const meta: Meta<typeof InvalidAuthView> = {
  title: "AuthFlow/InvalidAuth",
  component: FlowInvalidAuth,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowInvalidAuth>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowInvalidAuth options={context.args.options} data={data} />;
  },
};

export default meta;
