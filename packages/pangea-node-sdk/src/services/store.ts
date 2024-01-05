import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { Store, FileData, TransferMethod, FileUploadParams } from "@src/types.js";
import PangeaRequest from "@src/request.js";
import { PangeaErrors } from "@src/errors.js";
import { getFileUploadParams } from "@src/index.js";

/**
 * StoreService class provides methods for interacting with the Store Service
 * @extends BaseService
 */
class StoreService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("store", token, config);
  }

  delete(request: Store.DeleteRequest): Promise<PangeaResponse<Store.DeleteResult>> {
    return this.post("v1beta/delete", request);
  }

  folderCreate(
    request: Store.FolderCreateRequest
  ): Promise<PangeaResponse<Store.FolderCreateResult>> {
    return this.post("v1beta/folder/create", request);
  }

  getItem(request: Store.GetRequest): Promise<PangeaResponse<Store.GetResult>> {
    return this.post("v1beta/get", request);
  }

  getArchive(request: Store.GetArchiveRequest): Promise<PangeaResponse<Store.GetArchiveResult>> {
    return this.post("v1beta/get_archive", request);
  }

  list(request: Store.ListRequest): Promise<PangeaResponse<Store.ListResult>> {
    return this.post("v1beta/list", request);
  }

  put(request: Store.PutRequest, fileData: FileData): Promise<PangeaResponse<Store.PutResult>> {
    let fsData = {} as FileUploadParams;

    if (!request.transfer_method || request.transfer_method === TransferMethod.POST_URL) {
      fsData = getFileUploadParams(fileData.file);
      request.crc32c = fsData.crc32c;
      request.sha256 = fsData.sha256;
      request.size = fsData.size;
    }

    return this.post("v1beta/put", request, {
      files: {
        file: fileData,
      },
    });
  }

  requestUploadURL(request: Store.PutRequest): Promise<PangeaResponse<Store.PutResult>> {
    if (
      request.transfer_method === TransferMethod.POST_URL &&
      (!request.size || !request.crc32c || !request.sha256)
    ) {
      throw new PangeaErrors.PangeaError(
        `When transfer_method is ${request.transfer_method}, crc32c, sha256 and size must be set. Set them or use transfer_method ${TransferMethod.PUT_URL}`
      );
    }

    return this.request.requestPresignedURL("v1beta/put", request);
  }

  update(request: Store.UpdateRequest): Promise<PangeaResponse<Store.UpdateResult>> {
    return this.post("v1beta/update", request);
  }

  shareLinkCreate(
    request: Store.ShareLinkCreateRequest
  ): Promise<PangeaResponse<Store.ShareLinkCreateResult>> {
    return this.post("v1beta/share/link/create", request);
  }

  shareLinkGet(
    request: Store.ShareLinkGetRequest
  ): Promise<PangeaResponse<Store.ShareLinkGetResult>> {
    return this.post("v1beta/share/link/get", request);
  }

  shareLinkList(
    request: Store.ShareLinkListRequest = {}
  ): Promise<PangeaResponse<Store.ShareLinkListResult>> {
    return this.post("v1beta/share/link/list", request);
  }

  shareLinkDelete(
    request: Store.ShareLinkDeleteRequest
  ): Promise<PangeaResponse<Store.ShareLinkDeleteResult>> {
    return this.post("v1beta/share/link/delete", request);
  }
}

export class StoreUploader {
  protected serviceName: string = "FileScanFileUploader";
  protected request_: PangeaRequest | undefined = undefined;

  constructor() {}

  private get request(): PangeaRequest {
    if (this.request_) {
      return this.request_;
    }

    this.request_ = new PangeaRequest(this.serviceName, "notatoken", new PangeaConfig());
    return this.request_;
  }

  // TODO: Docs
  public async uploadFile(
    url: string,
    fileData: FileData,
    options: {
      transfer_method?: TransferMethod;
    }
  ) {
    if (!options.transfer_method || options.transfer_method === TransferMethod.PUT_URL) {
      await this.request.putPresignedURL(url, fileData);
    } else if (options.transfer_method === TransferMethod.POST_URL) {
      await this.request.postPresignedURL(url, fileData);
    }
  }
}

export default StoreService;
