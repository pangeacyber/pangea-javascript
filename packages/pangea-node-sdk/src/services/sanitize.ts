import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import {
  FileData,
  PostOptions,
  TransferMethod,
  FileItems,
  Sanitize,
  FileUploadParams,
} from "@src/types.js";
import { getFileUploadParams } from "@src/utils/utils.js";
import { PangeaErrors } from "@src/errors.js";

/** Sanitize API client. */
export class SanitizeService extends BaseService {
  /**
   * Creates a new `SanitizeService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ baseURLTemplate: "https://{SERVICE_NAME}.aws.us.pangea.cloud" });
   * const sanitize = new SanitizeService("pangea_token", config);
   * ```
   *
   * @summary Sanitize
   */
  constructor(token: string, config: PangeaConfig) {
    super("sanitize", token, config);
  }

  /**
   * @summary Sanitize
   * @description Apply file sanitization actions according to specified rules.
   * @operationId sanitize_post_v1_sanitize
   * @param request Request parameters.
   * @param fileData Optional file data for when the "source-url" transfer
   * method is used.
   * @param options Additional options.
   * @returns The sanitized file and information on the sanitization that was
   * performed.
   * @example
   * ```ts
   * import { readFile } from "node:fs/promises";
   *
   * const request: Sanitize.SanitizeRequest = {
   *   transfer_method: TransferMethod.POST_URL,
   *   uploaded_file_name: "uploaded_file",
   * };
   * const response = await sanitize.sanitize(
   *   request,
   *   { file: await readFile("/path/to/file.txt"), name: "filename" }
   * );
   * ```
   */
  sanitize(
    request: Sanitize.SanitizeRequest,
    fileData?: FileData,
    options: Sanitize.Options = {
      pollResultSync: true,
    }
  ): Promise<PangeaResponse<Sanitize.SanitizeResult>> {
    let fsData = {} as FileUploadParams;

    if (request.transfer_method === TransferMethod.PUT_URL) {
      throw new PangeaErrors.PangeaError(
        `${request.transfer_method} not supported in this function. Use getUploadURL() instead.`
      );
    }

    let files: FileItems | undefined = undefined;

    if (fileData) {
      files = {
        file: fileData,
      };
    }

    const postOptions: PostOptions = {
      pollResultSync: options.pollResultSync,
      files: files,
    };

    if (
      (!request.transfer_method ||
        request.transfer_method === TransferMethod.POST_URL) &&
      fileData
    ) {
      fsData = getFileUploadParams(fileData.file);
    }

    Object.assign(request, fsData);
    return this.post("v1/sanitize", request, postOptions);
  }

  /**
   * @summary Sanitize via presigned URL
   * @description Apply file sanitization actions according to specified rules
   * via a [presigned URL](https://pangea.cloud/docs/api/transfer-methods).
   * @operationId sanitize_post_v1_sanitize 2
   * @param request Request parameters.
   * @returns A presigned URL.
   * @example
   * ```ts
   * const request: Sanitize.SanitizeRequest = {
   *   transfer_method: TransferMethod.PUT_URL,
   *   uploaded_file_name: "uploaded_file",
   * };
   * const presignedUrl = await sanitize.requestUploadURL(request);
   *
   * // Upload file to `presignedUrl.accepted_result.put_url`.
   *
   * // Poll for Sanitize's result.
   * const response = await sanitize.pollResult<Sanitize.SanitizeResult>(presignedUrl.request_id);
   * ```
   */
  async requestUploadURL(
    request: Sanitize.SanitizeRequest
  ): Promise<PangeaResponse<Sanitize.SanitizeResult>> {
    if (
      request.transfer_method === TransferMethod.POST_URL &&
      (!request.size || !request.crc32c || !request.sha256)
    ) {
      throw new PangeaErrors.PangeaError(
        `When transfer_method is ${request.transfer_method}, crc32c, sha256 and size must be set. Set them or use transfer_method ${TransferMethod.PUT_URL}`
      );
    }

    return await this.request.requestPresignedURL("v1/sanitize", request);
  }
}

export default SanitizeService;
