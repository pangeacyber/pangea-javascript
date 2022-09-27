import { FC } from "react";

import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import AuthNPanel from "@src/components/core/Panel";
import LoginForm from "@src/components/forms/LoginForm";

interface LoginViewProps {
  config: any;  // TODO: add shared interface
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
      logoUrl={config?.logoUrl}
      companyName={config?.orgName}
      backgroundImage={config?.backgroundImage}
      themeOptions={themeOptions}
      sx={sx}
    >
      <LoginForm
        formHeading={config?.loginFormHeading}
        submitLabel={config?.loginSubmitButtonLabel}
        socialHeading={config?.loginFormSocialHeading}
      />
    </AuthNPanel>
  );
}

export default LoginView;