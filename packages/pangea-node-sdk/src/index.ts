import { default as _PangeaConfig } from "./config.js";
import { default as _PangeaClient } from "./client.js";
import { default as _PangeaRequest } from "./request.js";
import { default as _PangeaResponse } from "./response.js";

import services from "./services/index.js";

// Export all types
export * from "./types.js";

// Export all errors
export * from "./errors.js";

export const PangeaConfig = _PangeaConfig;
export const PangeaClient = _PangeaClient;
export const PangeaRequest = _PangeaRequest;
export const PangeaResponse = _PangeaResponse;

export const AuditService = services.AuditService;
export const BaseService = services.BaseService;
export const EmbargoService = services.EmbargoService;
export const RedactService = services.RedactService;
export const FileIntelService = services.FileIntelService;
export const DomainIntelService = services.DomainIntelService;
export const IPIntelService = services.IPIntelService;
export const URLIntelService = services.URLIntelService;
export const UserIntelService = services.UserIntelService;
export const VaultService = services.VaultService;
