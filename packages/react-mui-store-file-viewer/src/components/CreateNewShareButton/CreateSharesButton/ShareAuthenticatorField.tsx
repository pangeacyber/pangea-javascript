import { FC, useState } from "react";
import {
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  FieldComponentProps,
  FieldControl,
} from "@pangeacyber/react-mui-shared";

import { useCreateShareContext } from "../../../hooks/context";
import { ObjectStore } from "../../../types";
import SharePasswordField from "../SharePasswordField";
import SharePhonesField from "../SharePhonesField";
import GetEmailLinkField from "../GetEmailLinkField";
import GeneratePasswordField from "../../GeneratePasswordField";
import GetPhoneLinkField from "../GetPhoneLinkField";
import ShareEmailsField from "../ShareEmailsField";
import GetPasswordLinkField from "../GetPasswordLinkField";
import ShareLinkDetails from "./ShareLinkDetails";

interface FieldProps {
  options?: {
    valueOptions?: string[];
  };
}

interface AuthenticatorValue {
  shareType: string;
  authenticators: ObjectStore.ShareAuthenticator[];
  authenticatorType: string | undefined;
}

const UnControlledShareAuthenticatorField: FC<
  FieldComponentProps<FieldProps>
> = ({ onValueChange, ...props }) => {
  const value: AuthenticatorValue = props.value;
  const theme = useTheme();
  const { shareType, contentType, password, loading, setShareLink } =
    useCreateShareContext();
  const [authenticatorType, setAuthenticatorType] =
    useState<ObjectStore.ShareAuthenticatorType>(
      ObjectStore.ShareAuthenticatorType.Sms
    );
  const minHeight =
    value.shareType === "link" && contentType === "file"
      ? "350px"
      : value.shareType === "link"
        ? "250px"
        : "190px";

  const handleAuthenticatorTypeChange = (
    event: React.MouseEvent<HTMLElement> | undefined,
    newType: string
  ) => {
    if (!newType) return;
    if (onValueChange && shareType === "email") {
      onValueChange({
        ...value,
        authenticators: value.authenticators.map((r) => {
          return {
            ...r,
            auth_context:
              newType === ObjectStore.ShareAuthenticatorType.Sms
                ? r.phone_number
                : password,
            auth_type: newType,
          };
        }),
      });
    }
    setShareLink(undefined);
    setAuthenticatorType(newType as ObjectStore.ShareAuthenticatorType);
  };

  const recipients = value.authenticators.map((a) => ({
    phone_number: a.phone_number || "",
    email: a.notify_email || "",
  }));

  const handleRecipientChange = (recipients: ObjectStore.Recipient[]) => {
    if (!onValueChange) return;

    onValueChange({
      ...value,
      authenticatorType: authenticatorType,
      authenticators: recipients.map((r) => ({
        auth_type: authenticatorType,
        auth_context:
          authenticatorType === ObjectStore.ShareAuthenticatorType.Sms
            ? r.phone_number
            : password,
        notify_email: r.email,
        phone_number: r.phone_number,
      })),
    });
  };

  const handlePasswordChange = (password: string) => {
    if (!onValueChange) return;
    onValueChange({
      ...value,
      authenticatorType: ObjectStore.ShareAuthenticatorType.Password,
      authenticators: recipients.map((r) => ({
        auth_type: ObjectStore.ShareAuthenticatorType.Password,
        auth_context: password,
        notify_email: r.email,
        phone_number: r.phone_number,
      })),
    });
  };

  const handleGetLink = (authContext: string) => {
    if (!onValueChange) return;
    onValueChange({
      ...value,
      authenticatorType: authenticatorType,
      authenticators: [
        {
          auth_type: authenticatorType,
          auth_context: authContext,
        },
      ],
    });
  };

  return (
    <Stack spacing={0.5} minHeight="290px">
      <Stack gap={1}>
        <Button sx={{ position: "absolute", display: "none" }} />
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="body1">Secure by</Typography>
          <ToggleButtonGroup
            color="info"
            value={authenticatorType}
            exclusive
            onChange={handleAuthenticatorTypeChange}
          >
            <ToggleButton
              color="info"
              sx={{ minWidth: "120px", textTransform: "none" }}
              size="small"
              key={`secure-by-sms`}
              value={ObjectStore.ShareAuthenticatorType.Sms}
              disabled={loading}
            >
              <Tooltip
                enterDelay={1000}
                placement="bottom"
                title="Create a secure link per phone number. Each link will require entering a one-time code sent to the number to authorize access."
              >
                <Typography variant="body2">SMS Code</Typography>
              </Tooltip>
            </ToggleButton>
            {value.shareType === "link" && (
              <ToggleButton
                sx={{ minWidth: "120px", textTransform: "none" }}
                size="small"
                color="info"
                key={`secure-by-email`}
                value={ObjectStore.ShareAuthenticatorType.Email}
                disabled={loading}
              >
                <Tooltip
                  enterDelay={1000}
                  placement="bottom"
                  title="Create secure link per email. Each link will require entering a one-time code sent to the email to authorize access."
                >
                  <Typography variant="body2">Email Code</Typography>
                </Tooltip>
              </ToggleButton>
            )}
            <ToggleButton
              size="small"
              color="info"
              sx={{ minWidth: "120px" }}
              key={`secure-by-password`}
              value={ObjectStore.ShareAuthenticatorType.Password}
              disabled={loading}
            >
              <Tooltip
                enterDelay={1000}
                placement="bottom"
                title="Create a secure link protected by password. The link will require entering the password to authorize access."
              >
                <Typography variant="body2" sx={{ textTransform: "none" }}>
                  Password
                </Typography>
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        {value.shareType === "email" && (
          <Typography variant="body1">Recipients</Typography>
        )}
      </Stack>
      {authenticatorType === ObjectStore.ShareAuthenticatorType.Sms && (
        <Stack width="100%" spacing={2} sx={{ minHeight: minHeight }}>
          {value.shareType === "link" && (
            <>
              <GetPhoneLinkField {...props} onValueChange={handleGetLink} />
              <ShareLinkDetails />
            </>
          )}
          {value.shareType === "email" && (
            <SharePhonesField
              {...props}
              value={recipients}
              onValueChange={handleRecipientChange}
            />
          )}
        </Stack>
      )}
      {authenticatorType === ObjectStore.ShareAuthenticatorType.Email && (
        <Stack width="100%" spacing={2} sx={{ minHeight: minHeight }}>
          {value.shareType === "link" && (
            <>
              <GetEmailLinkField
                {...props}
                value={value}
                onValueChange={handleGetLink}
              />
              <ShareLinkDetails />
            </>
          )}
          {value.shareType === "email" && (
            <ShareEmailsField
              {...props}
              value={recipients}
              onValueChange={handleRecipientChange}
            />
          )}
        </Stack>
      )}
      {authenticatorType === ObjectStore.ShareAuthenticatorType.Password && (
        <Stack width="100%" spacing={2} sx={{ minHeight: minHeight }}>
          {value.shareType === "link" && (
            <>
              <GetPasswordLinkField
                {...props}
                value={value}
                onValueChange={handleGetLink}
              />

              <ShareLinkDetails />
            </>
          )}
          {value.shareType === "email" && (
            <>
              <SharePasswordField
                {...props}
                value={recipients}
                onValueChange={handleRecipientChange}
              />
              <Stack>
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.info.main }}
                >
                  Generate Password
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Don’t forget to copy this password to your clipboard.
                </Typography>
              </Stack>
              <GeneratePasswordField onValueChange={handlePasswordChange} />
            </>
          )}
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
