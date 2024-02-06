import React, { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import "@fontsource/kanit/300.css";
import "@fontsource/kanit/400.css";
import "@fontsource/kanit/500.css";

import { AuthFlowViewOptions } from "../features/AuthFlow/types";
import PangeaThemeProvider from "./theme/pangea/provider";
import { PANGEA } from "./theme/pangea/config";
import AuthNPanel from "../components/core/Panel";
import SignupView from "../features/AuthFlow/views/Signup";
import { getOptions } from "./utils";

import data from "./data/flow_signup.json";

const options = getOptions(data);
const update = (data: any) => {};

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const FlowSignup: FC<Props> = ({ data, options }) => {
  return (
    <PangeaThemeProvider>
      <AuthNPanel
        brandName={PANGEA?.authn_show_name === "yes" ? PANGEA?.brand_name : ""}
        logoUrl={PANGEA?.brand_logo}
        logoHeight={PANGEA?.brand_logo_height}
        bgColor={PANGEA?.bg_color}
        bgImage={PANGEA?.bg_image}
        density={PANGEA?.density}
      >
        <SignupView options={options} data={data} error={{}} update={update} />
      </AuthNPanel>
    </PangeaThemeProvider>
  );
};

const meta: Meta<typeof SignupView> = {
  component: FlowSignup,
};

type Story = StoryObj<typeof FlowSignup>;

export const Signup: Story = {
  render: () => <FlowSignup options={options} data={data} />,
};

export default meta;
