import { FC, useEffect, useState } from "react";
import { Stack } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthOptionsNav from "./components";
import AuthEmailOtp from "../AuthEmailOtp";
import AuthMagicLink from "../AuthMagicLink";
import AuthPassword from "../AuthPassword";
import AuthSmsOtp from "../AuthSmsOtp";
import AuthTotp from "../AuthTotp";

const AUTH_METHOD_COMPONENTS: { [key: string]: any } = {
  password: AuthPassword,
  magic_link: AuthMagicLink,
  email_otp: AuthEmailOtp,
  sms_otp: AuthSmsOtp,
  totp: AuthTotp,
};

const AuthOptions: FC<AuthFlowComponentProps> = (props) => {
  const { data, options } = props;
  const [activeProvider, setActiveProvider] = useState<string>("");
  const [content, setContent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    if (data.authChoices?.length === 1) {
      setActiveProvider(data.authChoices[0]);
    }
  }, [data]);

  useEffect(() => {
    if (activeProvider in AUTH_METHOD_COMPONENTS) {
      const Component = AUTH_METHOD_COMPONENTS[activeProvider];
      setContent(<Component {...props} />);
    } else {
      setContent(<></>);
    }
  }, [activeProvider]);

  const selectHandler = (provider: string) => {
    setActiveProvider(provider);
  };

  return (
    <Stack gap={1}>
      {data.authChoices?.length > 1 && (
        <AuthOptionsNav
          authChoices={data.authChoices}
          selected={activeProvider}
          selectCallback={selectHandler}
        />
      )}
      {content}
    </Stack>
  );
};

export default AuthOptions;
