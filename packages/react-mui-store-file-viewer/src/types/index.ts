import { PasswordPolicy } from "@pangeacyber/react-mui-shared";
import { AlertsSnackbarProps } from "../components/AlertSnackbar";
import dayjs from "dayjs";
export interface PangeaResponse<T = any> {
  request_id: string;
  status: string;
  summary: string;
  result: T;
}

export interface PangeaError {
  request_id: string;
  summary: string;
  status: string;
}

export interface StoreProxyApiRef {
  list:
    | ((
        data: ObjectStore.ListRequest
      ) => Promise<PangeaResponse<ObjectStore.ListResponse>>)
    | undefined;
  get:
    | ((
        data: ObjectStore.GetRequest
      ) => Promise<PangeaResponse<ObjectStore.GetResponse>>)
    | undefined;

  buckets?:
    | ((
        data: ObjectStore.BucketsRequest
      ) => Promise<PangeaResponse<ObjectStore.BucketsResponse>>)
    | undefined;

  getArchive?:
    | ((
        data: ObjectStore.GetArchiveRequest
      ) => Promise<PangeaResponse<ObjectStore.GetArchiveResponse>>)
    | undefined;

  share?: {
    list?: (
      data: ObjectStore.ListRequest
    ) => Promise<PangeaResponse<ObjectStore.ShareListResponse>>;
    get?: (
      data: ObjectStore.ShareGetRequest
    ) => Promise<PangeaResponse<ObjectStore.ShareObjectResponse>>;
    delete?: (data: ObjectStore.ShareDeleteRequest) => Promise<PangeaResponse>;
    create?: (
      data: ObjectStore.ShareCreateRequest
    ) => Promise<PangeaResponse<ObjectStore.SharesObjectResponse>>;
    send?: (
      data: ObjectStore.ShareSendRequest
    ) => Promise<PangeaResponse<ObjectStore.ShareSendResponse>>;
  };

  delete?: (
    data: ObjectStore.DeleteRequest
  ) => Promise<PangeaResponse<ObjectStore.DeleteResponse>>;
  update?: (
    data: ObjectStore.UpdateRequest
  ) => Promise<PangeaResponse<ObjectStore.UpdateResponse>>;

  upload?: (
    data: FormData,
    contentType: "multipart/form-data"
  ) => Promise<PangeaResponse<ObjectStore.PutResponse>>;
  folderCreate?: (
    data: ObjectStore.FolderCreateRequest
  ) => Promise<PangeaResponse<ObjectStore.FolderCreateResponse>>;
}

export interface StoreConfigurations {
  passwordPolicy?: PasswordPolicy;
  alerts?: {
    displayAlertOnError: boolean;
    AlertSnackbarProps?: AlertsSnackbarProps;
  };
  settings?: {
    defaultAccessCount?: number;
    maxAccessCount?: number;
    maxDate?: dayjs.Dayjs;
    defaultExpiresAt?: Date;
  };
}

export namespace ObjectStore {
  export interface Filter {
    created_at?: string;
    created_at__gt?: string;
    created_at__gte?: string;
    created_at__lt?: string;
    created_at__lte?: string;

    updated_at?: string;
    updated_at__gt?: string;
    updated_at__gte?: string;
    updated_at__lt?: string;
    updated_at__lte?: string;

    type?: string;
    type__contains?: string[];
    type__in?: string[];

    id?: string;
    id__contains?: string[];
    id__in?: string[];

    name?: string;
    name__contains?: string[];
    name__in?: string[];

    parent_id?: string;
    parent_id__contains?: string[];
    parent_id__in?: string[];

    path?: string;
    path__contains?: string[];
    path__in?: string[];

    tags?: string[];

    // metadata__{key}?: string
    // metadata__{key}__contains?: string[]
    // metadata__{key}__exists?: boolean;

    [key: string]: any;
  }

  /**
     * type APIListInput struct {
            Filter  json.RawMessage `json:"filter"`
            Last    []byte          `json:"last"`     // Last field for pagination.
            Limit   int             `json:"limit"`    // Maximum results to return in the first page.
            Order   string          `json:"order"`    // asc, desc
            OrderBy string          `json:"order_by"` // billable_size, created_at, md5_hex, owner, sha256_hex, size, type, updated_at
        }
    */

  export interface ListRequest {
    bucket_id?: string;

    filter?: Filter;

    last?: string;
    limit?: number;
    order?: string;
    order_by?: string;
  }

  export interface SingleShareCreateRequest {
    bucket_id?: string;

    targets?: string[];
    link_type: string;
    expires_at?: string;
    max_access_count?: number;

    authenticators?: ShareAuthenticator[];

    title?: string;
    message?: string;
  }

  export interface ShareLinkToSend {
    id: string;
    email: string;
  }

  export interface ShareSendRequest {
    bucket_id?: string;

    links: ShareLinkToSend[];
    sender_email: string;
    sender_name?: string;
  }

  export interface ShareSendResponse {
    // Incomplete share_link_objects (missing id)
    share_link_objects: ShareObjectResponse[];
  }

  export interface ShareCreateRequest {
    bucket_id?: string;

    links: SingleShareCreateRequest[];
  }

  export interface ShareGetRequest {
    bucket_id?: string;

    id: string;
  }

  export interface ShareDeleteRequest {
    ids: string[];
  }

  export interface ShareResponse {
    object: ShareObjectResponse;
  }

  export interface ShareListRequest {
    bucket_id?: string;

    filter?: Filter;

    last?: string;
    limit?: number;
    order?: string;
    order_by?: string;
  }

  export enum ShareAuthenticatorType {
    Email = "email_otp",
    Sms = "sms_otp",
    Password = "password",
  }

  export interface ShareAuthenticator {
    auth_type: string; // "password" | "email_otp" | "sms_otp"
    auth_context: string;
    notify_email?: string; // holds email for sms/password notification
    phone_number?: string; // holds phone number for sms
  }

  export interface Recipient {
    phone_number: string;
    email: string;
  }

  export interface ShareObjectResponse {
    id: string;
    targets?: string[];
    link_type?: string; // "upload" | "download" | "editor";
    access_count?: number;
    max_access_count?: number;

    created_at: string;
    expires_at: string;
    last_accessed_at: string;

    authenticators?: ShareAuthenticator[];

    link: string;

    sent?: boolean; // FIXME: Unknown on this

    storage_pool_id?: string;
  }

  export interface SharesObjectResponse {
    share_link_objects: ShareObjectResponse[];
  }

  export enum ShareLinkType {
    Upload = "upload",
    Download = "download",
    Editor = "editor",
  }

  export interface ShareListResponse {
    count: number;
    last: string;
    share_link_objects: ShareObjectResponse[];
  }

  /**
     * type APIListInput struct {
            Filter  json.RawMessage `json:"filter"`
            Last    []byte          `json:"last"`     // Last field for pagination.
            Limit   int             `json:"limit"`    // Maximum results to return in the first page.
            Order   string          `json:"order"`    // asc, desc
            OrderBy string          `json:"order_by"` // billable_size, created_at, md5_hex, owner, sha256_hex, size, type, updated_at
        }

        type APIListOutputObject struct {
            BillableSize int64             `json:"billable_size"`
            CreatedAt    time.Time         `json:"created_at"`
            ID           string            `json:"id"`
            MD5Hex       string            `json:"md5_hex"`
            Metadata     map[string]string `json:"metadata"`
            Name         string            `json:"name"`
            Owner        string            `json:"owner"`
            ParentID     string            `json:"parent_id,omitempty"`
            SHA256Hex    string            `json:"sha256_hex"`
            SHA512Hex    string            `json:"sha512_hex"`
            Size         int64             `json:"size"`
            Tags         []string          `json:"tags"`
            Type         string            `json:"type"`
            UpdatedAt    time.Time         `json:"updated_at"`
        }
    */

  export enum ObjectType {
    Folder = "folder",
    File = "file",
  }

  export interface ObjectResponse {
    id: string;
    name: string;
    owner?: string;

    created_at: string;
    updated_at: string;

    // Different than vault... no parent path
    parent_id?: string;
    folder?: string;
    path?: string;

    billable_size: number;
    size: number;

    md5_hex?: string;
    sha256_hex?: string;
    sha512_hex?: string;

    metadata?: Record<string, any>;
    tags?: string[];

    type: string | ObjectType; // "folder", "" ...

    dest_url?: string; // Added from get

    metadata_protected?: {
      format?: string;
      mimetype?: string;

      "vault-password-algorithm"?: string;
    };

    // Internal from flattenning metadata_protected
    format?: string;
    mimetype?: string;
    "vault-password-algorithm"?: string;
  }

  export interface ListResponse {
    count: number;
    last: string;
    objects: ObjectResponse[];
  }

  /**
     * multi-part upload request
     * type APIPutInput struct {
            ID string `json:"id"`

            // NOTE: No way to accept bucket here, it comes from service config -> resource.
            Name     string `json:"name"`
            ParentID string `json:"parent_id"`
            Path     string `json:"path"`

            MD5       []byte            `json:"md5"`
            MD5Hex    string            `json:"md5_hex"`
            Metadata  map[string]string `json:"metadata"`
            SHA256    []byte            `json:"sha256"`
            SHA256Hex string            `json:"sha256_hex"`
            SHA512    []byte            `json:"sha512"`
            SHA512Hex string            `json:"sha512_hex"`
            Size      *int64            `json:"size"`
            Tags      []string          `json:"tags"`
            Type      string            `json:"type"` // dir, file
        }
     */

  export interface PutRequest {
    bucket_id?: string;

    // TODO: Why is an id accepted?
    id?: string;

    name: string;

    // TODO: Why is there parent_id and path
    parent_id?: string;
    path?: string;

    metadata?: Record<string, any>;
    tags?: string[];

    // TODO: Why is this different than Vault
    type?: string; // "folder, file"

    // TODO: Why is this needed in request?
    size?: number;

    password?: string;
    password_algorithm?: "AES-CFB-128" | "AES-CFB-256";
  }

  export interface PutResponse {
    object: ObjectResponse;
  }

  /**
     * type APIFolderCreateInput struct {
            Name     string            `json:"name"`
            ParentID string            `json:"parent_id"`
            Path     string            `json:"path"`
            Metadata map[string]string `json:"metadata"`
            Tags     []string          `json:"tags"`
        }

        type APIFolderCreateOutput struct {
            Object APIObject `json:"object"`
        }
     */

  export interface FolderCreateRequest {
    bucket_id?: string;

    name: string;
    path?: string;

    parent_id?: string;

    metadata?: Record<string, any>;
    tags?: string[];
  }

  export interface FolderCreateResponse {
    object: ObjectResponse;
  }

  export interface UpdateRequest {
    bucket_id?: string;

    id: string;

    name?: string;
    parent_id?: string;
    path?: string;

    metadata?: Record<string, any>;
    tags?: string[];

    add_password?: string;
    add_password_algorithm?: "AES-CFB-128" | "AES-CFB-256";

    remove_password?: string;
  }

  export interface UpdateResponse {}

  export interface DeleteRequest {
    bucket_id?: string;

    id?: string;
    path?: string;

    force?: boolean;
  }

  export interface DeleteResponse {
    count: number;

    // Note: If this is needed
    objects: ObjectResponse;
  }

  /**
     * type APIGetInput struct {
            ID             string `json:"id"`
            Path           string `json:"path"`
            TransferMethod string `json:"transfer_method"` // direct, multipart
        }
     */

  export interface GetRequest {
    bucket_id?: string;

    id: string;
    path?: string; // Optional?

    // ?
    transfer_method?: string; // direct, multipart

    password?: string;
  }

  export interface GetResponse {
    dest_url?: string;
    object: ObjectResponse;
  }

  export interface GetArchiveRequest {
    bucket_id?: string;

    ids: string[];
    format?: string; // tar, zip
    transfer_method?: string; // direct, multipart
  }

  export interface GetArchiveResponse {
    dest_url: string;
    objects: ObjectResponse[];
  }

  export interface BucketsRequest {}

  export interface BucketInfo {
    id: string;
    name: string;
    transfer_methods?: string[];
    default?: boolean;
  }

  export interface BucketsResponse {
    buckets: BucketInfo[];
  }
}
