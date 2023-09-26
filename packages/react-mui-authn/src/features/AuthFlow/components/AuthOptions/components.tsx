import { FC, useEffect, useState } from "react";
import {
  IconButton,
  Stack,
  SvgIconPropsColorOverrides,
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
import { OverridableStringUnion } from "@mui/types";

const ProviderIcons: { [key: string]: any } = {
  email: PasswordOutlined,
  magic_link: LinkRounded,
  sms_otp: MessageOutlined,
  email_otp: EmailOutlined,
  otp: TimerOutlined,
};

interface AuthProviderIconProps {
  provider: string;
  color:
    | OverridableStringUnion<
        | "action"
        | "disabled"
        | "inherit"
        | "primary"
        | "secondary"
        | "error"
        | "info"
        | "success"
        | "warning",
        SvgIconPropsColorOverrides
      >
    | undefined;
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
  if (provider in ProviderIcons) {
    const Component = ProviderIcons[provider];
    return <Component color={color} />;
  }

  return <QuestionMarkOutlined color={color} />;
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
        <Stack gap={1}>
          <IconButton
            sx={{
              width: "56px",
              height: "56px",
              backgroundColor:
                provider === selected
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
            }}
            onClick={() => {
              selectOption(provider);
            }}
          >
            <AuthProviderIcon
              provider={provider}
              color={provider === active ? "primary" : "secondary"}
            />
          </IconButton>
          <Typography variant="body1">{provider}</Typography>
        </Stack>;
      })}
    </Stack>
  );
};

export default AuthOptionsNav;
