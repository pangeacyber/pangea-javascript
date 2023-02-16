import { ConfigOptions, ConfigEnv } from "./types.js";

export const version = "1.2.0";

class PangeaConfig {
  domain: string = "pangea.cloud";
  environment: ConfigEnv = ConfigEnv.PRODUCTION;
  requestRetries: number = 3;
  requestTimeout: number = 5000;
  queuedRetryEnabled: boolean = true;
  queuedRetries: number = 4;

  constructor(options?: ConfigOptions) {
    Object.assign(this, options);
  }
}

export default PangeaConfig;
