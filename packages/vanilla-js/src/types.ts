/**
 * Describes the content of a API response for a Pangea request
 */
export interface APIResponse {
  status: string;
  summary: string;
  result: any;
}

/**
 * Describes the client configuration properties
 */
export interface ClientConfig {
  domain: string;
  clientToken: string;
  callbackUri?: string;
  usePathApi?: boolean;
}

/**
 * Describes the body of a response object for a Pangea request
 */
export interface ClientResponse {
  success: boolean;
  response: APIResponse;
}
