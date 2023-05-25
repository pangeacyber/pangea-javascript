import GoogleIcon from "@src/components/Icons/google";
import GitHubIcon from "@src/components/Icons/github";
import MicrosoftIcon from "@src/components/Icons/microsoft";
import FacebookIcon from "@src/components/Icons/facebook";

interface Props {
  provider: string;
}

export const getProviderIcon = (provider: string) => {
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

export const getProviderLabel = (provider: string) => {
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
