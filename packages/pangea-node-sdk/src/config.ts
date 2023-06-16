import { ConfigOptions, ConfigEnv } from "./types.js";

export const version = "2.0.0";

class PangeaConfig {
  domain: string = "pangea.cloud";
  environment: ConfigEnv = ConfigEnv.PRODUCTION;
  insecure: boolean = false;
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
