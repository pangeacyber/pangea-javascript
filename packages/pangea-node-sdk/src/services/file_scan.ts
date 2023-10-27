import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { FileScan } from "@src/types.js";

export class FileScanService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("file-scan", token, config);
  }

  /**
   * @summary Scan
   * @description Scan a file for malicious content.
   * @operationId file_scan_post_v1_scan
   * @param {FileScan.ScanRequest} request
   * @param {string} filepath
   * @param {FileScan.Options} options
   * @returns {Promise} - A promise representing an async call to the check endpoint
   * @example
   * ```js
   * const request = { verbose: true, raw: true, provider: "crowdstrike" };
   * const response = await client.fileScan(request, "./path/to/file.pdf");
   * ```
   */
  fileScan(
    request: FileScan.ScanRequest,
    filepath: string,
    options: FileScan.Options = {
      pollResultSync: true,
    }
  ): Promise<PangeaResponse<FileScan.ScanResult>> {
    return this.postMultipart("v1/scan", request, filepath, options);
  }
}
