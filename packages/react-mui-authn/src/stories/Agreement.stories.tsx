import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import AgreementView from "../features/AuthFlow/views/Agreement";

import eulaData from "./data/flow_eula.json";
import privacyData from "./data/flow_privacy.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowAgreement: FC<Props> = ({ data, options }) => {
  return (
    <AgreementView options={options} data={data} error={{}} update={update} />
  );
};

const meta: Meta<typeof AgreementView> = {
  title: "AuthFlow/Agreement",
  component: FlowAgreement,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowAgreement>;

export const EULA: Story = {
  render: (_, context) => {
    return <FlowAgreement options={context.args.options} data={eulaData} />;
  },
};

export const PrivacyPolicy: Story = {
  render: (_, context) => {
    return <FlowAgreement options={context.args.options} data={privacyData} />;
  },
};

export default meta;
