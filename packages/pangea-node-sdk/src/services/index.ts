import AuditService from "./audit.js";
import AuthNService from "./authn/index.js";
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
import StoreService from "./store.js";

export default {
  AuditService,
  AuthNService,
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
  StoreService,
};
