import { FC, useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import Button from "@src/components/core/Button";
import AuthOptionsNav from "./components";
import AuthEmailOtp from "../AuthEmailOtp";
import AuthMagicLink from "../AuthMagicLink";
import AuthPassword from "../AuthPassword";
import AuthSmsOtp from "../AuthSmsOtp";
import AuthSmsPhone from "../AuthSmsPhone";
import AuthTotp from "../AuthTotp";

const AuthOptions: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, error, reset } = props;
  const [activeProvider, setActiveProvider] = useState<string>("");
  const [content, setContent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    if (data.authChoices?.length === 1) {
      setActiveProvider(data.authChoices[0]);
    } else if (!data.authChoices.includes(activeProvider)) {
      setActiveProvider("");
    }
  }, [data, error]);

  useEffect(() => {
    if (activeProvider === "password") {
      setContent(<AuthPassword {...props} />);
    } else if (activeProvider === "sms_otp" && data.smsOtp?.need_phone) {
      setContent(<AuthSmsPhone {...props} />);
    } else if (activeProvider === "sms_otp") {
      setContent(<AuthSmsOtp {...props} />);
    } else if (activeProvider === "email_otp") {
      setContent(<AuthEmailOtp {...props} />);
    } else if (activeProvider === "magiclink") {
      setContent(<AuthMagicLink {...props} />);
    } else if (activeProvider === "totp") {
      setContent(<AuthTotp {...props} />);
    } else {
      setContent(
        <Stack gap={1}>
          <Typography variant="body2">
            Select an authentication method
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
            gap={{ xs: 0, sm: 1 }}
          >
            <Button variant="text" onClick={reset}>
              {options.cancelLabel}
            </Button>
          </Stack>
        </Stack>
      );
    }
  }, [activeProvider, data, error]);

  const selectHandler = (provider: string) => {
    setActiveProvider(provider);
  };

  return (
    <Stack gap={3} alignItems="center" width="100%">
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
