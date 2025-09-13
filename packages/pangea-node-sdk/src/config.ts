export const version = "5.4.0-beta.1";

/** Configuration for a Pangea service client. */
class PangeaConfig {
  /**
   * Template for constructing the base URL for API requests. The placeholder
   * `{SERVICE_NAME}` will be replaced with the service name slug. This is a
   * more powerful version of `domain` that allows for setting more than just
   * the host of the API server. Defaults to
   * `https://{SERVICE_NAME}.aws.us.pangea.cloud`.
   */
  baseUrlTemplate: string = "https://{SERVICE_NAME}.aws.us.pangea.cloud";

  /**
   * Base domain for API requests. This is a weaker version of `baseUrlTemplate`
   * that only allows for setting the host of the API server. Use
   * BaseURLTemplate for more control over the URL, such as setting
   * service-specific paths. Defaults to `aws.us.pangea.cloud`.
   */
  domain: string = "aws.us.pangea.cloud";

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
  constructor(options?: Partial<PangeaConfig>) {
    options = options || {};

    if (!options.baseUrlTemplate && !options.domain) {
      options.baseUrlTemplate = "https://{SERVICE_NAME}.aws.us.pangea.cloud";
    }

    if (!options.baseUrlTemplate && options.domain) {
      options.baseUrlTemplate = `https://{SERVICE_NAME}.${options.domain}`;
    }

    Object.assign(this, options);
  }
}

export default PangeaConfig;
