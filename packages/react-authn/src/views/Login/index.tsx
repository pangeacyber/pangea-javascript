import { FC } from "react";

import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import AuthNPanel from "@src/components/core/Panel";
import LoginForm from "@src/components/forms/LoginForm";

interface LoginViewProps {
  config: any; // TODO: add shared interface
  themeOptions?: ThemeOptions;
  sx?: SxProps;
}

const LoginView: FC<LoginViewProps> = ({
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
      <LoginForm
        formHeading={config?.login_heading}
        submitLabel={config?.login_button_label}
        socialHeading={config?.login_social_heading}
      />
    </AuthNPanel>
  );
};

export default LoginView;
