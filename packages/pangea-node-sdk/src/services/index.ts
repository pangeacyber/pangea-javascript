import AuditService from "./audit.js";
import AuthNService from "./authn/index.js";
import AuthZService from "./authz.js";
import EmbargoService from "./embargo.js";
import BaseService from "./base.js";
import RedactService from "./redact.js";
import {
  FileIntelService,
  DomainIntelService,
  IPIntelService,
  URLIntelService,
  UserIntelService,
} from "./intel.js";
import VaultService from "./vault.js";
import { FileScanService } from "./file_scan.js";
import SanitizeService from "./sanitize.js";
import ShareService from "./share.js";

export default {
  AuditService,
  AuthNService,
  AuthZService,
  EmbargoService,
  BaseService,
  RedactService,
  FileIntelService,
  DomainIntelService,
  IPIntelService,
  URLIntelService,
  UserIntelService,
  VaultService,
  FileScanService,
  SanitizeService,
  ShareService,
};
