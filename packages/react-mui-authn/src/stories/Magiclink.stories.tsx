import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import MagiclinkView from "../features/AuthFlow/views/Magiclink";

import data from "./data/flow_magiclink.json";

const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowMagiclink: FC<Props> = ({ data, options }) => {
  return (
    <MagiclinkView options={options} data={data} error="" update={update} />
  );
};

const meta: Meta<typeof MagiclinkView> = {
  title: "AuthFlow/Magiclink",
  component: FlowMagiclink,
  tags: ["autodocs"],
};

type Story = StoryObj<typeof FlowMagiclink>;

export const Component: Story = {
  render: (_, context) => {
    return <FlowMagiclink options={context.args.options} data={data} />;
  },
};

export default meta;
