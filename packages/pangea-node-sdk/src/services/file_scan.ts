import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { FileScan } from "@src/types.js";

// FileScan
// FIXME: docs
export class FileScanService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("file-scan", token, config);
    this.apiVersion = "v1";
  }

  // FIXME: docs
  fileScan(
    request: FileScan.ScanRequest,
    filepath: string,
    options: FileScan.Options = {
      pollResultSync: true,
    }
  ): Promise<PangeaResponse<FileScan.ScanResult>> {
    return this.postMultipart("scan", request, filepath, options);
  }
}
