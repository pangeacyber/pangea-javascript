import type { ConfigOptions } from "./types.js";

export const version = "1.6.0";

class PangeaConfig {
  domain: string = "pangea.cloud";
  environment: string = "production";
  requestRetries: number = 3;
  requestTimeout: number = 5000;
  queuedRetryEnabled: boolean = true;
  queuedRetries: number = 4;
  customUserAgent: string | undefined = "";

  constructor(options?: ConfigOptions) {
    Object.assign(this, options);
  }
}

export default PangeaConfig;
