import { ConfigOptions } from "./types.js";

export const version = "4.4.0";

/** Configuration for a Pangea service client. */
class PangeaConfig {
  /** Used to set Pangea domain and protocol and port if needed. It should include the SERVICE_NAME placeholder. */
  baseURLTemplate: string = "https://{SERVICE_NAME}.aws.us.pangea.cloud";

  /** Config ID for multi-config projects. */
  configID?: string;

  /**
   * Whether or not to perform requests via plain HTTP, as opposed to secure
   * HTTPS.
   */
  insecure: boolean = false;

  /** How many times a request should be retried on failure. */
  requestRetries: number = 3;

  /** Maximum allowed time (in milliseconds) for a request to complete. */
  requestTimeout: number = 5000;

  /** Whether or not queued request retries are enabled. */
  queuedRetryEnabled: boolean = true;

  /** How many queued request retries there should be on failure. */
  queuedRetries: number = 4;

  /** Timeout for polling results after a HTTP/202 (in milliseconds). */
  pollResultTimeoutMs: number = 120 * 1000;

  /** User-Agent string to append to the default one. */
  customUserAgent: string | undefined = "";

  /**
   * Create a new `PangeaConfig`.
   *
   * @param options Configuration options.
   */
  constructor(options?: ConfigOptions) {
    Object.assign(this, options);
  }
}

export default PangeaConfig;
