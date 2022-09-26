import { FC } from "react";

import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import AuthNLayout from "@src/components/core/Layout";
import CodeForm from "@src/components/forms/CodeForm";

interface OtpViewProps {
  config: any;  // TODO: add shared interface
  themeOptions?: ThemeOptions;
  sx?: SxProps;
}

const OtpView: FC<OtpViewProps> = ({ 
  config,
  themeOptions, 
  sx, 
  ...props
}) => {
  const formTitle = "Let's verify it's you";
  const bodyContent = "A six digit code was sent to *******5309. Enter the code below.";

  return (
    <AuthNLayout
    logoUrl={config?.logoUrl}
    companyName={config?.orgName}
    themeOptions={themeOptions}
    sx={sx}
    >
      <CodeForm    
        formTitle={formTitle}
        bodyContent={bodyContent} 
        {...props} 
      />      
    </AuthNLayout>
  );
}

export default OtpView;