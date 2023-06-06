export interface APIResponse {
  status: string;
  summary: string;
  result: any;
}

export interface ClientConfig {
  domain: string;
  clientToken: string;
  callbackUri?: string;
}

export interface ClientResponse {
  success: boolean;
  response: APIResponse;
}
