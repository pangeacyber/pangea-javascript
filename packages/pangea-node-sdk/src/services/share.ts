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
   * @summary Delete (Beta)
   * @description Delete object by ID or path. If both are supplied, the path must match that of the object represented by the ID.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_delete
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
    return this.post("v1beta/delete", request);
  }

  /**
   * @summary Create a folder (Beta)
   * @description Create a folder, either by name or path and parent_id.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_folder_create
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
    return this.post("v1beta/folder/create", request);
  }

  /**
   * @summary Get an object (Beta)
   * @description Get object. If both ID and path are supplied, the call will fail if the target object doesn't match both properties.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_get
   * @param {Share.GetRequest} request
   * @returns {Promise} - A promise representing an async call to the get item endpoint.
   * @example
   * ```js
   * const request = { id: "pos_3djfmzg2db4c6donarecbyv5begtj2bm" };
   * const response = await client.getItem(request);
   * ```
   */
  getItem(request: Share.GetRequest): Promise<PangeaResponse<Share.GetResult>> {
    return this.post("v1beta/get", request);
  }

  /**
   * @summary Get archive (Beta)
   * @description Get an archive file of multiple objects.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_get_archive
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
    return this.post("v1beta/get_archive", request);
  }

  /**
   * @summary List (Beta)
   * @description List or filter/search records.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_list
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
    return this.post("v1beta/list", request);
  }

  /**
   * @summary Upload a file (Beta)
   * @description Upload a file.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_put
   * @param {Share.PutRequest} request
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
    fileData: FileData
  ): Promise<PangeaResponse<Share.PutResult>> {
    let fsData = {} as FileUploadParams;

    if (
      !request.transfer_method ||
      request.transfer_method === TransferMethod.POST_URL
    ) {
      fsData = getFileUploadParams(fileData.file);
      request.crc32c = fsData.crc32c;
      request.sha256 = fsData.sha256;
      request.size = fsData.size;
    } else if (getFileSize(fileData.file) == 0) {
      request.size = 0;
    }

    return this.post("v1beta/put", request, {
      files: {
        file: fileData,
      },
    });
  }

  /**
   * @summary Request upload URL (Beta)
   * @description Request a [presigned URL](https://pangea.cloud/docs/api/transfer-methods).
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_put 2
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
   *   Metadata: {
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

    return this.request.requestPresignedURL("v1beta/put", request);
  }

  /**
   * @summary Update a file (Beta)
   * @description Update a file.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_update
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
    return this.post("v1beta/update", request);
  }

  /**
   * @summary Create share links (Beta)
   * @description Create a share link.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_share_link_create
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
    return this.post("v1beta/share/link/create", request);
  }

  /**
   * @summary Get share link (Beta)
   * @description Get a share link.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_share_link_get
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
    return this.post("v1beta/share/link/get", request);
  }

  /**
   * @summary List share links (Beta)
   * @description Look up share links by filter options.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_share_link_list
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
    return this.post("v1beta/share/link/list", request);
  }

  /**
   * @summary Delete share links (Beta)
   * @description Delete share links.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_share_link_delete
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
    return this.post("v1beta/share/link/delete", request);
  }

  /**
   * @summary Send share links (Beta)
   * @description Send share links.
   * How to install a [Beta release](https://pangea.cloud/docs/sdk/js/#beta-releases).
   * @operationId share_post_v1beta_share_link_send
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
    return this.post("v1beta/share/link/send", request);
  }
}

export default ShareService;
