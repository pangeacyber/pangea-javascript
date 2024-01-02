import { ObjectStore } from "../../types";

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
    return `Secured with ${identityAuth.auth_context}`;
  }

  if (identityAuth?.auth_type === ObjectStore.ShareAuthenticatorType.Password) {
    return `Secured with password`;
  }

  return `Shared using ${authCount} authenticators`;
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
