import { FC, useEffect, useState } from "react";
import { Stack } from "@mui/material";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthOptionsNav from "./components";
import AuthEmailOtp from "../AuthEmailOtp";
import AuthMagicLink from "../AuthMagicLink";
import AuthPassword from "../AuthPassword";
import AuthSmsOtp from "../AuthSmsOtp";
import AuthSmsPhone from "../AuthSmsPhone";
import AuthTotp from "../AuthTotp";
import AuthOnetimePhone from "../AuthOnetimePhone";
import AuthOnetimeEmail from "../AuthOnetimeEmail";
import { BodyText } from "@src/components/core/Text";

const AuthOptions: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, error } = props;
  const [activeProvider, setActiveProvider] = useState<string>("");
  const [content, setContent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    if (data.authChoices?.length === 1) {
      setActiveProvider(data.authChoices[0]);
    } else if (!data.authChoices.includes(activeProvider)) {
      if (
        activeProvider.includes("set_email") &&
        data.authChoices.includes("email_otp")
      ) {
        setActiveProvider("email_otp");
      } else if (
        activeProvider.includes("set_phone") &&
        data.authChoices.includes("sms_otp")
      ) {
        setActiveProvider("sms_otp");
      } else {
        setActiveProvider("");
      }
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
    } else if (activeProvider === "set_email") {
      setContent(<AuthOnetimeEmail {...props} />);
    } else if (activeProvider === "set_phone") {
      setContent(<AuthOnetimePhone {...props} />);
    } else {
      setContent(<></>);
    }
  }, [activeProvider, data, error]);

  const getDescriptionText = (phase?: string): string => {
    if (phase === "phase_primary") {
      return "Choose your initial step to prove it’s you.";
    }
    if (phase === "phase_secondary") {
      return "Choose an additional step to confirm your identity.";
    }

    return "Choose a way to prove it's you.";
  };

  const selectHandler = (provider: string) => {
    setActiveProvider(provider);
  };

  if (data.authChoices.length === 0) {
    return null;
  }

  return (
    <Stack gap={2} alignItems="center" width="100%">
      {data.authChoices?.length > 1 && (
        <>
          <BodyText sxProps={{ margin: "8px 0", padding: "0 32px" }}>
            {getDescriptionText(data.phase)}
          </BodyText>
          <AuthOptionsNav
            authChoices={data.authChoices}
            selected={activeProvider}
            selectCallback={selectHandler}
          />
        </>
      )}
      {content}
    </Stack>
  );
};

export default AuthOptions;
