import GoogleIcon from "@src/components/Icons/google";
import GitHubIcon from "@src/components/Icons/github";
import MicrosoftIcon from "@src/components/Icons/microsoft";
import FacebookIcon from "@src/components/Icons/facebook";

export const getSocialProviderIcon = (provider: string) => {
  switch (provider) {
    case "google":
      return <GoogleIcon />;
    case "github":
      return <GitHubIcon />;
    case "microsoftonline":
      return <MicrosoftIcon />;
    case "facebook":
      return <FacebookIcon />;
    default:
      return <></>;
  }
};

export const getSocialProviderLabel = (provider: string): string => {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "microsoftonline":
      return "Microsoft";
    case "facebook":
      return "Facebook";
    case "webauthn":
      return "WebAuthn";
    default:
      return provider;
  }
};

export const getOtpTitle = (provider: string): string => {
  if (provider === "sms_otp") {
    return "SMS";
  } else if (provider === "email_otp") {
    return "Email";
  } else if (provider === "totp") {
    return "Authenticator App";
  } else {
    return provider;
  }
};

export const checkForHtml = (value: string | undefined): boolean => {
  const stripped = value?.replace(/(<([^>]+)>)/gi, "");
  return stripped === value;
};
