import { FC, ReactNode } from "react";
import { SvgIconProps } from "@mui/material";
import {
  EmailOutlined,
  Link,
  LockRounded,
  PhoneRounded,
} from "@mui/icons-material";

import { formatPhoneNumber } from "../../utils";
import { ObjectStore } from "../../types";

const securedByMessage = (
  auth: ObjectStore.ShareAuthenticator | undefined,
  authCount: number
): string => {
  if (auth?.auth_type === ObjectStore.ShareAuthenticatorType.Email) {
    return `Secured by ${auth.auth_context}`;
  }

  if (auth?.auth_type === ObjectStore.ShareAuthenticatorType.Sms) {
    return `Secured by ${formatPhoneNumber(auth.auth_context)}`;
  }

  if (auth?.auth_type === ObjectStore.ShareAuthenticatorType.Password) {
    return `Secured by password`;
  }

  return `Secured by ${authCount} authenticators`;
};

export const getShareDisplayName = (
  object: ObjectStore.ShareObjectResponse
): string => {
  if (!object || !object?.authenticators) return "Share link";
  const authCount = object?.authenticators?.length ?? 0;
  const identityAuth = authCount === 1 ? object.authenticators[0] : undefined;

  if (object.recipient_email) {
    return `Shared with ${object.recipient_email}`;
  }

  return securedByMessage(identityAuth, authCount);
};

export const getShareTooltip = (
  object: ObjectStore.ShareObjectResponse
): string => {
  if (!object || !object?.authenticators) return "Share link";
  const authCount = object?.authenticators?.length ?? 0;
  const identityAuth = authCount === 1 ? object.authenticators[0] : undefined;
  const type = object.link_type || "download";
  const msg = securedByMessage(identityAuth, authCount);

  return `${type.charAt(0).toUpperCase()}${type.slice(1)}: ${msg}`;
};

export const getShareDisplayIcon = (
  object: ObjectStore.ShareObjectResponse
): FC<SvgIconProps> => {
  if (!object || !object?.authenticators) return Link;

  const authCount = object?.authenticators?.length ?? 0;
  const identityAuth = authCount === 1 ? object.authenticators[0] : undefined;

  if (identityAuth?.auth_type === ObjectStore.ShareAuthenticatorType.Email) {
    return EmailOutlined;
  }

  if (identityAuth?.auth_type === ObjectStore.ShareAuthenticatorType.Password) {
    return LockRounded;
  }

  if (identityAuth?.auth_type === ObjectStore.ShareAuthenticatorType.Sms) {
    return PhoneRounded;
  }

  return Link;
};

export const getDateDisplayName = (dateString: string) => {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: undefined,
  });
};
