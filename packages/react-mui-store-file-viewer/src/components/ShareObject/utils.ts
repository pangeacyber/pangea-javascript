import { FC } from "react";
import { ObjectStore } from "../../types";

import LinkIcon from "@mui/icons-material/Link";
import EmailIcon from "@mui/icons-material/Email";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import PasswordIcon from "@mui/icons-material/Password";

import UploadIcon from "@mui/icons-material/Upload";
import DownloadIcon from "@mui/icons-material/Download";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import { IconProps, SvgIconProps } from "@mui/material";

export const getShareDisplayName = (
  object: ObjectStore.ShareObjectResponse
): string => {
  if (!object || !object?.authenticators) return "Share link";
  const authCount = object?.authenticators?.length ?? 0;

  const identityAuth = authCount === 1 ? object.authenticators[0] : undefined;

  if (
    identityAuth?.auth_type === ObjectStore.ShareAuthenticatorType.Email ||
    identityAuth?.auth_type === ObjectStore.ShareAuthenticatorType.Sms
  ) {
    return `${identityAuth.auth_context}`;
  }

  if (identityAuth?.auth_type === ObjectStore.ShareAuthenticatorType.Password) {
    return `Secured with password`;
  }

  return `Shared using ${authCount} authenticators`;
};

export const getShareDisplayIcon = (
  object: ObjectStore.ShareObjectResponse
): FC<SvgIconProps> => {
  if (!object) return LinkIcon;

  if (object?.link_type === ObjectStore.ShareLinkType.Download) {
    return DownloadIcon;
  }

  if (object?.link_type === ObjectStore.ShareLinkType.Upload) {
    return UploadIcon;
  }

  if (object?.link_type === ObjectStore.ShareLinkType.Editor) {
    return BorderColorIcon;
  }

  return LinkIcon;
};

export const getDateDisplayName = (dateString: string) => {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: undefined,
  });
};
