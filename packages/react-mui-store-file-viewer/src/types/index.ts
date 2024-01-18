import { PasswordPolicy } from "@pangeacyber/react-mui-shared";

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
    filter?: Filter;

    last?: string;
    limit?: number;
    order?: string;
    order_by?: string;
  }

  export interface SingleShareCreateRequest {
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
    links: ShareLinkToSend[];
    from_prefix: string;
  }

  export interface ShareSendResponse {
    // Incomplete share_link_objects (missing id)
    share_link_objects: ShareObjectResponse[];
  }

  export interface ShareCreateRequest {
    links: SingleShareCreateRequest[];
  }

  export interface ShareGetRequest {
    id: string;
  }

  export interface ShareDeleteRequest {
    ids: string[];
  }

  export interface ShareResponse {
    object: ShareObjectResponse;
  }

  export interface ShareListRequest {
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
  }

  export interface ShareObjectResponse {
    id: string;
    targets?: string[];
    link_type?: string; // "upload" | "download";
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
    };

    // Internal from flattenning metadata_protected
    format?: string;
    mimetype?: string;
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
    id: string;

    name?: string;
    parent_id?: string;
    path?: string;

    metadata?: Record<string, any>;
    tags?: string[];
  }

  export interface UpdateResponse {}

  export interface DeleteRequest {
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
    id: string;
    path?: string; // Optional?

    // ?
    transfer_method?: string; // direct, multipart
  }

  export interface GetResponse {
    dest_url?: string;
    object: ObjectResponse;
  }

  export interface GetArchiveRequest {
    ids: string[];
    format?: string; // tar, zip
    transfer_method?: string; // direct, multipart
  }

  export interface GetArchiveResponse {
    dest_url: string;
    objects: ObjectResponse[];
  }
}
