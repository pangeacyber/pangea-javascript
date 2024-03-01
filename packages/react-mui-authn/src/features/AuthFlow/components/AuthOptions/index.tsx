import { FC, useEffect, useMemo, useState } from "react";
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

export interface AuthOptionsProps extends AuthFlowComponentProps {
  updateView: (view: string) => void;
}

const AuthOptions: FC<AuthFlowComponentProps> = (props) => {
  const { data, error } = props;
  const [activeProvider, setActiveProvider] = useState<string>("");
  const [view, setView] = useState<string>("");
  const [content, setContent] = useState<JSX.Element>(<></>);

  const choices = useMemo(() => {
    const otpMethods: string[] = data.authChoices.filter((provider: string) => {
      if (provider === "email_otp" || provider === "sms_otp") {
        return provider;
      }
    });

    // filter set_email and set_phone if corresponding otp methods is available
    if (otpMethods.length > 0) {
      const filteredProviders: string[] = data.authChoices.filter(
        (provider: string) => {
          if (
            !(
              (provider === "set_email" && otpMethods.includes("email_otp")) ||
              (provider === "set_phone" && otpMethods.includes("sms_otp"))
            )
          ) {
            return provider;
          }
        }
      );

      return filteredProviders;
    }

    return [...data.authChoices];
  }, [data]);

  useEffect(() => {
    setView("");
  }, [data]);

  useEffect(() => {
    if (choices.length === 1) {
      setActiveProvider(data.authChoices[0]);
    } else if (!choices.includes(activeProvider)) {
      if (activeProvider === "set_email" && choices.includes("email_otp")) {
        setActiveProvider("email_otp");
      } else if (
        activeProvider === "set_phone" &&
        choices.includes("sms_otp")
      ) {
        setActiveProvider("sms_otp");
      } else {
        setActiveProvider("");
      }
    }
  }, [choices, error]);

  useEffect(() => {
    if (activeProvider === "password") {
      setContent(<AuthPassword {...props} />);
    } else if (
      activeProvider === "sms_otp" &&
      (data.smsOtp?.need_phone || view === "phone_number")
    ) {
      setContent(<AuthSmsPhone {...props} />);
    } else if (activeProvider === "sms_otp") {
      setContent(<AuthSmsOtp {...props} updateView={updateView} />);
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
  }, [activeProvider, data, error, view]);

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

  const updateView = (view: string) => {
    setView(view);
  };

  if (choices.length === 0) {
    return null;
  }

  return (
    <Stack gap={2} alignItems="center" width="100%">
      {choices.length > 1 && (
        <>
          <BodyText sxProps={{ margin: "8px 0", padding: "0 32px" }}>
            {getDescriptionText(data.phase)}
          </BodyText>
          <AuthOptionsNav
            authChoices={choices}
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
