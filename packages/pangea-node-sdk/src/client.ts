import PangeaConfig from "./config.js";
import AuditService from "./services/audit.js";
import EmbargoService from "./services/embargo.js";
import RedactService from "./services/redact.js";

class PangeaClient {
  token: string;
  config: PangeaConfig;
  auditService: AuditService | null;
  redactService: RedactService | null;
  embargoService: EmbargoService | null;

  constructor(token: string, config: PangeaConfig) {
    this.token = token;
    this.config = config || new PangeaConfig();

    // service references
    this.auditService = null;
    this.redactService = null;
    this.embargoService = null;
  }

  // TODO: auto-generate these wrappers
  audit(token: string, config: PangeaConfig): AuditService {
    const auditToken = token || this.token;
    const auditConfig = config || this.config;

    if (!this.auditService) {
      this.auditService = new AuditService(auditToken, auditConfig);
    }

    return this.auditService;
  }

  redact(token: string, config: PangeaConfig): RedactService {
    const redactToken = token || this.token;
    const redactConfig = config || this.config;

    if (!this.redactService) {
      this.redactService = new RedactService(redactToken, redactConfig);
    }

    return this.redactService;
  }

  embargo(token: string, config: PangeaConfig): EmbargoService {
    const embargoToken = token || this.token;
    const embargoConfig = config || this.config;

    if (!this.embargoService) {
      this.embargoService = new EmbargoService(embargoToken, embargoConfig);
    }

    return this.embargoService;
  }
}

export default PangeaClient;
