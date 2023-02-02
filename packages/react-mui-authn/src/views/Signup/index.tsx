import { FC } from "react";

import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import AuthNPanel from "@src/components/core/Panel";
import SignupForm from "@src/components/forms/SignupForm";

interface SignupViewProps {
  config: any; // TODO: add shared interface
  themeOptions?: ThemeOptions;
  sx?: SxProps;
}

const SignupView: FC<SignupViewProps> = ({
  config,
  themeOptions,
  sx,
  ...props
}) => {
  return (
    <AuthNPanel
      logoUrl={config?.brand_page_logo}
      logoHeight={config?.brand_logo_height}
      brandName={config?.authn_show_name ? config?.brand_name : ""}
      bgColor={config?.bg_color}
      bgImage={config?.bg_image}
      density={config?.density}
      themeOptions={themeOptions}
      sx={sx}
    >
      <SignupForm
        formHeading={config?.signup_heading}
        submitLabel={config?.signup_button_label}
        socialHeading={config?.signup_social_heading}
        showSocialIcons={config?.authn_show_social_icons}
      />
    </AuthNPanel>
  );
};

export default SignupView;
