import { FC } from "react";

import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import AuthNPanel from "@src/components/core/Panel";
import LoginForm from "@src/components/forms/LoginForm";

interface LoginViewComponentProps {
  config: any; // TODO: add shared interface
  themeOptions?: ThemeOptions;
  sx?: SxProps;
}

const LoginView: FC<LoginViewComponentProps> = ({
  config,
  themeOptions,
  sx,
  ...props
}) => {
  return (
    <AuthNPanel
      logoUrl={config?.brand_page_logo}
      logoHeight={config?.brand_logo_height}
      brandName={config?.authn_show_name === "yes" ? config?.brand_name : ""}
      bgColor={config?.bg_color}
      bgImage={config?.bg_image}
      density={config?.density}
      themeOptions={themeOptions}
      sx={sx}
    >
      <LoginForm
        formHeading={config?.login_heading}
        submitLabel={config?.login_button_label}
        socialHeading={config?.login_social_heading}
        showSocialIcons={config?.authn_show_social_icons}
      />
    </AuthNPanel>
  );
};

export default LoginView;
