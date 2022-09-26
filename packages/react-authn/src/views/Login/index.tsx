import { FC } from "react";

import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import AuthNLayout from "@src/components/core/Layout";
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
    <AuthNLayout
      logoUrl={config?.logoUrl}
      companyName={config?.orgName}
      themeOptions={themeOptions}
      sx={sx}
    >
      <LoginForm
        {...props}
      />
    </AuthNLayout>
  );
}

export default LoginView;