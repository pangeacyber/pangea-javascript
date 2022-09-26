import { FC } from "react";

import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import AuthNLayout from "../../components/Layout";
import CodeForm from "../../forms/CodeForm";

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
  return (
    <AuthNLayout
    logoUrl={config?.logoUrl}
    companyName={config?.orgName}
    themeOptions={themeOptions}
    sx={sx}
    >
      <CodeForm
       {...props} 
      />
    </AuthNLayout>
  );
}

export default OtpView;