import { FC } from "react";
import { LinearProgress, Stack, Typography } from "@mui/material";
import { useTheme, darken, lighten } from "@mui/material/styles";

import CopyLinkButton from "../SendShareViaEmailButton/CopyLinkButton";
import CopyPasswordButton from "../../PasswordCopyButton";
import { useCreateShareContext } from "../../../hooks/context";

const ShareLinkDetails = () => {
  const theme = useTheme();
  const { password, loading, shareLink: share } = useCreateShareContext();
  const shareType = share?.authenticators?.length
    ? share.authenticators[0]?.auth_type
    : "";
  const modify = theme.palette.mode === "dark" ? darken : lighten;

  if (loading) {
    return <LinearProgress color="info" />;
  }
  if (!shareType) return null;

  return (
    <Stack gap={1}>
      <Typography variant="subtitle1" sx={{ color: theme.palette.info.main }}>
        Your Generated Link
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {shareType === "sms_otp" &&
          "This unique URL is protected with MFA using the phone number above."}
        {shareType === "email_otp" &&
          "This unique URL is protected with MFA using the email above."}
        {shareType === "password" &&
          "This unique URL is protected with MFA using the password below."}
      </Typography>
      <CopyLinkButton
        value={share?.link}
        label={share?.link || ""}
        variant="contained"
        disableElevation
        sx={{
          bgcolor: modify(theme.palette.info.main, 0.9),
          color: theme.palette.info.main,
          ":hover": {
            bgcolor: modify(theme.palette.info.main, 0.8),
          },
        }}
        fullWidth
        data-testid={"Share-Copy-Btn"}
      >
        {share?.link}
      </CopyLinkButton>
      {shareType === "password" && password && (
        <Stack>
          <Typography variant="body2" color="textSecondary">
            Password
          </Typography>
          <CopyPasswordButton
            value={password}
            label={password}
            variant="contained"
            disableElevation
            sx={{
              bgcolor: modify(theme.palette.info.main, 0.9),
              color: theme.palette.info.main,
              ":hover": {
                bgcolor: modify(theme.palette.info.main, 0.8),
              },
              paddingLeft: "0",
              paddingRight: "0",
            }}
          >
            {password}
          </CopyPasswordButton>
        </Stack>
      )}
    </Stack>
  );
};

export default ShareLinkDetails;
