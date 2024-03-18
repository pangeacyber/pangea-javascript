import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import {
  FileData,
  FileScan,
  PostOptions,
  TransferMethod,
  FileItems,
  Sanitize,
  FileUploadParams,
} from "@src/types.js";
import { getFileUploadParams } from "@src/utils/utils.js";
import { PangeaErrors } from "@src/errors.js";

export class SanitizeService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("sanitize", token, config);
  }

  sanitize(
    request: Sanitize.SanitizeRequest,
    fileData?: FileData, // This param is optional. It should be null when using the source_url method
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
    return this.post("v1beta/sanitize", request, postOptions);
  }

  // TODO: Docs
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

    return await this.request.requestPresignedURL("v1beta/sanitize", request);
  }
}

export default SanitizeService;
