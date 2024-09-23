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
  }: AuthUrlOptions
): string => {
  const params = {
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    code_challenge: challenge,
    code_challenge_method: challengeMethod,
    response_type: responseType,
  };
  const query = new URLSearchParams(params);

  return `https://${domain}/authorize?${query}`;
};
