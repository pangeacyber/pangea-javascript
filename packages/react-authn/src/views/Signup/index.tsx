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
      logoUrl={config?.org_page_logo}
      companyName={config?.org_name}
      backgroundImage={config?.bg_image}
      themeOptions={themeOptions}
      sx={sx}
    >
      <SignupForm
        formHeading={config?.signup_heading}
        submitLabel={config?.signup_button_label}
        socialHeading={config?.signup_social_heading}
      />
    </AuthNPanel>
  );
};

export default SignupView;
