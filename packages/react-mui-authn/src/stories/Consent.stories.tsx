import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import ConsentView from "../features/AuthFlow/views/Consent";

import data from "./data/flow_consent.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowConsent: FC<Props> = ({ data, options }) => {
  console.log("options", options);
  return <ConsentView options={options} data={data} error="" update={update} />;
};

const meta: Meta<typeof ConsentView> = {
  title: "AuthFlow/Consent",
  component: FlowConsent,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowConsent>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowConsent options={context.args.options} data={data} />;
  },
};

export default meta;
