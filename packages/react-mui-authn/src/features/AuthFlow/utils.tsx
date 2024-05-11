import {
  GoogleIcon,
  GitHubIcon,
  MicrosoftIcon,
  FacebookIcon,
  GitLabIcon,
  LinkedInIcon,
} from "@src/components/Icons";
import { parsePhoneNumber } from "awesome-phonenumber";

export const STORAGE_DEVICE_ID_KEY = "remember-device-id";
export const STORAGE_REMEMBER_USERNAME_KEY = "remember-username";

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
    case "gitlab":
      return <GitLabIcon />;
    case "linkedin":
      return <LinkedInIcon />;
    default:
      return <></>;
  }
};

export const getProviderLabel = (provider: string): string => {
  switch (provider) {
    case "google":
      return "Google";
    case "github":
      return "GitHub";
    case "microsoftonline":
      return "Microsoft";
    case "facebook":
      return "Facebook";
    case "gitlab":
      return "GitLab";
    case "linkedin":
      return "LinkedIn";
    case "password":
      return "a password";
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

export const isDark = (color: any): boolean => {
  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If RGB --> store the red, green, blue values in separate variables
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    // If hex --> Convert it to RGB: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {
    return false;
  } else {
    return true;
  }
};

export const generateGuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const formatUsername = (value: string): string => {
  if (value.startsWith("+")) {
    const pn = parsePhoneNumber(value, { regionCode: "US" });
    if (pn.valid) return pn.number.international;
  }

  return value;
};
