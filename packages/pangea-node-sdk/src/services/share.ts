import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import {
  Share,
  FileData,
  TransferMethod,
  FileUploadParams,
} from "@src/types.js";
import { PangeaErrors } from "@src/errors.js";
import { getFileUploadParams } from "@src/index.js";
import { getFileSize } from "@src/utils/utils.js";

/**
 * ShareService class provides methods for interacting with the Share Service
 * @extends BaseService
 */
class ShareService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("share", token, config);
  }

  /**
   * @summary Buckets
   * @description Get information on the accessible buckets.
   * @operationId share_post_v1_buckets
   * @returns Information on the accessible buckets
   * @example
   * ```js
   * await client.buckets();
   * ```
   */
  buckets(): Promise<PangeaResponse<Share.BucketsResult>> {
    return this.post("v1/buckets", {});
  }

  /**
   * @summary Delete
   * @description Delete object by ID or path. If both are supplied, the path must match that of the object represented by the ID.
   * @operationId share_post_v1_delete
   * @param {Share.DeleteRequest} request
   * @returns {Promise} - A promise representing an async call to the delete endpoint.
   * @example
   * ```js
   * const request = { id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm" };
   * const response = await client.delete(request);
   * ```
   */
  delete(
    request: Share.DeleteRequest
  ): Promise<PangeaResponse<Share.DeleteResult>> {
    return this.post("v1/delete", request);
  }

  /**
   * @summary Create a folder
   * @description Create a folder, either by name or path and parent_id.
   * @operationId share_post_v1_folder_create
   * @param {Share.FolderCreateRequest} request
   * @returns {Promise} - A promise representing an async call to the folder create endpoint.
   * @example
   * ```js
   * const request = {
   *   metadata: {
   *     created_by: "jim",
   *     priority: "medium",
   *   },
   *   parent_id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm",
   *   folder: "/",
   *   tags: ["irs_2023", "personal"],
   * };
   *
   * const response = await client.folderCreate(request);
   * ```
   */
  folderCreate(
    request: Share.FolderCreateRequest
  ): Promise<PangeaResponse<Share.FolderCreateResult>> {
    return this.post("v1/folder/create", request);
  }

  /**
   * @summary Get an object
   * @description Get object. If both ID and path are supplied, the call will fail if the target object doesn't match both properties.
   * @operationId share_post_v1_get
   * @param {Share.GetRequest} request
   * @returns {Promise} - A promise representing an async call to the get item endpoint.
   * @example
   * ```js
   * const request = { id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm" };
   * const response = await client.getItem(request);
   * ```
   */
  getItem(request: Share.GetRequest): Promise<PangeaResponse<Share.GetResult>> {
    return this.post("v1/get", request);
  }

  /**
   * @summary Get archive
   * @description Get an archive file of multiple objects.
   * @operationId share_post_v1_get_archive
   * @param {Share.GetArchiveRequest} request
   * @returns {Promise} - A promise representing an async call to the get archive endpoint.
   * @example
   * ```js
   * const request = { ids: ["pos_3djfmzg2db4c6donarecbyv5begtj2bm"] };
   * const response = await client.getArchive(request);
   * ```
   */
  getArchive(
    request: Share.GetArchiveRequest
  ): Promise<PangeaResponse<Share.GetArchiveResult>> {
    return this.post("v1/get_archive", request);
  }

  /**
   * @summary List
   * @description List or filter/search records.
   * @operationId share_post_v1_list
   * @param {Share.ListRequest} request
   * @returns {Promise} - A promise representing an async call to the list endpoint.
   * @example
   * ```js
   * const request = {};
   * const response = await client.list(request);
   * ```
   */
  list(
    request: Share.ListRequest = {}
  ): Promise<PangeaResponse<Share.ListResult>> {
    return this.post("v1/list", request);
  }

  put(
    request: Share.PutRequest,
    fileData: FileData
  ): Promise<PangeaResponse<Share.PutResult>>;
  put(
    request: Share.PutRequest & { transfer_method: TransferMethod.SOURCE_URL }
  ): Promise<PangeaResponse<Share.PutResult>>;

  /**
   * @summary Upload a file
   * @description Upload a file.
   * @operationId share_post_v1_put
   * @param {Share.PutRequest} request
   * @param {FileData} fileData
   * @returns {Promise} - A promise representing an async call to the put endpoint.
   * @example
   * ```js
   * const request = {
   *   transfer_method: TransferMethod.MULTIPART,
   *   metadata: {
   *     created_by: "jim",
   *     priority: "medium",
   *   },
   *   parent_id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm",
   *   folder: "/",
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
  put(
    request: Share.PutRequest,
    fileData?: FileData
  ): Promise<PangeaResponse<Share.PutResult>> {
    // With `source-url`, no file data is needed.
    if (request.transfer_method === TransferMethod.SOURCE_URL) {
      return this.post("v1/put", request);
    }

    // Otherwise, file data is required.
    if (!fileData) {
      throw new TypeError(
        "`fileData` is required when `transfer_method` is not `SOURCE_URL`."
      );
    }

    let fsData = {} as FileUploadParams;

    if (
      !request.transfer_method ||
      request.transfer_method === TransferMethod.POST_URL
    ) {
      fsData = getFileUploadParams(fileData.file);
      request.crc32c = fsData.crc32c;
      request.sha256 = fsData.sha256;
      request.size = fsData.size;
    } else if (getFileSize(fileData.file) === 0) {
      request.size = 0;
    }

    return this.post("v1/put", request, {
      files: {
        file: fileData,
      },
    });
  }

  /**
   * @summary Request upload URL
   * @description Request a [presigned URL](https://pangea.cloud/docs/api/transfer-methods).
   * @operationId share_post_v1_put 2
   * @param {Share.PutRequest} request
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
   *   metadata: {
   *     created_by: "jim",
   *     priority: "medium",
   *   },
   *   parent_id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm",
   *   folder: "/",
   *   tags: ["irs_2023", "personal"],
   * };
   *
   * const response = await client.requestUploadURL(request);
   * ```
   */
  requestUploadURL(
    request: Share.PutRequest
  ): Promise<PangeaResponse<Share.PutResult>> {
    if (
      request.transfer_method === TransferMethod.POST_URL &&
      (!request.size || !request.crc32c || !request.sha256)
    ) {
      throw new PangeaErrors.PangeaError(
        `When transfer_method is ${request.transfer_method}, crc32c, sha256 and size must be set. Set them or use transfer_method ${TransferMethod.PUT_URL}`
      );
    }

    return this.request.requestPresignedURL("v1/put", request);
  }

  /**
   * @summary Update a file
   * @description Update a file.
   * @operationId share_post_v1_update
   * @param {Share.UpdateRequest} request
   * @returns {Promise} - A promise representing an async call to the update endpoint.
   * @example
   * ```js
   * const request = {
   *   id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm",
   *   folder: "/",
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
  update(
    request: Share.UpdateRequest
  ): Promise<PangeaResponse<Share.UpdateResult>> {
    return this.post("v1/update", request);
  }

  /**
   * @summary Create share links
   * @description Create a share link.
   * @operationId share_post_v1_share_link_create
   * @param {Share.ShareLinkCreateRequest} request
   * @returns {Promise} - A promise representing an async call to the share link create endpoint.
   * @example
   * ```js
   * const authenticator = {
   *   auth_type: Share.AuthenticatorType.PASSWORD,
   *   auth_context: "my_fav_Pa55word",
   * };
   * const link = {
   *   targets: ["pos_3djfmzg2db4c6donarecbyv5begtj2bm"],
   *   link_type: Share.LinkType.DOWNLOAD,
   *   authenticators: [authenticator],
   * };
   * const request = { links: [link] };
   * const response = await client.shareLinkCreate(request);
   * ```
   */
  shareLinkCreate(
    request: Share.ShareLinkCreateRequest
  ): Promise<PangeaResponse<Share.ShareLinkCreateResult>> {
    return this.post("v1/share/link/create", request);
  }

  /**
   * @summary Get share link
   * @description Get a share link.
   * @operationId share_post_v1_share_link_get
   * @param {Share.ShareLinkGetRequest} request
   * @returns {Promise} - A promise representing an async call to the share link get endpoint.
   * @example
   * ```js
   * const request = { id: "psl_3djfmzg2db4c6donarecbyv5begtj2bm" };
   * const response = await client.shareLinkGet(request);
   * ```
   */
  shareLinkGet(
    request: Share.ShareLinkGetRequest
  ): Promise<PangeaResponse<Share.ShareLinkGetResult>> {
    return this.post("v1/share/link/get", request);
  }

  /**
   * @summary List share links
   * @description Look up share links by filter options.
   * @operationId share_post_v1_share_link_list
   * @param {Share.ShareLinkListRequest} request
   * @returns {Promise} - A promise representing an async call to the share link list endpoint.
   * @example
   * ```js
   * const request = {};
   * const response = await client.shareLinkList(request);
   * ```
   */
  shareLinkList(
    request: Share.ShareLinkListRequest = {}
  ): Promise<PangeaResponse<Share.ShareLinkListResult>> {
    return this.post("v1/share/link/list", request);
  }

  /**
   * @summary Delete share links
   * @description Delete share links.
   * @operationId share_post_v1_share_link_delete
   * @param {Share.ShareLinkDeleteRequest} request
   * @returns {Promise} - A promise representing an async call to the delete share links endpoint.
   * @example
   * ```js
   * const request = { ids: ["psl_3djfmzg2db4c6donarecbyv5begtj2bm"] };
   * const response = await client.shareLinkDelete(request);
   * ```
   */
  shareLinkDelete(
    request: Share.ShareLinkDeleteRequest
  ): Promise<PangeaResponse<Share.ShareLinkDeleteResult>> {
    return this.post("v1/share/link/delete", request);
  }

  /**
   * @summary Send share links
   * @description Send share links.
   * @operationId share_post_v1_share_link_send
   * @param {Share.ShareLinkDeleteRequest} request
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
    request: Share.ShareLinkSendRequest
  ): Promise<PangeaResponse<Share.ShareLinkSendResult>> {
    return this.post("v1/share/link/send", request);
  }
}

export default ShareService;
