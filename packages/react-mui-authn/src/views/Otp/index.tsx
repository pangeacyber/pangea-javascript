import { FC } from "react";

import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import AuthNPanel from "@src/components/core/Panel";
import CodeForm from "@src/components/forms/CodeForm";

interface OtpViewComponentProps {
  config: any; // TODO: add shared interface
  themeOptions?: ThemeOptions;
  sx?: SxProps;
}

const OtpView: FC<OtpViewComponentProps> = ({
  config,
  themeOptions,
  sx,
  ...props
}) => {
  const formTitle = "Let's verify it's you";
  const bodyContent =
    "A six digit code was sent to *******5309. Enter the code below.";

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
      <CodeForm
        formTitle={formTitle}
        bodyContent={bodyContent}
        submitLabel={config?.otp_button_label}
      />
    </AuthNPanel>
  );
};

export default OtpView;
