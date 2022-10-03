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
      logoUrl={config?.logoUrl}
      companyName={config?.orgName}
      backgroundImage={config?.backgroundImage}
      themeOptions={themeOptions}
      sx={sx}
    >
      <SignupForm
        formHeading={config?.signupFormHeading}
        submitLabel={config?.signupSubmitButtonLabel}
        socialHeading={config?.signupFormSocialHeading}
      />
    </AuthNPanel>
  );
};

export default SignupView;
