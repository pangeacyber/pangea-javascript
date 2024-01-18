import {
  Button,
  ButtonGroup,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme, lighten } from "@mui/material/styles";
import {
  AuthPasswordField,
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";
import { FC, useState } from "react";

import CheckIcon from "@mui/icons-material/Check";
import { ObjectStore } from "../../../types";
import ShareEmailsField from "../ShareEmailsField";
import SharePhonesField, { PhoneValue } from "../SharePhonesField";
import { useStoreFileViewerContext } from "../../../hooks/context";
import { passwordGenerator } from "../../../utils";

interface FieldProps {
  options?: {
    valueOptions?: string[];
  };
}

interface AuthenticatorValue {
  authenticators: ObjectStore.ShareAuthenticator[];
  authenticatorType: string | undefined;
}

const UnControlledShareAuthenticatorField: FC<
  FieldComponentProps<FieldProps>
> = ({ onValueChange, ...props }) => {
  const { configurations } = useStoreFileViewerContext();

  const value: AuthenticatorValue = props.value;
  const theme = useTheme();
  const [authenticatorType, setAuthenticatorType] =
    useState<ObjectStore.ShareAuthenticatorType>(
      ObjectStore.ShareAuthenticatorType.Sms
    );

  const handleAuthenticatorTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: string
  ) => {
    setAuthenticatorType(newType as ObjectStore.ShareAuthenticatorType);
  };

  const emails = value.authenticators
    .filter((a) => a.auth_type === ObjectStore.ShareAuthenticatorType.Email)
    .map((a) => a.auth_context);
  const phones = value.authenticators
    .filter((a) => a.auth_type === ObjectStore.ShareAuthenticatorType.Sms)
    .map((a) => ({
      phone_number: a.auth_context,
      recipient: "",
    }));
  const passwords = value.authenticators
    .filter((a) => a.auth_type === ObjectStore.ShareAuthenticatorType.Password)
    .map((a) => a.auth_context);
  const password = passwords.length ? passwords[0] : "";

  const handleEmailsChange = (emails: string[]) => {
    if (!onValueChange) return;
    onValueChange({
      ...value,
      authenticators: emails.map((email) => ({
        auth_type: ObjectStore.ShareAuthenticatorType.Email,
        auth_context: email,
      })),
    });
  };

  const handlePhonesChange = (phones: PhoneValue[]) => {
    if (!onValueChange) return;
    onValueChange({
      ...value,
      authenticators: phones.map((phone) => ({
        auth_type: ObjectStore.ShareAuthenticatorType.Sms,
        auth_context: phone.phone_number,
      })),
    });
  };

  const handlePasswordChange = (password: string) => {
    if (!onValueChange) return;
    onValueChange({
      ...value,
      authenticators: [
        {
          auth_type: ObjectStore.ShareAuthenticatorType.Password,
          auth_context: password,
        },
      ],
    });
  };

  return (
    <Stack spacing={0.5}>
      <Stack>
        <ToggleButtonGroup
          color="info"
          value={authenticatorType}
          exclusive
          onChange={handleAuthenticatorTypeChange}
          sx={{
            width: "100%",
            borderWidth: 0,
            bgcolor: lighten(theme.palette.info.main, 0.9),
            ".MuiToggleButton-root": {
              borderWidth: 0,
              borderRadius: "6px!important",
              paddingY: 1.5,
              bgcolor: lighten(theme.palette.info.main, 0.9),
              color: theme.palette.info.main,
              ":hover": {
                bgcolor: lighten(theme.palette.info.main, 0.8),
              },
            },
            ".MuiToggleButton-root.Mui-selected": {
              bgcolor: theme.palette.info.main,
              color: theme.palette.info.contrastText,
              ":hover": {
                bgcolor: theme.palette.info.dark,
              },
            },
          }}
        >
          <Button sx={{ position: "absolute", visibility: "hidden" }} />
          <ToggleButton
            color="info"
            sx={{ width: "100%" }}
            size="small"
            fullWidth
            key={`secure-by-sms`}
            value={ObjectStore.ShareAuthenticatorType.Sms}
          >
            <Tooltip
              enterDelay={1000}
              placement="bottom"
              title="Create secure link(s) per phone number. Each link will require entering a one-time code sent to the number to authorize access."
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Secure by SMS code</Typography>
              </Stack>
            </Tooltip>
          </ToggleButton>
          <ToggleButton
            fullWidth
            sx={{ width: "100%" }}
            size="small"
            color="info"
            key={`secure-by-email`}
            value={ObjectStore.ShareAuthenticatorType.Email}
          >
            <Tooltip
              enterDelay={1000}
              placement="bottom"
              title="Create secure link(s) per email. Each link will require entering a one-time code sent to the email to authorize access."
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Secure by email code</Typography>
              </Stack>
            </Tooltip>
          </ToggleButton>
          <ToggleButton
            fullWidth
            sx={{ width: "100%" }}
            size="small"
            color="info"
            key={`secure-by-password`}
            value={ObjectStore.ShareAuthenticatorType.Password}
          >
            <Tooltip
              enterDelay={1000}
              placement="bottom"
              title="Create a secure link protected by password. The link will require entering the password to authorize access."
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Secure by password</Typography>
              </Stack>
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {authenticatorType === ObjectStore.ShareAuthenticatorType.Sms && (
        <Stack width="100%" spacing={2}>
          <Typography
            variant="body2"
            color={lighten(theme.palette.text.secondary, 0.5)}
          >
            Links secured by SMS will ask for the phone number and a code to
            gain access.
          </Typography>
          <SharePhonesField
            {...props}
            value={phones}
            onValueChange={handlePhonesChange}
          />
        </Stack>
      )}
      {authenticatorType === ObjectStore.ShareAuthenticatorType.Email && (
        <Stack width="100%" spacing={2}>
          <Typography
            variant="body2"
            color={lighten(theme.palette.text.secondary, 0.5)}
          >
            Links secured by email will ask for the email and a code to gain
            access.
          </Typography>
          <ShareEmailsField
            {...props}
            value={emails}
            onValueChange={handleEmailsChange}
          />
        </Stack>
      )}
      {authenticatorType === ObjectStore.ShareAuthenticatorType.Password && (
        <Stack width="100%" spacing={2} sx={{ minHeight: "170px" }}>
          <Typography
            variant="body2"
            color={lighten(theme.palette.text.secondary, 0.5)}
          >
            Links secured by password will ask for the password to gain access.
          </Typography>
          <Stack width="100%">
            <ButtonGroup
              sx={{
                flexGrow: 1,
                width: "100%",
                ".MuiFormGroup-root": {
                  width: "calc(100% - 170px)",
                },
                ".MuiPopper-root": {
                  zIndex: theme.zIndex.modal + 1,
                },
              }}
            >
              <AuthPasswordField
                {...props}
                value={password}
                onValueChange={handlePasswordChange}
                FieldProps={{
                  ...props?.FieldProps,
                  type: "passwordWithPolicy",
                  policy: configurations?.passwordPolicy ?? {
                    chars_min: 8,
                  },
                  InputProps: {
                    fullWidth: true,
                    sx: {
                      borderBottomRightRadius: "0!important",
                      borderTopRightRadius: "0!important",
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handlePasswordChange(passwordGenerator(10))}
                sx={{
                  color: theme.palette.primary.main,
                  borderBottomLeftRadius: "0!important",
                  borderTopLeftRadius: "0!important",
                  boxShadow: "none",
                  zIndex: 0,
                  flex: 1,
                }}
              >
                Generate password
              </Button>
            </ButtonGroup>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

const ShareAuthenticatorField: FC<FieldComponentProps<FieldProps>> = (
  props
) => {
  return (
    <FieldControl {...props} errors={undefined}>
      <UnControlledShareAuthenticatorField {...props} />
    </FieldControl>
  );
};

export default ShareAuthenticatorField;
