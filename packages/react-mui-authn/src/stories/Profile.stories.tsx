import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import ProfileView from "../features/AuthFlow/views/Profile";

import data from "./data/flow_profile.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowProfile: FC<Props> = ({ data, options }) => {
  return <ProfileView options={options} data={data} error="" update={update} />;
};

const meta: Meta<typeof ProfileView> = {
  title: "AuthFlow/Profile",
  component: FlowProfile,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowProfile>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowProfile options={context.args.options} data={data} />;
  },
};

export default meta;
