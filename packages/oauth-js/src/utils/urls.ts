import { AuthUrlOptions } from "../types";

export const buildAuthorizeUrl = (
  domain: string,
  {
    clientId,
    redirectUri,
    state,
    challenge,
    challengeMethod,
    responseType,
    scope,
  }: AuthUrlOptions
): string => {
  const params: Record<string, string> = {
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    code_challenge: challenge,
    code_challenge_method: challengeMethod,
    response_type: responseType,
  };

  if (scope) {
    params.scope = scope;
  }
  const query = new URLSearchParams(params);

  return `https://${domain}/authorize?${query}`;
};
