import React, { FC } from "react";

import { Meta, StoryObj } from "@storybook/react";
import {
  BrandingThemeProvider,
  PangeaAuth,
} from "@pangeacyber/react-mui-branding";
import { AuthFlowViewOptions } from "../features/AuthFlow/types";

import AuthNPanel from "../components/core/Panel";
import AuthFlowComponent from "../features/AuthFlow";
import startData from "./data/flow_start.json";
import passwordData from "./data/flow_password.json";
import captchaData from "./data/flow_captcha.json";
import options from "./data/options.json";
import brandConfig1 from "./data/brand_config_1.json";

const meta: Meta<typeof AuthFlowComponent> = {
  component: AuthFlowComponent,
};
export default meta;

type Story = StoryObj<typeof AuthFlowComponent>;

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

const ComponentView: FC<Props> = ({ data, options }) => {
  const authConfig: PangeaAuth = {
    clientToken: process.env.CLIENT_TOKEN || "",
    domain: process.env.PANGEA_DOMAIN || "",
  };

  return (
    <BrandingThemeProvider
      auth={authConfig}
      brandingId={process.env.BRANDING_ID}
    >
      <AuthNPanel
        brandName={
          brandConfig1?.authn_show_name === "yes"
            ? brandConfig1?.brand_name
            : ""
        }
        logoUrl={brandConfig1?.brand_logo}
        logoHeight={brandConfig1?.brand_logo_height}
        bgColor={brandConfig1?.bg_color}
        bgImage={brandConfig1?.bg_image}
        density={brandConfig1?.density}
      >
        <AuthFlowComponent options={options} data={data} />
      </AuthNPanel>
    </BrandingThemeProvider>
  );
};

export const FlowStart: Story = {
  name: "Auth Flow Start",
  render: () => <ComponentView data={startData} options={options} />,
};

export const FlowPassword: Story = {
  name: "Auth Flow Password",
  render: () => <ComponentView data={passwordData} options={options} />,
};

export const FlowCaptcha: Story = {
  name: "Auth Flow Captcha",
  render: () => <ComponentView data={captchaData} options={options} />,
};
