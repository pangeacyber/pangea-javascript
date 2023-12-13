import { FC, useEffect, useState } from "react";
import {
  IconButton,
  Stack,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import {
  EmailOutlined,
  LinkRounded,
  MessageOutlined,
  PasswordOutlined,
  TimerOutlined,
  QuestionMarkOutlined,
} from "@mui/icons-material";

interface AuthProviderIconProps {
  provider: string;
  color: string;
}

interface AuthOptionsNavProps {
  authChoices: string[];
  selected: string;
  selectCallback: (provider: string) => void;
}

export const AuthProviderIcon: FC<AuthProviderIconProps> = ({
  provider,
  color,
}) => {
  const sxStyle: SxProps = {
    color: color,
  };

  switch (provider) {
    case "password":
      return <PasswordOutlined sx={sxStyle} />;
    case "magiclink":
      return <LinkRounded sx={sxStyle} />;
    case "sms_otp":
      return <MessageOutlined sx={sxStyle} />;
    case "email_otp":
      return <EmailOutlined sx={sxStyle} />;
    case "totp":
      return <TimerOutlined sx={sxStyle} />;
    case "set_email":
      return <EmailOutlined sx={sxStyle} />;
    case "set_phone":
      return <MessageOutlined sx={sxStyle} />;
    default:
      return <QuestionMarkOutlined sx={sxStyle} />;
  }
};

const getProviderLabel = (provider: string): string => {
  switch (provider) {
    case "password":
      return "Password";
    case "magiclink":
      return "Magic Link";
    case "sms_otp":
      return "SMS";
    case "email_otp":
      return "Email";
    case "totp":
      return "TOTP";
    case "set_email":
      return "Email";
    case "set_phone":
      return "SMS";
    default:
      return provider;
  }
};

export const AuthOptionsNav: FC<AuthOptionsNavProps> = ({
  authChoices,
  selected,
  selectCallback,
}) => {
  const [active, setActive] = useState<string>("");
  const theme = useTheme();

  useEffect(() => {
    setActive(selected);
  }, [selected]);

  const selectOption = (p: string) => {
    setActive(p);
    selectCallback(p);
  };

  return (
    <Stack direction="row" gap={2} alignItems="center">
      {authChoices.map((provider: string) => {
        const iconBackground =
          provider === active
            ? theme.palette.primary.main
            : theme.palette.secondary.main;
        return (
          <Stack gap={1} alignItems="center">
            <IconButton
              sx={{
                width: "56px",
                height: "56px",
                backgroundColor: iconBackground,
                "&:hover": {
                  backgroundColor: iconBackground,
                  opacity: "0.8",
                },
              }}
              onClick={() => {
                selectOption(provider);
              }}
            >
              <AuthProviderIcon
                provider={provider}
                color={
                  provider === active
                    ? theme.palette.getContrastText(iconBackground)
                    : "primary"
                }
              />
            </IconButton>
            <Typography
              variant="body2"
              color="textPrimary"
              sx={{
                fontSize: "12px",
                lineHeight: "12px",
                fontWeight: "400",
              }}
            >
              {getProviderLabel(provider)}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default AuthOptionsNav;
