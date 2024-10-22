import {
  PangeaDataGridProps,
  PasswordPolicy,
} from "@pangeacyber/react-mui-shared";
import { GridColDef } from "@mui/x-data-grid";
import { SnackbarProps } from "@mui/material/Snackbar";
import { AlertProps } from "@mui/material/Alert";

import dayjs from "dayjs";

/**
 * Available columns for the `ShareDataGrid`.
 */
export type ShareDataGridColumns = "id" | "name" | "updated_at" | "size";

export interface ShareDataGridCustomizations {
  /**
   * Overrides for specific columns. Can view more on GridColDef from Material-UI x-data-grid
   */
  columnOverrides: Partial<Record<ShareDataGridColumns, Partial<GridColDef>>>;
}

/**
 * Props for the `ShareDataGrid` component. Internal component used within ShareFileViewer
 */
export interface ShareDataGridProps {
  /**
   * Default visibility model for columns.
   */
  defaultVisibilityModel?: Record<string, boolean>;

  /**
   * Default order of columns.
   */
  defaultColumnOrder?: string[];

  /**
   * Toggle whether to include the object ID as a new column. Defaults to `false`.
   */
  includeIdColumn?: boolean;

  /**
   * Provide customization to rendered grid columns.
   */
  customizations?: ShareDataGridCustomizations;

  /**
   * When set to `true`, assumes the first folder found in the initial list response is meant to opened. Used for folder sharing and starting exploration from within the folder.
   */
  virtualRoot?: boolean;

  /**
   * Customization options for the internal `PangeaDataGrid` component used by the `ShareFileViewer`.
   * From `@pangeacyber/react-mui-shared`.
   */
  PangeaDataGridProps?: Partial<
    PangeaDataGridProps<ObjectStore.ObjectResponse>
  >;
}

/**
 * Props for the `FileViewerProvider` component. Internal provider used within ShareFileViewer
 */
export interface FileViewerProviderProps {
  /**
   * The child components to render within the provider.
   */
  children?: React.ReactNode;

  /**
   * Reference to the share proxy API for communication with the object store.
   */
  apiRef: ShareProxyApiRef;

  /**
   * Configuration options for the file viewer.
   */
  configurations?: ShareConfigurations;

  /**
   * Default filter to apply to the file viewer.
   */
  defaultFilter?: ObjectStore.Filter;

  /**
   * Default sorting order for the file viewer.
   */
  defaultSort?: "asc" | "desc";

  /**
   * Default title for share links.
   */
  defaultSortBy?: keyof ObjectStore.ObjectResponse;

  /**
   * Default title for share links.
   */
  defaultShareLinkTitle?: string;
}

/**
 * Generic response from Pangea API.
 */
export interface PangeaResponse<T = any> {
  /**
   * Unique identifier for the request.
   */
  request_id: string;

  /**
   * Status of the response.
   */
  status: string;

  /**
   * Summary message.
   */
  summary: string;

  /**
   * The result data.
   */
  result: T;
}

/**
 * Represents an error response from Pangea API.
 */
export interface PangeaError {
  /**
   * Unique identifier for the request.
   */
  request_id: string;

  /**
   * Summary of the error.
   */
  summary: string;

  /**
   * Status of the error.
   */
  status: string;
}

/**
 * Reference to the Share Proxy API methods for communication with the object store.
 * The StoreFileViewer expects callback functions to interact with the Secure Share API
 * since the component is render in your application client, and may not have access to a token
 * required to call Secure Share. If using Pangea service tokens, the callback should be going through
 * a proxied server, such that the client does not leak access to Pangea.
 */
export interface ShareProxyApiRef {
  /**
   * Lists objects in the object store. Required
   */
  list:
    | ((
        data: ObjectStore.ListRequest
      ) => Promise<PangeaResponse<ObjectStore.ListResponse>>)
    | undefined;

  /**
   * Retrieves an object from the object store. Required
   */
  get:
    | ((
        data: ObjectStore.GetRequest
      ) => Promise<PangeaResponse<ObjectStore.GetResponse>>)
    | undefined;

  /**
   * Retrieves the list of buckets. Required if you want users to select between multiple configured buckets.
   */
  buckets?:
    | ((
        data: ObjectStore.BucketsRequest
      ) => Promise<PangeaResponse<ObjectStore.BucketsResponse>>)
    | undefined;

  /**
   * Retrieves an archive of objects.
   */
  getArchive?:
    | ((
        data: ObjectStore.GetArchiveRequest
      ) => Promise<PangeaResponse<ObjectStore.GetArchiveResponse>>)
    | undefined;

  /**
   * Share-related API methods.
   */
  share?: {
    /**
     * Lists share links.
     */
    list?: (
      data: ObjectStore.ListRequest
    ) => Promise<PangeaResponse<ObjectStore.ShareListResponse>>;

    /**
     * Retrieves a share link.
     */
    get?: (
      data: ObjectStore.ShareGetRequest
    ) => Promise<PangeaResponse<ObjectStore.ShareGetResponse>>;

    /**
     * Deletes share links.
     */
    delete?: (data: ObjectStore.ShareDeleteRequest) => Promise<PangeaResponse>;

    /**
     * Creates share links.
     */
    create?: (
      data: ObjectStore.ShareCreateRequest
    ) => Promise<PangeaResponse<ObjectStore.SharesObjectResponse>>;

    /**
     * Sends share links.
     */
    send?: (
      data: ObjectStore.ShareSendRequest
    ) => Promise<PangeaResponse<ObjectStore.ShareSendResponse>>;
  };

  /**
   * Deletes an object from the object store.
   */
  delete?: (
    data: ObjectStore.DeleteRequest
  ) => Promise<PangeaResponse<ObjectStore.DeleteResponse>>;

  /**
   * Updates an object in the object store.
   */
  update?: (
    data: ObjectStore.UpdateRequest
  ) => Promise<PangeaResponse<ObjectStore.UpdateResponse>>;

  /**
   * Uploads a file to the object store.
   */
  upload?: (
    data: FormData,
    contentType: "multipart/form-data"
  ) => Promise<PangeaResponse<ObjectStore.PutResponse>>;

  /**
   * Creates a new folder in the object store.
   */
  folderCreate?: (
    data: ObjectStore.FolderCreateRequest
  ) => Promise<PangeaResponse<ObjectStore.FolderCreateResponse>>;
}

/**
 * Configuration options for share functionalities.
 */
export interface ShareConfigurations {
  /**
   * Password policy for share links.
   */
  passwordPolicy?: PasswordPolicy;

  /**
   * Alert configurations.
   */
  alerts?: {
    /**
     * Whether to display an alert on error.
     */
    displayAlertOnError: boolean;

    /**
     * Props for the alert snackbar.
     */
    AlertSnackbarProps?: AlertsSnackbarProps;
  };

  /**
   * Share settings configurations.
   */
  settings?: {
    /**
     * Default access count for shares.
     */
    defaultAccessCount?: number;

    /**
     * Maximum access count for shares.
     */
    maxAccessCount?: number;

    /**
     * Maximum expiration date for shares.
     */
    maxDate?: dayjs.Dayjs;

    /**
     * Default expiration date for shares.
     */
    defaultExpiresAt?: Date;
  };

  /**
   * Sender information for share notifications.
   */
  sender?: {
    /**
     * Email address of the sender.
     */
    email: string;

    /**
     * Name of the sender.
     */
    name?: string;
  };
}

/**
 * Props for customizing the alert snackbar. Internal component used within ShareFileViewer.
 */
export interface AlertsSnackbarProps {
  /**
   * Props for the `Snackbar` component.
   */
  SnackbarProps?: Partial<SnackbarProps>;

  /**
   * Props for the `Alert` component.
   */

  AlertProps?: Partial<AlertProps>;
}

/**
 * Namespace containing share object interfaces and types.
 */
export namespace ObjectStore {
  /**
   * Filter options for listing objects (files and folders).
   */
  export interface Filter {
    /**
     * Exact match for creation date. iso8601 format.
     */
    created_at?: string;
    /**
     * Created at greater than specified date. iso8601 format.
     */
    created_at__gt?: string;
    /**
     * Created at greater than or equal to specified date. iso8601 format.
     */
    created_at__gte?: string;
    /**
     * Created at less than specified date. iso8601 format.
     */
    created_at__lt?: string;
    /**
     * Created at less than or equal to specified date. iso8601 format.
     */
    created_at__lte?: string;

    /**
     * Exact match for update date. iso8601 format.
     */
    updated_at?: string;
    /**
     * Updated at greater than specified date. iso8601 format.
     */
    updated_at__gt?: string;
    /**
     * Updated at greater than or equal to specified date. iso8601 format.
     */
    updated_at__gte?: string;
    /**
     * Updated at less than specified date. iso8601 format.
     */
    updated_at__lt?: string;
    /**
     * Updated at less than or equal to specified date. iso8601 format.
     */
    updated_at__lte?: string;

    /**
     * Exact match for object type (file|folder)
     */
    type?: string;
    /**
     * Contains any of the specified types.
     */
    type__contains?: string[];
    /**
     * Matches any of the specified types.
     */
    type__in?: string[];

    /**
     * Exact match for object ID.
     */
    id?: string;
    /**
     * Contains any of the specified IDs.
     */
    id__contains?: string[];
    /**
     * Matches any of the specified IDs.
     */
    id__in?: string[];

    /**
     * Exact match for object name.
     */
    name?: string;
    /**
     * Contains any of the specified names.
     */
    name__contains?: string[];
    /**
     * Matches any of the specified names.
     */
    name__in?: string[];

    /**
     * Exact match for parent ID.
     */
    parent_id?: string;
    /**
     * Contains any of the specified parent IDs.
     */
    parent_id__contains?: string[];
    /**
     * Matches any of the specified parent IDs.
     */
    parent_id__in?: string[];

    /**
     * Exact match for object path.
     */
    path?: string;
    /**
     * Contains any of the specified paths.
     */
    path__contains?: string[];
    /**
     * Matches any of the specified paths.
     */
    path__in?: string[];

    /**
     * Filter by tags.
     */
    tags?: string[];

    /**
     * Additional filter parameters.
     */
    [key: string]: any;
  }

  /**
   * Request parameters for listing objects.
   */
  export interface ListRequest {
    /**
     * ID of the bucket to list objects from.
     */
    bucket_id?: string;

    /**
     * Filter criteria for the list.
     */
    filter?: Filter;

    /**
     * Cursor for pagination.
     */
    last?: string;
    /**
     * Maximum number of objects to return.
     */
    limit?: number;
    /**
     * Order of the results.
     */
    order?: string;
    /**
     * Field to order the results by.
     */
    order_by?: string;
  }

  export interface ShareSendParams {
    /**
     * Email address of the sender.
     */
    sender_email: string;
    /**
     * Name of the sender.
     */
    sender_name?: string;
  }

  /**
   * Request to create a single share link.
   */
  export interface SingleShareCreateRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * Targets (object IDs) to share.
     */
    targets?: string[];
    /**
     * Type of the share link.
     */
    link_type: string;
    /**
     * Expiration date of the share link.
     */
    expires_at?: string;
    /**
     * Maximum number of accesses allowed.
     */
    max_access_count?: number;

    /**
     * Authenticators required for accessing the share link.
     */
    authenticators?: ShareAuthenticator[];

    /**
     * Title of the share link.
     */
    title?: string;
    /**
     * Message associated with the share link.
     */
    message?: string;

    /**
     * Parameters for sending the share link.
     */
    send_params?: ShareSendParams;
  }

  /**
   * Represents a share link to send.
   */
  export interface ShareLinkToSend {
    /**
     * ID of the share link.
     */
    id: string;
    /**
     * Email address to send the share link to.
     */
    email: string;
  }

  /**
   * Request to send share links.
   */
  export interface ShareSendRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * List of share links to send.
     */
    links: ShareLinkToSend[];
    /**
     * Email address of the sender.
     */
    sender_email: string;
    /**
     * Name of the sender.
     */
    sender_name?: string;
  }

  /**
   * Response after sending share links.
   */
  export interface ShareSendResponse {
    /**
     * List of share link objects.
     */
    share_link_objects: ShareObjectResponse[];
  }

  /**
   * Request to create share links.
   */
  export interface ShareCreateRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * List of share links to create.
     */
    links: SingleShareCreateRequest[];
  }

  /**
   * Request to retrieve a share link.
   */
  export interface ShareGetRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * ID of the share link.
     */
    id: string;
  }

  /**
   * Request to delete share links.
   */
  export interface ShareDeleteRequest {
    /**
     * List of share link IDs to delete.
     */
    ids: string[];
  }

  /**
   * Response containing a single share object.
   */
  export interface ShareResponse {
    /**
     * The share link object.
     */
    object: ShareObjectResponse;
  }

  /**
   * Request parameters for listing share links.
   */
  export interface ShareListRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * Filter criteria for the list.
     */
    filter?: Filter;

    /**
     * Cursor for pagination.
     */
    last?: string;
    /**
     * Maximum number of share links to return.
     */
    limit?: number;
    /**
     * Order of the results.
     */
    order?: string;
    /**
     * Field to order the results by.
     */
    order_by?: string;
  }

  /**
   * Types of share authenticators.
   */
  export enum ShareAuthenticatorType {
    /**
     * Email One-Time Password authenticator.
     */
    Email = "email_otp",
    /**
     * SMS One-Time Password authenticator.
     */
    Sms = "sms_otp",
    /**
     * Password authenticator.
     */
    Password = "password",
  }

  /**
   * Represents a share authenticator.
   */
  export interface ShareAuthenticator {
    /**
     * Type of the authenticator. "password" | "email_otp" | "sms_otp"
     */
    auth_type: string; // "password" | "email_otp" | "sms_otp"
    /**
     * Context for the authenticator.
     */
    auth_context: string;
    /**
     * Recipient's email for notifications.
     */
    recipient_email?: string;
    /**
     * Recipient's phone number for SMS notifications.
     */
    phone_number?: string;
  }

  /**
   * Represents a recipient of a share.
   */
  export interface Recipient {
    /**
     * Phone number of the recipient.
     */
    phone_number: string;
    /**
     * Email address of the recipient.
     */
    email: string;
  }

  /**
   * Represents a share link response.
   */
  export interface ShareObjectResponse {
    /**
     * ID of the share link.
     */
    id: string;
    /**
     * Targets (object IDs) shared.
     */
    targets?: string[];
    /**
     * Type of the share link.
     */
    link_type?: string; // "upload" | "download" | "editor";
    /**
     * Current access count.
     */
    access_count?: number;
    /**
     * Maximum access count allowed.
     */
    max_access_count?: number;

    /**
     * Creation date of the share link.
     */
    created_at: string;
    /**
     * Expiration date of the share link.
     */
    expires_at: string;
    /**
     * Last accessed date of the share link.
     */
    last_accessed_at: string;

    /**
     * Authenticators required for accessing the share link.
     */
    authenticators?: ShareAuthenticator[];

    /**
     * URL of the share link.
     */
    link?: string;

    /**
     * Recipient's email address.
     */
    recipient_email?: string;
    /**
     * Sender's email address.
     */
    sender_email?: string;
    /**
     * Sender's name.
     */
    sender_name?: string;

    /**
     * ID of the storage pool.
     */
    storage_pool_id?: string;
  }

  /**
   * Response after retrieving a share link.
   */
  export interface ShareGetResponse {
    /**
     * The share link object.
     */
    share_link_object: ShareObjectResponse;
  }

  /**
   * Response containing multiple share objects.
   */
  export interface SharesObjectResponse {
    /**
     * List of share link objects.
     */
    share_link_objects: ShareObjectResponse[];
  }

  /**
   * Types of share links.
   */
  export enum ShareLinkType {
    /**
     * Share link for uploading.
     */
    Upload = "upload",
    /**
     * Share link for downloading.
     */
    Download = "download",
    /**
     * Share link for editing.
     */
    Editor = "editor",
  }

  /**
   * Response after listing share links.
   */
  export interface ShareListResponse {
    /**
     * Total count of share links.
     */
    count: number;
    /**
     * Cursor for pagination.
     */
    last: string;
    /**
     * List of share link objects.
     */
    share_link_objects: ShareObjectResponse[];
  }

  /**
   * Types of objects in the object store.
   */
  export enum ObjectType {
    /**
     * Represents a folder.
     */
    Folder = "folder",
    /**
     * Represents a file.
     */
    File = "file",
  }

  /**
   * Represents an object in the object store.
   */
  export interface ObjectResponse {
    /**
     * ID of the object.
     */
    id: string;
    /**
     * Name of the object.
     */
    name: string;
    /**
     * Owner of the object.
     */
    owner?: string;

    /**
     * Creation date of the object.
     */
    created_at: string;
    /**
     * Last updated date of the object.
     */
    updated_at: string;

    /**
     * ID of the parent folder.
     */
    parent_id?: string;
    /**
     * Folder path of the object.
     */
    folder?: string;
    /**
     * Full path of the object.
     */
    path?: string;

    /**
     * Billable size of the object.
     */
    billable_size: number;
    /**
     * Actual size of the object.
     */
    size: number;

    /**
     * MD5 checksum in hexadecimal.
     */
    md5_hex?: string;
    /**
     * SHA-256 checksum in hexadecimal.
     */
    sha256_hex?: string;
    /**
     * SHA-512 checksum in hexadecimal.
     */
    sha512_hex?: string;

    /**
     * Custom metadata of the object.
     */
    metadata?: Record<string, any>;
    /**
     * Tags associated with the object.
     */
    tags?: string[];

    /**
     * Type of the object.
     */
    type: string | ObjectType; // "folder", "file", etc.

    /**
     * Destination URL for the object (added from get).
     */
    dest_url?: string;

    /**
     * Protected metadata of the object.
     */
    metadata_protected?: {
      /**
       * Format of the object.
       */
      format?: string;
      /**
       * MIME type of the object.
       */
      mimetype?: string;

      /**
       * Password algorithm used in the vault.
       */
      "vault-password-algorithm"?: string;
    };

    /**
     * Internal. Format of the object (flattened from `metadata_protected`).
     */
    format?: string;
    /**
     * Internal. MIME type of the object (flattened from `metadata_protected`).
     */
    mimetype?: string;
    /**
     * Internal. Password algorithm used in the vault (flattened from `metadata_protected`).
     */
    "vault-password-algorithm"?: string;
  }

  /**
   * Response after listing objects.
   */
  export interface ListResponse {
    /**
     * Total count of objects.
     */
    count: number;
    /**
     * Cursor for pagination.
     */
    last: string;
    /**
     * List of objects.
     */
    objects: ObjectResponse[];
  }

  /**
   * Request parameters for uploading an object.
   */
  export interface PutRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * ID of the object (optional).
     */
    id?: string;

    /**
     * Name of the object.
     */
    name: string;

    /**
     * ID of the parent folder.
     */
    parent_id?: string;
    /**
     * Path of the object.
     */
    path?: string;

    /**
     * Custom metadata for the object.
     */
    metadata?: Record<string, any>;
    /**
     * Tags to associate with the object.
     */
    tags?: string[];

    /**
     * Type of the object ("folder", "file", etc.).
     */
    type?: string;

    /**
     * Size of the object (optional).
     */
    size?: number;

    /**
     * Password for encrypting the object.
     */
    password?: string;
    /**
     * Algorithm used for password encryption.
     */
    password_algorithm?: "AES-CFB-128" | "AES-CFB-256";
  }

  /**
   * Response after uploading an object.
   */
  export interface PutResponse {
    /**
     * The uploaded object.
     */
    object: ObjectResponse;
  }

  /**
   * Request to create a new folder.
   */
  export interface FolderCreateRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * Name of the folder.
     */
    name: string;
    /**
     * Path where the folder will be created.
     */
    path?: string;

    /**
     * ID of the parent folder.
     */
    parent_id?: string;

    /**
     * Custom metadata for the folder.
     */
    metadata?: Record<string, any>;
    /**
     * Tags to associate with the folder.
     */
    tags?: string[];
  }

  /**
   * Response after creating a folder.
   */
  export interface FolderCreateResponse {
    /**
     * The created folder object.
     */
    object: ObjectResponse;
  }

  /**
   * Request to update an object.
   */
  export interface UpdateRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * ID of the object to update.
     */
    id: string;

    /**
     * New name for the object.
     */
    name?: string;
    /**
     * New parent ID for the object.
     */
    parent_id?: string;
    /**
     * New path for the object.
     */
    path?: string;

    /**
     * New metadata for the object.
     */
    metadata?: Record<string, any>;
    /**
     * New tags for the object.
     */
    tags?: string[];

    /**
     * Password to add for the object.
     */
    add_password?: string;
    /**
     * Algorithm for the added password.
     */
    add_password_algorithm?: "AES-CFB-128" | "AES-CFB-256";

    /**
     * Password to remove from the object.
     */
    remove_password?: string;
  }

  /**
   * Response after updating an object.
   */
  export interface UpdateResponse {}

  /**
   * Request to delete an object.
   */
  export interface DeleteRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * ID of the object to delete.
     */
    id?: string;
    /**
     * Path of the object to delete.
     */
    path?: string;

    /**
     * Force deletion even if there are child objects.
     */
    force?: boolean;
  }

  /**
   * Response after deleting objects.
   */
  export interface DeleteResponse {
    /**
     * Number of objects deleted.
     */
    count: number;

    /**
     * Objects that were deleted.
     */
    objects: ObjectResponse;
  }

  /**
   * Request to retrieve an object.
   */
  export interface GetRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * ID of the object to retrieve.
     */
    id: string;
    /**
     * Path of the object to retrieve (optional).
     */
    path?: string;

    /**
     * Method of transfer ("direct", "multipart").
     */
    transfer_method?: string;

    /**
     * Password for decrypting the object.
     */
    password?: string;
  }

  /**
   * Response after retrieving an object.
   */
  export interface GetResponse {
    /**
     * Destination URL for the object.
     */
    dest_url?: string;
    /**
     * The retrieved object.
     */
    object: ObjectResponse;
  }

  /**
   * Request to retrieve an archive of objects.
   */
  export interface GetArchiveRequest {
    /**
     * ID of the bucket.
     */
    bucket_id?: string;

    /**
     * IDs of the objects to include in the archive.
     */
    ids: string[];
    /**
     * Format of the archive ("tar", "zip").
     */
    format?: string;
    /**
     * Method of transfer ("direct", "multipart").
     */
    transfer_method?: string;
  }

  /**
   * Response after retrieving an archive.
   */
  export interface GetArchiveResponse {
    /**
     * Destination URL for the archive.
     */
    dest_url: string;
    /**
     * List of objects included in the archive.
     */
    objects: ObjectResponse[];
  }

  /**
   * Request to list buckets.
   */
  export interface BucketsRequest {}

  /**
   * Represents information about a bucket.
   */
  export interface BucketInfo {
    /**
     * ID of the bucket.
     */
    id: string;
    /**
     * Name of the bucket.
     */
    name: string;
    /**
     * Supported transfer methods.
     */
    transfer_methods?: string[];
    /**
     * Whether this bucket is the default.
     */
    default?: boolean;
  }

  /**
   * Response after listing buckets.
   */
  export interface BucketsResponse {
    /**
     * List of buckets.
     */
    buckets: BucketInfo[];
  }
}
