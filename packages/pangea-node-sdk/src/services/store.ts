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

  /**
   * @summary Delete
   * @description Delete object by ID or path.  If both are supplied, the path must match that of the object represented by the ID.
   * @operationId store_post_v1beta_delete
   * @param {Store.DeleteRequest} request
   * @returns {Promise} - A promise representing an async call to the delete endpoint.
   * @example
   * ```js
   * const request = { id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm" };
   * const response = await client.delete(request);
   * ```
   */
  delete(request: Store.DeleteRequest): Promise<PangeaResponse<Store.DeleteResult>> {
    return this.post("v1beta/delete", request);
  }

  /**
   * @summary Create a folder
   * @description Create a folder, either by name or path and parent_id.
   * @operationId store_post_v1beta_folder_create
   * @param {Store.FolderCreateRequest} request
   * @returns {Promise} - A promise representing an async call to the folder create endpoint.
   * @example
   * ```js
   * const request = {
   *   metadata: {
   *     created_by: "jim",
   *     priority: "medium",
   *   },
   *   parent_id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm",
   *   path: "/",
   *   tags: ["irs_2023", "personal"],
   * };
   *
   * const response = await client.folderCreate(request);
   * ```
   */
  folderCreate(
    request: Store.FolderCreateRequest
  ): Promise<PangeaResponse<Store.FolderCreateResult>> {
    return this.post("v1beta/folder/create", request);
  }

  /**
   * @summary Get an object
   * @description Get object. If both ID and Path are supplied, the call will fail if the target object doesn't match both properties.
   * @operationId store_post_v1beta_get
   * @param {Store.GetRequest} request
   * @returns {Promise} - A promise representing an async call to the get item endpoint.
   * @example
   * ```js
   * const request = {
   *   id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm",
   *   path: "/",
   * };
   *
   * const response = await client.getItem(request);
   * ```
   */
  getItem(request: Store.GetRequest): Promise<PangeaResponse<Store.GetResult>> {
    return this.post("v1beta/get", request);
  }

  /**
   * @summary Get archive
   * @description Get an archive file of multiple objects.
   * @operationId store_post_v1beta_get_archive
   * @param {Store.GetArchiveRequest} request
   * @returns {Promise} - A promise representing an async call to the get archive endpoint.
   * @example
   * ```js
   * const request = { ids: ["pos_3djfmzg2db4c6donarecbyv5begtj2bm"] };
   * const response = await client.getArchive(request);
   * ```
   */
  getArchive(request: Store.GetArchiveRequest): Promise<PangeaResponse<Store.GetArchiveResult>> {
    return this.post("v1beta/get_archive", request);
  }

  /**
   * @summary List
   * @description List or filter/search records.
   * @operationId store_post_v1beta_list
   * @param {Store.ListRequest} request
   * @returns {Promise} - A promise representing an async call to the list endpoint.
   * @example
   * ```js
   * const request = {};
   * const response = await client.list(request);
   * ```
   */
  list(request: Store.ListRequest = {}): Promise<PangeaResponse<Store.ListResult>> {
    return this.post("v1beta/list", request);
  }

  /**
   * @summary Upload a file [beta]
   * @description Upload a file.
   * @operationId store_post_v1beta_put
   * @param {Store.PutRequest} request
   * @param {FileData} fileData
   * @returns {Promise} - A promise representing an async call to the put endpoint.
   * @example
   * ```js
   * const request = {
   *   transfer_method: TransferMethod.MULTIPART,
   *   Metadata: {
   *     created_by: "jim",
   *     priority: "medium",
   *   },
   *   parent_id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm",
   *   path: "/",
   *   tags: ["irs_2023", "personal"],
   * };
   * const file = fs.readFileSync("./path/to/file.pdf");
   * const fileData = {
   *   file,
   *   name: "file",
   * };
   *
   * const response = await client.put(request, fileData);
   * ```
   */
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

  /**
   * @summary Request upload URL
   * @description Request an upload URL.
   * @operationId store_post_v1beta_put 2
   * @param {Store.PutRequest} request
   * @param {FileData} fileData
   * @returns {Promise} - A promise representing an async call to the put endpoint.
   * @example
   * ```js
   * const { crc32c, sha256, size } = getFileUploadParams("./path/to/file.pdf");
   *
   * const request = {
   *   transfer_method: TransferMethod.POST_URL,
   *   crc32c,
   *   sha256,
   *   size,
   *   Metadata: {
   *     created_by: "jim",
   *     priority: "medium",
   *   },
   *   parent_id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm",
   *   path: "/",
   *   tags: ["irs_2023", "personal"],
   * };
   *
   * const response = await client.requestUploadURL(request);
   * ```
   */
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

  /**
   * @summary Update a file
   * @description Update a file.
   * @operationId store_post_v1beta_update
   * @param {Store.UpdateRequest} request
   * @returns {Promise} - A promise representing an async call to the update endpoint.
   * @example
   * ```js
   * const request = {
   *   id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm",
   *   path: "/",
   *   remove_metadata: {
   *     created_by: "jim",
   *     priority: "medium",
   *   }
   *   remove_tags: ["irs_2023", "personal"],
   * };
   *
   * const response = await client.update(request);
   * ```
   */
  update(request: Store.UpdateRequest): Promise<PangeaResponse<Store.UpdateResult>> {
    return this.post("v1beta/update", request);
  }

  /**
   * @summary Create share links
   * @description Create a share link.
   * @operationId store_post_v1beta_share_link_create
   * @param {Store.ShareLinkCreateRequest} request
   * @returns {Promise} - A promise representing an async call to the share link create endpoint.
   * @example
   * ```js
   * const authenticator = {
   *   auth_type: Store.AuthenticatorType.PASSWORD,
   *   auth_context: "my_fav_Pa55word",
   * };
   * const link = {
   *   targets: ["pos_3djfmzg2db4c6donarecbyv5begtj2bm"],
   *   link_type: Store.LinkType.DOWNLOAD,
   *   authenticators: [authenticator],
   * };
   * const request = { links: [link] };
   * const response = await client.shareLinkCreate(request);
   * ```
   */
  shareLinkCreate(
    request: Store.ShareLinkCreateRequest
  ): Promise<PangeaResponse<Store.ShareLinkCreateResult>> {
    return this.post("v1beta/share/link/create", request);
  }

  /**
   * @summary Get share link
   * @description Get a share link.
   * @operationId store_post_v1beta_share_link_get
   * @param {Store.ShareLinkGetRequest} request
   * @returns {Promise} - A promise representing an async call to the share link get endpoint.
   * @example
   * ```js
   * const request = { id: "psl_3djfmzg2db4c6donarecbyv5begtj2bm" };
   * const response = await client.shareLinkGet(request);
   * ```
   */
  shareLinkGet(
    request: Store.ShareLinkGetRequest
  ): Promise<PangeaResponse<Store.ShareLinkGetResult>> {
    return this.post("v1beta/share/link/get", request);
  }

  /**
   * @summary List share links
   * @description Look up share links by filter options.
   * @operationId store_post_v1beta_share_link_list
   * @param {Store.ShareLinkListRequest} request
   * @returns {Promise} - A promise representing an async call to the share link list endpoint.
   * @example
   * ```js
   * const request = {};
   * const response = await client.shareLinkList(request);
   * ```
   */
  shareLinkList(
    request: Store.ShareLinkListRequest = {}
  ): Promise<PangeaResponse<Store.ShareLinkListResult>> {
    return this.post("v1beta/share/link/list", request);
  }

  /**
   * @summary Delete share links
   * @description Delete share links.
   * @operationId store_post_v1beta_share_link_delete
   * @param {Store.ShareLinkDeleteRequest} request
   * @returns {Promise} - A promise representing an async call to the delete share links endpoint.
   * @example
   * ```js
   * const request = { ids: ["psl_3djfmzg2db4c6donarecbyv5begtj2bm"] };
   * const response = await client.shareLinkDelete(request);
   * ```
   */
  shareLinkDelete(
    request: Store.ShareLinkDeleteRequest
  ): Promise<PangeaResponse<Store.ShareLinkDeleteResult>> {
    return this.post("v1beta/share/link/delete", request);
  }

  /**
   * @summary Send share links
   * @description Send share links.
   * @operationId store_post_v1beta_share_link_send
   * @param {Store.ShareLinkDeleteRequest} request
   * @returns {Promise} - A promise representing an async call to the send share links endpoint.
   * @example
   * ```js
   *  const resp = await client.shareLinkSend({
   *    links: [{
   *      id: linkID,
   *      email: "user@email.com",
   *    }],
   *    sender_email: "sender@email.com",
   *    sender_name: "Sender Name"
   *  })
   */
  shareLinkSend(
    request: Store.ShareLinkSendRequest
  ): Promise<PangeaResponse<Store.ShareLinkSendResult>> {
    return this.post("v1beta/share/link/send", request);
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
