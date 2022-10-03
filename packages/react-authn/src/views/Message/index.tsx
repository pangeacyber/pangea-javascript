import { FC } from "react";

import { SxProps } from "@mui/system";
import { ThemeOptions } from "@mui/material/styles";

import AuthNPanel from "@src/components/core/Panel";
import StatusBox from "@src/components/core/Status";

interface MessageViewProps {
  config: any; // TODO: add shared interface
  themeOptions?: ThemeOptions;
  sx?: SxProps;
}

const MessageView: FC<MessageViewProps> = ({
  config,
  themeOptions,
  sx,
  ...props
}) => {
  const title = "Logged out";
  const message = "You have successfully logged out.";
  const buttonLabel = "Go to login";
  const buttonUrl = "#";
  const links = [
    { url: "#", label: "Go to home page" },
    { url: "#", label: "View documentation" },
  ];

  return (
    <AuthNPanel
      logoUrl={config?.org_page_logo}
      companyName={config?.org_name}
      backgroundImage={config?.bg_image}
      themeOptions={themeOptions}
      sx={sx}
    >
      <StatusBox
        title={title}
        message={message}
        buttonLabel={buttonLabel}
        buttonUrl={buttonUrl}
        links={links}
      />
    </AuthNPanel>
  );
};

export default MessageView;
