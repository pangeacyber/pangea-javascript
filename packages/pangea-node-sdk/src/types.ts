import { Signer } from "./utils/signer.js";

/**
 * PangeaConfig options
 */
export interface ConfigOptions {
  /** Pangea API domain. */
  domain?: string;

  /**
   * Pangea environment.
   *
   * This is intended to facilitate SDK development and should not be touched in
   * everyday usage.
   */
  environment?: ConfigEnv;

  /** Config ID for multi-config projects. */
  configID?: string;

  /**
   * Whether or not to perform requests via plain HTTP, as opposed to secure
   * HTTPS.
   */
  insecure?: boolean;

  /** How many times a request should be retried on failure. */
  requestRetries?: number;

  /** Maximum allowed time (in milliseconds) for a request to complete. */
  requestTimeout?: number;

  /** Whether or not queued request retries are enabled. */
  queuedRetryEnabled?: boolean;

  /** Timeout for polling results after a HTTP/202 (in milliseconds). */
  pollResultTimeoutMs?: number;

  /** How many queued request retries there should be on failure. */
  queuedRetries?: number;

  /** User-Agent string to append to the default one. */
  customUserAgent?: string;
}

export type PangeaToken = string | ({ type: "pangea_token" } & Vault.GetResult);

export interface PostOptions {
  pollResultSync?: boolean;
  files?: FileItems;
}

export enum ConfigEnv {
  LOCAL = "local",
  PRODUCTION = "production",
}

export enum TransferMethod {
  MULTIPART = "multipart",
  POST_URL = "post-url",
  PUT_URL = "put-url",
  SOURCE_URL = "source-url",
  DEST_URL = "dest-url",
}

export interface FileUploadParams {
  size: number;
  crc32c: string;
  sha256: string;
}

export interface Dictionary {
  [key: string]: string | boolean | number | Dictionary;
}

export interface FileData {
  file: Buffer | string;
  name: string;
  file_details?: Dictionary;
}

export interface FileUploadParams {
  size: number;
  crc32c: string;
  sha256: string;
}

export interface FileItems {
  [key: string]: FileData;
}

export interface AcceptedResult {
  ttl_mins: number;
  retry_counter: number;
  location: string;
  post_url?: string;
  put_url?: string;
  post_form_data?: Dictionary;
}

/**
 * Secure Audit interface definitions
 */
export namespace Audit {
  export interface LogOptions {
    verbose?: boolean;
    signer?: Signer;
    skipEventVerification?: boolean;
    verify?: boolean;
    publicKeyInfo?: Object; // Key:Value object
  }

  export interface LogEvent {
    event: Audit.Event;
    signature?: string;
    public_key?: string;
  }

  export interface LogRequestCommon {
    verbose?: boolean;
  }

  export interface LogData extends LogEvent, LogRequestCommon {
    event: Audit.Event;
    prev_root?: string;
  }

  export interface LogBulkRequest extends LogRequestCommon {
    events: Audit.LogEvent[];
  }

  export interface Event {
    [key: string]: Object | string | boolean | number | Date;
  }

  export interface EventEnvelope {
    event: Event;
    signature?: string;
    public_key?: string;
    received_at: string;
  }

  export interface AuditRecord {
    envelope: Audit.EventEnvelope;
    hash: string;
    membership_proof?: string;
    published?: boolean;
    leaf_index?: string;
    consistency_verification?: string;
    membership_verification?: string;
    signature_verification?: string;
    fpe_context?: string;
  }

  export interface Root {
    url?: string;
    published_at?: string;
    size: number;
    root_hash: string;
    consistency_proof: string[];
    tree_name: string;
  }

  export interface LogResponse {
    hash: string;
    envelope: Audit.EventEnvelope;
    unpublished_root?: string;
    membership_proof?: string;
    consistency_proof?: string[];
    consistency_verification?: string;
    membership_verification?: string;
    signature_verification?: string;
  }

  export interface LogBulkResponse {
    results: LogResponse[];
  }

  export interface SearchOptions {
    verifyConsistency?: boolean;
    skipEventVerification?: boolean;
  }

  export interface SearchResponse {
    id: string;
    expires_at: string;
    count: number;
    events: Audit.AuditRecord[];
    root?: Root;
    unpublished_root?: Root;
  }

  export interface SearchRestriction {
    actor?: Array<string>;
    action?: Array<string>;
    source?: Array<string>;
    status?: Array<string>;
    target?: Array<string>;
  }

  export interface SearchParamsOptions {
    limit?: number;
    max_results?: number;
    start?: string;
    end?: string;
    order?: string;
    order_by?: string;
    search_restriction?: Audit.SearchRestriction;
    verbose?: boolean;
    return_context?: boolean;
  }

  export interface SearchParams extends SearchParamsOptions {
    query: string;
  }

  export interface RootParams {
    tree_size?: number;
  }

  export interface ResultOptions {
    assert_search_restriction?: Audit.SearchRestriction;
    return_context?: boolean;
  }

  export interface ResultResponse {
    events: AuditRecord[];
    count: number;
    root?: Root;
  }

  export interface RootRequest {
    tree_size?: number;
  }

  export interface RootResult extends Root {
    data: Root;
  }

  export enum DownloadFormat {
    /** JSON. */
    JSON = "json",

    /** CSV. */
    CSV = "csv",
  }

  export interface DownloadRequest {
    /** ID returned by the export API. */
    request_id?: string;

    /** ID returned by the search API. */
    result_id?: string;

    /** Format for the records. */
    format?: DownloadFormat;

    /** Return the context data needed to decrypt secure audit events that have been redacted with format preserving encryption. */
    return_context?: boolean;
  }

  export interface DownloadResult {
    /**
     * URL where search results can be downloaded.
     */
    dest_url: string;
  }

  export interface ExportRequest {
    /** Format for the records. */
    format?: DownloadFormat;

    /** The start of the time range to perform the search on. */
    start?: string;

    /**
     * The end of the time range to perform the search on. If omitted, then all
     * records up to the latest will be searched.
     */
    end?: string;

    /** Name of column to sort the results by. */
    order_by?: string;

    /** Specify the sort order of the response. */
    order?: "asc" | "desc";

    /**
     * Whether or not to include the root hash of the tree and the membership
     * proof for each record.
     */
    verbose?: boolean;
  }
}

export namespace AIGuard {
  export interface RedactEntityResult {
    /** Detected redaction rules. */
    entities: {
      /** The action taken on this Entity */
      action: string;
      redacted: boolean;
      start_pos?: number;
      type: string;
      value: string;
    }[];
  }

  /** Additional fields to include in activity log */
  export interface LogFields {
    /** Origin or source application of the event */
    citations?: string;

    /** Stores supplementary details related to the event */
    extra_info?: string;

    /** Model used to perform the event */
    model?: string;

    /** IP address of user or app or agent */
    source?: string;

    /** Tools used to perform the event */
    tools?: string;
  }

  export interface MaliciousEntity {
    raw?: Record<string, unknown>;
    action: string;
    start_pos?: number;
    type: string;
    value: string;
  }

  export interface Detector<T> {
    detected: boolean | null;
    data: T | null;
  }

  // This is named "prompt injection" in the API spec even though it is also
  // used for many other detectors.
  export type PromptInjectionAction = "report" | "block";

  export type MaliciousEntityAction =
    | "report"
    | "defang"
    | "disabled"
    | "block";

  // This is named "PII entity" in the API spec even though it is also used for
  // the secrets detector.
  export type PiiEntityAction =
    | "disabled"
    | "report"
    | "block"
    | "mask"
    | "partial_masking"
    | "replacement"
    | "hash"
    | "fpe";

  export interface TextGuardRequest {
    /**
     * Recipe key of a configuration of data types and settings defined in the
     * Pangea User Console. It specifies the rules that are to be applied to the
     * text, such as defang malicious URLs.
     */
    recipe?: "pangea_prompt_guard" | (string & Record<never, never>);

    /**
     * Setting this value to true will provide a detailed analysis of the text
     * data
     */
    debug?: boolean;

    overrides?: {
      code_detection?: { disabled?: boolean; action?: "report" | "block" };
      language_detection?:
        | { disabled: boolean }
        | { allow: string[] }
        | { block: string[] }
        | { report: string[] };
      topic_detection?: { disabled: boolean } | { block_list: string[] };
      prompt_injection?: { disabled?: boolean; action?: PromptInjectionAction };
      selfharm?: { disabled?: boolean; action?: PromptInjectionAction };
      gibberish?: { disabled?: boolean; action?: PromptInjectionAction };
      roleplay?: { disabled?: boolean; action?: PromptInjectionAction };
      sentiment?: { disabled?: boolean; action?: PromptInjectionAction };
      malicious_entity?: {
        disabled?: boolean;
        ip_address?: MaliciousEntityAction;
        url?: MaliciousEntityAction;
        domain?: MaliciousEntityAction;
      };
      pii_entity?: {
        disabled?: boolean;
        email_address?: PiiEntityAction;
        nrp?: PiiEntityAction;
        location?: PiiEntityAction;
        person?: PiiEntityAction;
        phone_number?: PiiEntityAction;
        date_time?: PiiEntityAction;
        ip_address?: PiiEntityAction;
        url?: PiiEntityAction;
        money?: PiiEntityAction;
        credit_card?: PiiEntityAction;
        crypto?: PiiEntityAction;
        iban_code?: PiiEntityAction;
        us_bank_number?: PiiEntityAction;
        nif?: PiiEntityAction;
        "fin/nric"?: PiiEntityAction;
        au_abn?: PiiEntityAction;
        au_acn?: PiiEntityAction;
        au_tfn?: PiiEntityAction;
        medical_license?: PiiEntityAction;
        uk_nhs?: PiiEntityAction;
        au_medicare?: PiiEntityAction;
        us_drivers_license?: PiiEntityAction;
        us_itin?: PiiEntityAction;
        us_passport?: PiiEntityAction;
        us_ssn?: PiiEntityAction;
      };
      secrets_detection?: {
        disabled?: boolean;
        slack_token?: PiiEntityAction;
        rsa_private_key?: PiiEntityAction;
        ssh_dsa_private_key?: PiiEntityAction;
        ssh_ec_private_key?: PiiEntityAction;
        pgp_private_key_block?: PiiEntityAction;
        amazon_aws_access_key_id?: PiiEntityAction;
        amazon_aws_secret_access_key?: PiiEntityAction;
        amazon_mws_auth_token?: PiiEntityAction;
        facebook_access_token?: PiiEntityAction;
        github_access_token?: PiiEntityAction;
        jwt_token?: PiiEntityAction;
        google_api_key?: PiiEntityAction;
        google_cloud_platform_api_key?: PiiEntityAction;
        google_drive_api_key?: PiiEntityAction;
        google_cloud_platform_service_account?: PiiEntityAction;
        google_gmail_api_key?: PiiEntityAction;
        youtube_api_key?: PiiEntityAction;
        mailchimp_api_key?: PiiEntityAction;
        mailgun_api_key?: PiiEntityAction;
        basic_auth?: PiiEntityAction;
        picatic_api_key?: PiiEntityAction;
        slack_webhook?: PiiEntityAction;
        stripe_api_key?: PiiEntityAction;
        stripe_restricted_api_key?: PiiEntityAction;
        square_access_token?: PiiEntityAction;
        square_oauth_secret?: PiiEntityAction;
        twilio_api_key?: PiiEntityAction;
        pangea_token?: PiiEntityAction;
      };
    };

    /** Additional fields to include in activity log */
    log_fields?: LogFields;
  }

  export interface TextGuardResult<T> {
    /** Result of the recipe analyzing and input prompt. */
    detectors: {
      prompt_injection: Detector<{
        /** The action taken by this Detector */
        action: string;

        /** Triggered prompt injection analyzers. */
        analyzer_responses: { analyzer: string; confidence: number }[];
      }>;
      pii_entity?: Detector<RedactEntityResult>;
      malicious_entity?: Detector<{
        /** Detected harmful items. */
        entities: MaliciousEntity[];
      }>;
      custom_entity?: Detector<RedactEntityResult>;
      secrets_detection?: Detector<RedactEntityResult>;
      profanity_and_toxicity?: Detector<RedactEntityResult>;
      language_detection?: Detector<{
        /** The action taken by this Detector */
        action: string;
        language: string;
      }>;
      topic_detection?: Detector<{
        /** The action taken by this Detector */
        action: string;
      }>;
      code_detection?: Detector<{
        /** The action taken by this Detector */
        action: string;
        language: string;
      }>;
    };

    /** Updated prompt text, if applicable. */
    prompt_text?: string;

    /** Updated structured prompt, if applicable. */
    prompt_messages?: T;

    /** Whether or not the prompt triggered a block detection. */
    blocked: boolean;

    /** The Recipe that was used. */
    recipe: string;

    /**
     * If an FPE redaction method returned results, this will be the context
     * passed to unredact.
     */
    fpe_context?: string;
  }
}

export namespace PromptGuard {
  export interface Message {
    role: string;
    content: string;
  }

  export interface Classification {
    /** Classification category */
    category: string;

    /** Classification detection result */
    detected: boolean;

    /** Confidence score for the classification */
    confidence: number;
  }

  export interface GuardRequest {
    /**
     * Prompt content and role array. The content is the text that will be
     * analyzed for redaction.
     */
    messages: readonly Message[];

    /** Specific analyzers to be used in the call */
    analyzers?: readonly string[];

    /** Boolean to enable classification of the content */
    classify?: boolean;
  }

  export interface GuardResult {
    /** Boolean response for if the prompt was considered malicious or not */
    detected: boolean;

    /** Type of analysis, either direct or indirect */
    type: "direct" | "indirect" | "";

    /** Prompt Analyzers for identifying and rejecting properties of prompts */
    analyzer?: string;

    /** Percent of confidence in the detection result, ranging from 0 to 100 */
    confidence: number;

    /** Extra information about the detection result */
    info?: string;

    /** List of classification results with labels and confidence scores */
    classifications: Classification[];
  }
}

export namespace Redact {
  export interface TextResult {
    /** The redacted text */
    redacted_text?: string;

    /** Number of redactions present in the text */
    count: number;

    /**
     * If an FPE redaction method returned results, this will be the context
     * passed to unredact.
     */
    fpe_context?: string;
  }

  export interface StructuredResult {
    /** The redacted data */
    redacted_data?: object;

    /** Number of redactions present in the data */
    count: number;

    /**
     * If an FPE redaction method returned results, this will be the context
     * passed to unredact.
     */
    fpe_context?: string;
  }

  export interface Options {
    /**
     * Setting this value to true will provide a detailed analysis of the
     * redacted data and the rules that caused redaction
     */
    debug?: boolean;

    /** An array of redact rule short names */
    rules?: string[];

    /** An array of redact ruleset short names */
    rulesets?: string[];

    /**
     * Setting this value to false will omit the redacted result only returning
     * count
     */
    return_result?: boolean;

    /**
     * This field allows users to specify the redaction method per rule and its
     * various parameters.
     */
    redaction_method_overrides?: {
      [rule: string]:
        | { redaction_type: "mask" | "detect_only" }
        | { redaction_type: "replacement"; redaction_value: string }
        | { redaction_type: "partial_masking"; partial_masking: PartialMasking }
        | {
            redaction_type: "hash";
            hash?: {
              /** The type of hashing algorithm */
              hash_type: "md5" | "sha256";
            };
          }
        | {
            redaction_type: "fpe";
            fpe_alphabet?:
              | "numeric"
              | "alphalower"
              | "alphaupper"
              | "alpha"
              | "alphanumericlower"
              | "alphanumericupper"
              | "alphanumeric";
            fpe_tweak_vault_secret_id?: string;
            fpe_tweak?: string;
          };
    };
    vault_parameters?: VaultParameters;

    /** Is this redact call going to be used in an LLM request? */
    llm_request?: boolean;
  }

  export interface VaultParameters {
    /** A vault key ID of an exportable key used to redact with FPE instead of using the service config default. */
    fpe_key_id?: string;

    /** A vault secret ID of a secret used to salt a hash instead of using the service config default. */
    salt_secret_id?: string;
  }

  export interface TextOptions extends Options {}
  export interface StructuredOptions extends Options {
    jsonp?: string[];
    format?: string;
  }

  export interface TextParams extends TextOptions {
    text: string;
  }

  export interface StructuredParams extends StructuredOptions {
    data: Object;
  }

  export enum MaskingType {
    MASK = "mask",
    UNMASK = "unmask",
  }

  export interface PartialMasking {
    masking_type?: MaskingType;
    unmasked_from_left?: number;
    unmasked_from_right?: number;
    masked_from_left?: number;
    masked_from_right?: number;
    chars_to_ignore?: string[];
    masking_char?: string[];
  }

  export interface UnredactRequest<O = object> {
    /** Data to unredact */
    redacted_data: O;

    /** FPE context used to decrypt and unredact data */
    fpe_context?: string;
  }

  export interface UnredactResult<O = object> {
    /** The unredacted data */
    data: O;
  }
}

export namespace Embargo {
  export interface Sanction {
    list_name: string;
    embargoed_country_name: string;
    embargoed_country_iso_code: string;
    issuing_country: string;
    annotations: object;
  }

  export interface CheckResult {
    sanctions: Sanction[];
  }
}

export namespace FileScan {
  export interface ScanRequest {
    verbose?: boolean;
    raw?: boolean;
    provider?: string;
    transfer_method?: TransferMethod;
    source_url?: string;
  }

  export interface ScanFileParams {
    size: number;
    crc32c: string;
    sha256: string;
  }

  export interface ScanFullRequest extends ScanRequest, ScanFileParams {}

  export interface Options {
    pollResultSync?: boolean;
  }

  export interface ScanResult {
    parameter?: Dictionary;
    raw_data?: Dictionary;
    data: {
      category: string[];
      score: number;
      verdict: string;
    };
  }
}

/**
 * Intel services interface definitions
 */
export namespace Intel {
  export enum HashType {
    SHA256 = "sha256",
    SHA1 = "sha1",
    SHA512 = "sha512",
    NTLM = "ntlm",
  }

  export interface Options {
    verbose?: boolean;
    raw?: boolean;
    provider?: string;
  }

  export interface ReputationData {
    category: string[];
    score: number;
    verdict: string;
  }

  export interface CommonResult {
    parameters?: Dictionary;
    raw_data?: Dictionary;
  }

  export interface ReputationResult extends CommonResult {
    data: ReputationData;
  }

  export namespace File {
    interface Options extends Intel.Options {}
    interface Params {
      hash?: string;
      hashes?: string[];
      hash_type: string;
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationData extends Intel.ReputationData {}

    export interface ReputationBulkData {
      [key: string]: ReputationData;
    }

    export interface ReputationResult extends Intel.CommonResult {
      data: ReputationData;
    }

    export interface ReputationBulkResult extends Intel.CommonResult {
      data: ReputationBulkData;
    }
    export interface ReputationRequest extends Params, ReputationOptions {}
  }

  export namespace Domain {
    interface Options extends Intel.Options {}
    interface Params {
      domain?: string;
      domains?: string[];
    }

    export interface ReputationOptions extends Options {}

    export interface ReputationData extends Intel.ReputationData {}

    export interface ReputationBulkData {
      [key: string]: ReputationData;
    }

    export interface ReputationResult extends Intel.CommonResult {
      data: ReputationData;
    }

    export interface ReputationBulkResult extends Intel.CommonResult {
      data: ReputationBulkData;
    }

    export interface ReputationRequest extends Params, ReputationOptions {}

    export interface WhoIsOptions extends Options {}
    export interface WhoIsRequest extends Params, WhoIsOptions {}
    export interface WhoIsData {
      domain_name: string;
      domain_availability: string;
      created_date?: string;
      updated_date?: string;
      expires_date?: string;
      host_names?: string[];
      ips?: string[];
      registrar_name?: string;
      contact_email?: string;
      estimated_domain_age?: number;
      registrant_organization?: string;
      registrant_country?: string;
    }

    export interface WhoIsResult extends Intel.CommonResult {
      data: WhoIsData;
    }
  }

  export namespace URL {
    interface Options extends Intel.Options {}
    interface Params {
      url?: string;
      urls?: string[];
    }

    export interface ReputationOptions extends Options {}
    export interface ReputationData extends Intel.ReputationData {}

    export interface ReputationBulkData {
      [key: string]: ReputationData;
    }

    export interface ReputationResult extends Intel.CommonResult {
      data: ReputationData;
    }

    export interface ReputationBulkResult extends Intel.CommonResult {
      data: ReputationBulkData;
    }
    export interface ReputationRequest extends Params, ReputationOptions {}
  }

  export namespace IP {
    interface Options extends Intel.Options {}
    interface Params {
      ip?: string;
      ips?: string[];
    }

    export interface GeolocateOptions extends Options {}
    export interface GeolocateRequest extends Params, GeolocateOptions {}

    export interface DomainOptions extends Options {}
    export interface DomainRequest extends Params, DomainOptions {}

    export interface VPNOptions extends Options {}
    export interface VPNRequest extends Params, VPNOptions {}

    export interface ProxyOptions extends Options {}
    export interface ProxyRequest extends Params, ProxyOptions {}

    export interface ReputationOptions extends Options {}
    export interface ReputationData extends Intel.ReputationData {}

    export interface ReputationBulkData {
      [key: string]: ReputationData;
    }

    export interface ReputationResult extends Intel.CommonResult {
      data: ReputationData;
    }

    export interface ReputationBulkResult extends Intel.CommonResult {
      data: ReputationBulkData;
    }
    export interface ReputationParams extends Params, ReputationOptions {}

    export interface GeolocateData {
      country: string;
      city: string;
      latitude: number;
      longitude: number;
      postal_code: string;
      country_code: string;
    }

    export interface GeolocateResult extends CommonResult {
      data: GeolocateData;
    }

    export interface GeolocateBulkData {
      [key: string]: GeolocateData;
    }

    export interface GeolocateBulkResult extends CommonResult {
      data: GeolocateBulkData;
    }

    export interface DomainData {
      domain_found: boolean;
      domain?: string;
    }

    export interface DomainResult extends CommonResult {
      data: DomainData;
    }

    export interface DomainBulkData {
      [key: string]: DomainData;
    }

    export interface DomainBulkResult extends CommonResult {
      data: DomainBulkData;
    }

    export interface VPNData {
      is_vpn: boolean;
    }

    export interface VPNResult extends CommonResult {
      data: VPNData;
    }

    export interface VPNBulkData {
      [key: string]: VPNData;
    }

    export interface VPNBulkResult extends CommonResult {
      data: VPNBulkData;
    }

    export interface ProxyData {
      is_proxy: boolean;
    }

    export interface ProxyBulkData {
      [key: string]: ProxyData;
    }

    export interface ProxyResult extends CommonResult {
      data: ProxyData;
    }

    export interface ProxyBulkResult extends CommonResult {
      data: ProxyBulkData;
    }
  }

  export namespace User {
    export interface BreachedData {
      found_in_breach: boolean;
      breach_count: number;
    }

    export interface BreachRequest {
      /** The ID of a breach returned by a provider. */
      breach_id?: string;

      /** Echo the API parameters in the response. */
      verbose?: boolean;

      /** Get breach data from this provider. */
      provider?: string;

      /** A token given in the raw response from SpyCloud. Post this back to paginate results. */
      cursor?: string;

      /** This parameter allows you to define the starting point for a date range query on the spycloud_publish_date field. */
      start?: string;

      /** This parameter allows you to define the ending point for a date range query on the spycloud_publish_date field. */
      end?: string;

      /** Filter for records that match one of the given severities. */
      severity?: string[];
    }

    export interface BreachResult {
      /** A flag indicating if the lookup was successful. */
      found: boolean;

      /** Breach details given by the provider. */
      data?: object;

      /** The parameters, which were passed in the request, echoed back. */
      parameters?: Dictionary;
    }

    export interface BreachedBulkData {
      [key: string]: BreachedData;
    }

    export interface BreachedBulkResult extends Intel.CommonResult {
      data: BreachedBulkData;
    }

    export namespace User {
      export interface BreachedOptions extends Intel.Options {
        /** Earliest date for search. */
        start?: string;

        /** Latest date for search. */
        end?: string;

        /** A token given in the raw response from SpyCloud. Post this back to paginate results. */
        cursor?: string;

        /** Filter for records that match one of the given severities. */
        severity?: string[];
      }

      export interface BreachedBulkOptions extends Intel.Options {
        /** Earliest date for search. */
        start?: string;

        /** Latest date for search. */
        end?: string;

        /** Filter for records that match one of the given severities. */
        severity?: string[];
      }

      export interface BreachedEmailRequest extends BreachedOptions {
        email: string;
      }

      export interface BreachedUsernameRequest extends BreachedOptions {
        username: string;
      }

      export interface BreachedIPRequest extends BreachedOptions {
        ip: string;
      }

      export interface BreachedPhoneRequest extends BreachedOptions {
        phone_number: string;
      }

      export interface BreachedResult extends Intel.CommonResult {
        data: BreachedData;
      }

      export type BreachedRequest =
        | BreachedEmailRequest
        | BreachedIPRequest
        | BreachedPhoneRequest
        | BreachedUsernameRequest;

      export interface BreachedEmailBulkRequest extends BreachedBulkOptions {
        emails: string[];
      }

      export interface BreachedUsernameBulkRequest extends BreachedBulkOptions {
        usernames: string[];
      }

      export interface BreachedDomainBulkRequest extends BreachedBulkOptions {
        domains: string[];
      }

      export interface BreachedIPBulkRequest extends BreachedBulkOptions {
        ips: string[];
      }

      export interface BreachedPhoneBulkRequest extends BreachedBulkOptions {
        phone_numbers: string[];
      }

      export type BreachedBulkRequest =
        | BreachedEmailBulkRequest
        | BreachedIPBulkRequest
        | BreachedPhoneBulkRequest
        | BreachedUsernameBulkRequest
        | BreachedDomainBulkRequest;

      export interface BreachedBulkResult
        extends Intel.User.BreachedBulkResult {}
    }

    export namespace Password {
      export interface BreachedOptions extends Intel.Options {}

      export interface BreachedRequest extends BreachedOptions {
        hash_type: string;
        hash_prefix: string;
      }

      export interface BreachedBulkRequest extends BreachedOptions {
        hash_type: string;
        hash_prefixes: string[];
      }

      export enum PasswordStatus {
        BREACHED,
        UNBREACHED,
        INCONCLUSIVE,
      }
    }
  }
}

/**
 * Vault services interface definitions
 */
export namespace Vault {
  export enum KeyPurpose {
    SIGNING = "signing",
    ENCRYPTION = "encryption",
    JWT = "jwt",

    /** Format-preserving encryption. */
    FPE = "fpe",
  }

  export enum AsymmetricAlgorithm {
    Ed25519 = "ED25519",
    RSA2048_PKCS1V15_SHA256 = "RSA-PKCS1V15-2048-SHA256",
    RSA2048_OAEP_SHA256 = "RSA-OAEP-2048-SHA256",
    ES256 = "ES256",
    ES384 = "ES384",
    ES512 = "ES512",
    ES256K = "ES256K",
    RSA2048_OAEP_SHA1 = "RSA-OAEP-2048-SHA1",
    RSA2048_OAEP_SHA512 = "RSA-OAEP-2048-SHA512",
    RSA3072_OAEP_SHA1 = "RSA-OAEP-3072-SHA1",
    RSA3072_OAEP_SHA256 = "RSA-OAEP-3072-SHA256",
    RSA3072_OAEP_SHA512 = "RSA-OAEP-3072-SHA512",
    RSA4096_OAEP_SHA1 = "RSA-OAEP-4096-SHA1",
    RSA4096_OAEP_SHA256 = "RSA-OAEP-4096-SHA256",
    RSA4096_OAEP_SHA512 = "RSA-OAEP-4096-SHA512",
    RSA2048_PSS_SHA256 = "RSA-PSS-2048-SHA256",
    RSA3072_PSS_SHA256 = "RSA-PSS-3072-SHA256",
    RSA4096_PSS_SHA256 = "RSA-PSS-4096-SHA256",
    RSA4096_PSS_SHA512 = "RSA-PSS-4096-SHA512",
    Ed25519_DILITHIUM2_BETA = "ED25519-DILITHIUM2-BETA",
    Ed448_DILITHIUM3_BETA = "ED448-DILITHIUM3-BETA",
    SPHINCSPLUS_128F_SHAKE256_SIMPLE_BETA = "SPHINCSPLUS-128F-SHAKE256-SIMPLE-BETA",
    SPHINCSPLUS_128F_SHAKE256_ROBUST_BETA = "SPHINCSPLUS-128F-SHAKE256-ROBUST-BETA",
    SPHINCSPLUS_192F_SHAKE256_SIMPLE_BETA = "SPHINCSPLUS-192F-SHAKE256-SIMPLE-BETA",
    SPHINCSPLUS_192F_SHAKE256_ROBUST_BETA = "SPHINCSPLUS-192F-SHAKE256-ROBUST-BETA",
    SPHINCSPLUS_256F_SHAKE256_SIMPLE_BETA = "SPHINCSPLUS-256F-SHAKE256-SIMPLE-BETA",
    SPHINCSPLUS_256F_SHAKE256_ROBUST_BETA = "SPHINCSPLUS-256F-SHAKE256-ROBUST-BETA",
    SPHINCSPLUS_128F_SHA256_SIMPLE_BETA = "SPHINCSPLUS-128F-SHA256-SIMPLE-BETA",
    SPHINCSPLUS_128F_SHA256_ROBUST_BETA = "SPHINCSPLUS-128F-SHA256-ROBUST-BETA",
    SPHINCSPLUS_192F_SHA256_SIMPLE_BETA = "SPHINCSPLUS-192F-SHA256-SIMPLE-BETA",
    SPHINCSPLUS_192F_SHA256_ROBUST_BETA = "SPHINCSPLUS-192F-SHA256-ROBUST-BETA",
    SPHINCSPLUS_256F_SHA256_SIMPLE_BETA = "SPHINCSPLUS-256F-SHA256-SIMPLE-BETA",
    SPHINCSPLUS_256F_SHA256_ROBUST_BETA = "SPHINCSPLUS-256F-SHA256-ROBUST-BETA",
    FALCON_1024_BETA = "FALCON-1024-BETA",
  }

  export enum SymmetricAlgorithm {
    HS256 = "HS256",
    HS384 = "HS384",
    HS512 = "HS512",
    AES128_CFB = "AES-CFB-128",
    AES256_CFB = "AES-CFB-256",
    AES256_GCM = "AES-GCM-256",
    AES128_CBC = "AES-CBC-128",
    AES256_CBC = "AES-CBC-256",

    /** 128-bit encryption using the FF3-1 algorithm. Beta feature. */
    AES128_FF3_1 = "AES-FF3-1-128-BETA",

    /** 256-bit encryption using the FF3-1 algorithm. Beta feature. */
    AES256_FF3_1 = "AES-FF3-1-256-BETA",
  }

  /** Algorithm of an exported public key. */
  export enum ExportEncryptionAlgorithm {
    /** RSA 4096-bit key, OAEP padding, SHA512 digest. */
    RSA4096_OAEP_SHA512 = "RSA-OAEP-4096-SHA512",

    RSA4096_NO_PADDING_KEM = "RSA-NO-PADDING-4096-KEM",
  }

  export enum ItemType {
    ASYMMETRIC_KEY = "asymmetric_key",
    SYMMETRIC_KEY = "symmetric_key",
    SECRET = "secret",
    PANGEA_TOKEN = "pangea_token",
    FOLDER = "folder",
    PANGEA_CLIENT_SECRET = "pangea_client_secret",
    PANGEA_PLATFORM_CLIENT_SECRET = "pangea_platform_client_secret",
  }

  export enum ItemState {
    ENABLED = "enabled",
    DISABLED = "disabled",
  }

  export enum ItemVersionState {
    ACTIVE = "active",
    DEACTIVATED = "deactivated",
    SUSPENDED = "suspended",
    COMPROMISED = "compromised",
    DESTROYED = "destroyed",
    INHERITED = "inherited",
  }

  export enum ItemOrder {
    ASC = "asc",
    DESC = "desc",
  }

  export enum ItemOrderBy {
    TYPE = "type",
    CREATED_AT = "created_at",
    DESTROYED_AT = "destroyed_at",
    PURPOSE = "purpose",
    EXPIRATION = "expiration",
    LAST_ROTATED = "last_rotated",
    NEXT_ROTATION = "next_rotation",
    NAME = "name",
    FOLDER = "folder",
    VERSION = "version",
  }

  /** Character sets for format-preserving encryption. */
  export enum TransformAlphabet {
    /** Lowercase alphabet (a-z). */
    ALPHA_LOWER = "alphalower",

    /** Uppercase alphabet (A-Z). */
    ALPHA_UPPER = "alphaupper",

    /** Alphanumeric (a-z, A-Z, 0-9). */
    ALPHANUMERIC = "alphanumeric",

    /** Lowercase alphabet with numbers (a-z, 0-9). */
    ALPHANUMERIC_LOWER = "alphanumericlower",

    /** Uppercase alphabet with numbers (A-Z, 0-9). */
    ALPHANUMERIC_UPPER = "alphanumericupper",

    /** Numeric (0-9). */
    NUMERIC = "numeric",
  }

  export enum ExportEncryptionType {
    ASYMMETRIC = "asymmetric",
    KEM = "kem",
  }

  export type Metadata = Object;
  export type Tags = string[];

  // EncodedPublicKey is a PEM public key, with no further encoding (i.e. no base64)
  // It may be used for example in openssh with no further processing
  export type EncodedPublicKey = string;

  // EncodedPrivateKey is a PEM private key, with no further encoding (i.e. no base64).
  // It may be used for example in openssh with no further processing
  export type EncodedPrivateKey = string;

  // EncodedSymmetricKey is a base64 encoded key
  export type EncodedSymmetricKey = string;

  export interface StateChangeRequest {
    id: string;
    state: Vault.ItemVersionState;
    version?: number;
    destroy_period?: string;
  }

  export interface StateChangeResult {
    id: string;
    version: number;
    state: string;
    destroy_at?: string;
  }

  export interface DeleteRequest {
    id: string;
  }

  export interface DeleteResult {
    id: string;
  }

  export interface ItemData {
    /** The type of the item */
    type: string;

    /** The ID of the item */
    id: string;

    /** Latest version number */
    num_versions: number;

    /** True if the item is enabled */
    enabled: boolean;

    /** The name of this item */
    name?: string;

    /** The folder where this item is stored */
    folder?: string;

    /** User-provided metadata */
    metadata?: Metadata;

    /** A list of user-defined tags */
    tags?: Tags;

    /** Period of time between item rotations. */
    rotation_frequency?: string;

    /** State to which the previous version should transition upon rotation */
    rotation_state?: string;

    /** Timestamp of the last rotation (if any) */
    last_rotated?: string;

    /** Timestamp of the next rotation, if auto rotation is enabled. */
    next_rotation?: string;

    /** Timestamp indicating when the item will be disabled */
    disabled_at?: string;

    /** Timestamp indicating when the item was created */
    created_at: string;

    /** The algorithm of the key */
    algorithm?: string;

    /** The purpose of the key */
    purpose?: string;

    /** Grace period for the previous version of the secret */
    rotation_grace_period?: string;

    /** Whether the key is exportable or not. */
    exportable?: boolean;

    /** */
    client_id?: string;

    /** For settings that inherit a value from a parent folder, the full path of the folder where the value is set */
    inherited_settings?: InheritedSettigs;

    item_versions: ItemVersionData[];
  }

  export interface ListItemData extends ItemData {
    compromised_versions: ItemVersionData[];
  }

  export interface ListResult {
    items: ListItemData[];

    /** Internal ID returned in the previous look up response. Used for pagination. */
    last?: string;
  }

  export interface ListRequest {
    /** A set of filters to help you customize your search. */
    filter?: Object;

    /** Internal ID returned in the previous look up response. Used for pagination. */
    last?: string;

    /** Maximum number of items in the response */
    size?: number;

    /** Ordering direction */
    order?: Vault.ItemOrder;

    /** Property used to order the results */
    order_by?: Vault.ItemOrderBy;
  }

  export interface GetBulkRequest {
    /** A set of filters to help you customize your search. */
    filter?: Object;

    /** Internal ID returned in the previous look up response. Used for pagination. */
    last?: string;

    /** Maximum number of items in the response */
    size?: number;

    /** Ordering direction */
    order?: Vault.ItemOrder;

    /** Property used to order the results */
    order_by?: Vault.ItemOrderBy;
  }

  export interface GetBulkResult {
    items: ItemData[];
    last?: string;
  }

  export interface UpdateRequest {
    /** The item ID */
    id: string;

    /** The name of this item */
    name?: string;

    /** The parent folder where this item is stored */
    folder?: string;

    /** User-provided metadata */
    metadata?: Metadata;

    /** A list of user-defined tags */
    tags?: Tags;

    /** Timestamp indicating when the item will be disabled */
    disabled_at?: string;

    /** True if the item is enabled */
    enabled?: boolean;

    /** Period of time between item rotations, never to disable rotation or inherited to inherit the value from the parent folder or from the default settings (format: a positive number followed by a time period (secs, mins, hrs, days, weeks, months, years) or an abbreviation */
    rotation_frequency?: string;

    /** State to which the previous version should transition upon rotation or inherited to inherit the value from the parent folder or from the default settings */
    rotation_state?: ItemVersionState;

    /** Grace period for the previous version of the Pangea Token or inherited to inherit the value from the parent folder or from the default settings (format: a positive number followed by a time period (secs, mins, hrs, days, weeks, months, years) or an abbreviation */
    rotation_grace_period?: string;
  }

  export interface UpdateResult extends ItemData {}

  export interface GetRequest {
    id: string;
    version?: number | string;
  }

  export interface ItemVersionData {
    /** The item version */
    version: number;

    /** The state of the item version */
    state: string;

    /** Timestamp indicating when the item was created */
    created_at: string;

    /** Timestamp indicating when the item version will be destroyed */
    destroyed_at?: string;

    /** Timestamp indicating when the item version will be rotated */
    rotated_at?: string;

    public_key?: EncodedPublicKey;
    secret?: string;
    token?: string;
    client_secret?: string;
    client_secret_id?: string;
  }

  export interface InheritedSettigs {
    rotation_frequency?: string;
    rotation_state?: string;
    rotation_grace_period?: string;
  }

  export interface GetResult extends ItemData {}

  export interface ExportRequest {
    /** The ID of the item */
    id: string;

    /** The item version */
    version?: number;

    /** Public key in pem format used to encrypt exported key(s). */
    asymmetric_public_key?: string;

    /** The algorithm of the public key. */
    asymmetric_algorithm?: ExportEncryptionAlgorithm;

    /** This is the password that will be used along with a salt to derive the symmetric key that is used to encrypt the exported key material. Required if encryption_type is kem. */
    kem_password?: string;
  }

  export interface ExportResult {
    /**
     * The ID of the item.
     */
    id: string;

    /**
     * The item version.
     */
    version: number;

    /**
     * The type of the key.
     */
    type: string;

    /**
     * True if the item is enabled.
     */
    enabled: boolean;

    /**
     * The algorithm of the key.
     */
    algorithm: string;

    /**
     * The public key (in PEM format).
     */
    public_key?: string;

    /**
     * The private key (in PEM format).
     */
    private_key?: string;

    /**
     * The key material.
     */
    key?: string;

    /** Encryption format of the exported key(s). It could be none if returned in plain text, asymmetric if it is encrypted just with the public key sent in asymmetric_public_key, or kem if it was encrypted using KEM protocol. */
    encryption_type?: string;

    /** The algorithm of the public key used to encrypt exported material */
    asymmetric_algorithm?: string;

    /** The algorithm of the symmetric key used to encrypt exported material */
    symmetric_algorithm?: string;

    /** Key derivation function used to derivate the symmetric key when `encryption_type` is `kem` */
    kdf?: string;

    /** Hash algorithm used to derivate the symmetric key when `encryption_type` is `kem` */
    hash_algorithm?: string;

    /** Salt used to derivate the symmetric key when `encryption_type` is `kem`, encrypted with the public key provided in `asymmetric_key` */
    encrypted_salt?: string;

    /** Iteration count used to derivate the symmetric key when `encryption_type` is `kem` */
    iteration_count?: number;
  }

  export namespace JWT {
    export interface SignRequest {
      /** The item ID */
      id: string;

      /** The JWT payload (in JSON) */
      payload: string;
    }

    export interface SignResult {
      /** The signed JSON Web Token (JWS) */
      jws: string;
    }

    export interface VerifyRequest {
      /** The signed JSON Web Token (JWS) */
      jws: string;
    }

    export interface VerifyResult {
      /** Indicates if messages have been verified */
      valid_signature: boolean;
    }
  }

  export namespace JWK {
    export interface Header {
      alg: string;
      kid?: string;
      kty: string;
      use?: string;
    }

    export interface JWKrsa extends Header {
      n: string;
      e: string;
      d?: string;
    }

    export interface JWKec extends Header {
      crv: string;
      d?: string;
      x: string;
      y: string;
    }

    export interface JWK extends Header {}

    export interface GetResult {
      /** The JSON Web Key Set (JWKS) object. Fields with key information are base64URL encoded. */
      keys: [JWKrsa | JWKec][];
    }

    export interface GetRequest {
      /** The item ID */
      id: string;

      /** The key version(s). all for all versions, num for a specific version, -num for the num latest versions */
      version?: string;
    }
  }

  export namespace Common {
    export interface StoreRequest extends GenerateStoreOptions {
      /** The type of the item */
      type: Vault.ItemType;

      /** The name of this item */
      name: string;
    }

    export interface GenerateRequest extends GenerateStoreOptions {
      /** The type of the item */
      type?: Vault.ItemType;

      /** The name of this item */
      name: string;
    }

    export interface GenerateStoreOptions {
      /** The folder where this item is stored */
      folder?: string;

      /** User-provided metadata */
      metadata?: Metadata;

      /** A list of user-defined tags */
      tags?: Tags;

      /** Period of time between item rotations. */
      rotation_frequency?: string;

      /** State to which the previous version should transition upon rotation */
      rotation_state?: ItemVersionState;

      /** Timestamp indicating when the item will be disabled */
      disabled_at?: string;

      /** Whether the key is exportable or not. */
      exportable?: boolean;
    }

    export interface RotateRequest {
      /** The ID of the item */
      id: string;

      /** State to which the previous version should transition upon rotation */
      rotation_state?: ItemVersionState;
    }

    export interface RotateResult extends ItemData {}
  }

  export namespace Secret {
    export const Algorithm = {
      BASE32: "base32",
    };

    export interface StoreRequest extends Common.StoreRequest {
      /** The secret value */
      secret?: string;

      /** The Pangea Token value */
      token?: string;

      /** The oauth client secret */
      client_secret?: string;

      /** The oauth client ID */
      client_id?: string;

      /** The oauth client secret ID */
      client_secret_id?: string;

      /** Grace period for the previous version of the secret */
      rotation_grace_period?: string;
    }

    export interface StoreResult extends ItemData {
      /** The secret value */
      secret?: string;

      /** The Pangea Token value */
      token?: string;

      /** The oauth client secret */
      client_secret?: string;

      /** The oauth client ID */
      client_id?: string;

      /** The oauth client secret ID */
      client_secret_id?: string;

      /** Grace period for the previous version of the secret */
      rotation_grace_period?: string;
    }

    export interface RotateRequest extends Common.RotateRequest {
      /** The secret value */
      secret?: string;

      /** Grace period for the previous version of the secret */
      rotation_grace_period?: string;
    }

    export interface RotateResult extends ItemData {}
  }

  export namespace Key {
    export interface RotateRequest extends Common.RotateRequest {
      /** The public key (in PEM format) */
      public_key?: EncodedPublicKey;

      /** The private key (in PEM format) */
      private_key?: EncodedPrivateKey;

      /** The key material */
      key?: EncodedSymmetricKey;
    }

    export interface RotateResult extends ItemData {}

    /**
     * Parameters for an encrypt/decrypt structured request.
     */
    export interface EncryptStructuredRequest<O = object> {
      /**
       * The ID of the key to use. It must be an item of type `symmetric_key` or
       * `asymmetric_key` and purpose `encryption`.
       */
      id: string;

      /**
       * Structured data for applying bulk operations.
       */
      structured_data: O;

      /**
       * A filter expression. It must point to string elements of the
       * `structured_data` field.
       */
      filter: string;

      /**
       * The item version. Defaults to the current version.
       */
      version?: number;

      /**
       * User provided authentication data.
       */
      additional_data?: string;
    }

    /**
     * Result of an encrypt/decrypt structured request.
     */
    export interface EncryptStructuredResult<O = object> {
      /**
       * The ID of the item.
       */
      id: string;

      /**
       * The item version.
       */
      version: number;

      /**
       * The algorithm of the key.
       */
      algorithm: string;

      /**
       * Structured data with filtered fields encrypted.
       */
      structured_data: O;
    }

    /** Parameters for an encrypt transform request. */
    export interface EncryptTransformRequest {
      /** The ID of the key to use. */
      id: string;

      /** Message to be encrypted. */
      plain_text: string;

      /** Set of characters to use for format-preserving encryption (FPE). */
      alphabet: TransformAlphabet;

      /**
       * User provided tweak string. If not provided, a random string will be
       * generated and returned. The user must securely store the tweak source
       * which will be needed to decrypt the data.
       */
      tweak?: string;

      /** The item version. Defaults to the current version. */
      version?: number;
    }

    /** Result of an encrypt transform request. */
    export interface EncryptTransformResult {
      /** The ID of the item. */
      id: string;

      /** The item version. */
      version: number;

      /** The algorithm of the key. */
      algorithm: string;

      /** The encrypted message. */
      cipher_text: string;

      /**
       * User provided tweak string. If not provided, a random string will be
       * generated and returned. The user must securely store the tweak source
       * which will be needed to decrypt the data.
       */
      tweak: string;

      /** Set of characters to use for format-preserving encryption (FPE). */
      alphabet: string;
    }

    /** Parameters for an decrypt transform request. */
    export interface DecryptTransformRequest {
      /** The ID of the key to use. */
      id: string;

      /** A message encrypted by Vault. */
      cipher_text: string;

      /**
       * User provided tweak string. If not provided, a random string will be
       * generated and returned. The user must securely store the tweak source
       * which will be needed to decrypt the data.
       */
      tweak: string;

      /** Set of characters to use for format-preserving encryption (FPE). */
      alphabet: TransformAlphabet;

      /** The item version. Defaults to the current version. */
      version?: number;
    }

    /** Result of an decrypt transform request. */
    export interface DecryptTransformResult {
      /** The ID of the item. */
      id: string;

      /** The item version. */
      version: number;

      /** The algorithm of the key. */
      algorithm: string;

      /** Decrypted message. */
      plain_text: string;
    }
  }

  export namespace Asymmetric {
    export interface GenerateRequest extends Common.GenerateRequest {
      /** The algorithm of the key */
      algorithm: Vault.AsymmetricAlgorithm;

      /** The purpose of the key */
      purpose: Vault.KeyPurpose;
    }

    export interface GenerateResult extends ItemData {
      /** The algorithm of the key */
      algorithm: string;

      /** The purpose of the key */
      purpose: string;

      public_key: EncodedPublicKey;
    }

    export interface StoreRequest extends Common.StoreRequest {
      /** The private key (in PEM format) */
      private_key: EncodedPrivateKey;

      /** The public key (in PEM format) */
      public_key: EncodedPublicKey;

      /** The algorithm of the key */
      algorithm: Vault.AsymmetricAlgorithm;

      /** The purpose of the key */
      purpose: Vault.KeyPurpose;

      /** Whether the key is exportable or not. */
      exportable?: boolean;
    }

    export interface StoreResult extends ItemData {}

    export interface SignRequest {
      /** The ID of the item */
      id: string;

      /** The message to be signed */
      message: string;

      /** The item version */
      version?: number;
    }

    export interface SignResult {
      /** The ID of the item */
      id: string;

      /** The item version */
      version: number;

      /** The signature of the message */
      signature: string;

      /** The algorithm of the key */
      algorithm: string;

      /** The public key (in PEM format) */
      public_key?: EncodedPublicKey;
    }

    export interface VerifyRequest {
      /** The ID of the item */
      id: string;

      /** A message to be verified */
      message: string;

      /** The message signature */
      signature: string;

      /** The item version */
      version?: number;
    }

    export interface VerifyResult {
      /** The ID of the item */
      id: string;

      /** The item version */
      version: number;

      /** The algorithm of the key */
      algorithm: string;

      /** Indicates if messages have been verified. */
      valid_signature: boolean;
    }
  }

  export namespace Symmetric {
    export interface StoreRequest extends Common.StoreRequest {
      key: EncodedSymmetricKey;

      /** The algorithm of the key */
      algorithm: Vault.SymmetricAlgorithm;

      /** The purpose of the key */
      purpose: Vault.KeyPurpose;

      /** Whether the key is exportable or not. */
      exportable?: boolean;
    }

    export interface StoreResult extends ItemData {}

    export interface GenerateRequest extends Common.GenerateRequest {
      /** The algorithm of the key */
      algorithm: Vault.SymmetricAlgorithm;

      /** The purpose of the key */
      purpose: Vault.KeyPurpose;
    }

    export interface GenerateResult extends ItemData {}

    export interface EncryptRequest {
      /** The item ID */
      id: string;

      /** A message to be encrypted (Base64 encoded) */
      plain_text: string;

      /** The item version */
      version?: number;

      /** User provided authentication data */
      additional_data?: string;
    }

    export interface EncryptResult {
      /** The item ID */
      id: string;

      /** The item version */
      version: number;

      /** The algorithm of the key */
      algorithm: string;

      /** The encrypted message (Base64 encoded) */
      cipher_text: string;
    }

    export interface DecryptRequest {
      /** The item ID */
      id: string;

      /** The item version */
      version?: number;

      /** A message encrypted by Vault (Base64 encoded) */
      cipher_text: string;

      /** User provided authentication data */
      additional_data?: string;
    }

    export interface DecryptResult {
      /** The item ID */
      id: string;

      /** The item version */
      version?: number;

      /** The algorithm of the key */
      algorithm: string;

      /** The decrypted message */
      plain_text: string;
    }
  }

  export namespace Folder {
    export interface CreateRequest {
      /** The name of this folder */
      name: string;

      /** The parent folder where this folder is stored */
      folder: string;

      /** User-provided metadata */
      metadata?: Metadata;

      /** A list of user-defined tags */
      tags?: Tags;

      /** Period of time between item rotations. */
      rotation_frequency?: string;

      /** State to which the previous version should transition upon rotation */
      rotation_state?: ItemVersionState;

      /** Grace period for the previous version of the secret */
      rotation_grace_period?: string;
    }

    export interface CreateResult extends ItemData {}
  }
}

export namespace AuthN {
  export enum IDProvider {
    FACEBOOK = "facebook",
    GITHUB = "github",
    GOOGLE = "google",
    MICROSOFT_ONLINE = "microsoftonline",
    PASSWORD = "password",
  }

  export enum ItemOrder {
    ASC = "asc",
    DESC = "desc",
  }

  export type Scopes = string[];

  export interface Profile {
    [key: string]: string | undefined;
  }

  export enum MFAProvider {
    TOTP = "totp",
    EMAIL_OTP = "email_otp",
    SMS_OTP = "sms_otp",
  }

  export enum FlowType {
    SIGNIN = "signin",
    SIGNUP = "signup",
  }

  export interface UserItem {
    /** The identity of a user or a service. */
    id: string;

    /** An email address. */
    email: string;

    /** A username. */
    username: string;

    /** A user profile as a collection of string properties. */
    profile: Profile;

    /** True if the user's email has been verified. */
    verified: boolean;

    /** True if the service administrator has disabled user account. */
    disabled: boolean;

    /** An ID for an agreement. */
    accepted_eula_id?: string;

    /** An ID for an agreement. */
    accepted_privacy_policy_id?: string;

    /** A time in ISO-8601 format. */
    last_login_at?: string;

    /** A time in ISO-8601 format. */
    created_at: string;
    login_count: number;
    last_login_ip?: string;
    last_login_city?: string;
    last_login_country?: string;

    /** A list of authenticators. */
    authenticators?: AuthN.User.Authenticators.Authenticator[];
  }

  export interface PasswordRequirements {
    password_chars_min: number;
    password_chars_max: number;
    password_lower_min: number;
    password_upper_min: number;
    password_punct_min: number;
  }

  export enum TokenType {
    USER = "user",
    SERVICE = "service",
    CLIENT = "client",
    SESSION = "session",
  }

  export interface IPIntelligence {
    is_bad: boolean;
    is_vpn: boolean;
    is_proxy: boolean;
    reputation: Intel.ReputationData;
    geolocation: Intel.IP.GeolocateData;
  }

  export interface DomainIntelligence {
    is_bad: boolean;
    reputation: Intel.ReputationData;
  }

  export interface Intelligence {
    embargo: boolean;
    ip_intel: IPIntelligence;
    domain_intel: DomainIntelligence;
    user_intel: boolean;
  }

  export interface SessionToken {
    id: string;
    type: TokenType;
    life: number;
    expire: string;
    identity: string;
    email: string;
    scopes: Scopes;
    profile: Profile;
    created_at: string;
    intelligence?: Intelligence;
  }

  export interface LoginToken extends SessionToken {
    token: string;
  }

  export namespace Agreements {
    export enum AgreementType {
      EULA = "eula",
      PRIVACY_POLICY = "privacy_policy",
    }

    export interface CreateRequest {
      type: AgreementType;
      name: string;
      text: string;
      active?: boolean;
    }

    export interface AgreementInfo {
      type: string;
      id: string;
      created_at: string;
      updated_at: string;
      published_at: string;
      name: string;
      text: string;
      active: boolean;
    }

    export interface CreateResult extends AgreementInfo {}

    export interface DeleteRequest {
      type: AgreementType;
      id: string;
    }

    export interface DeleteResult {}

    export enum AgreementListOrderBy {
      ID = "id",
      CREATED_AT = "created_at",
      NAME = "name",
      TEXT = "text",
    }

    export interface ListFilter {
      active?: boolean;
      created_at?: string;
      created_at__gt?: string;
      created_at__gte?: string;
      created_at__lt?: string;
      created_at__lte?: string;
      published_at?: string;
      published_at__gt?: string;
      published_at__gte?: string;
      published_at__lt?: string;
      published_at__lte?: string;
      type?: string;
      type__contains?: string[];
      type__in?: string[];
      id?: string;
      id__contains?: string[];
      id__in?: string[];
      name?: string;
      name__contains?: string[];
      name__in?: string[];
      text?: string;
      text__contains?: string[];
      text__in?: string[];
    }

    export interface ListRequest {
      filter?: object | ListFilter;
      last?: string;
      order?: ItemOrder;
      order_by?: AgreementListOrderBy;
      size?: number;
    }

    export interface ListResult {
      agreements: AgreementInfo[];
      count: number;
      last?: string;
    }

    export interface UpdateRequest {
      type: AgreementType;
      id: string;
      name?: string;
      text?: string;
      active?: boolean;
    }

    export interface UpdateResult extends AgreementInfo {}
  }

  export namespace Flow {
    export enum Choice {
      AGREEMENTS = "agreements",
      CAPTCHA = "captcha",
      EMAIL_OTP = "email_otp",
      MAGICLINK = "magiclink",
      PASSWORD = "password",
      PROFILE = "profile",
      PROVISIONAL_ENROLLMENT = "provisional_enrollment",
      RESET_PASSWORD = "reset_password",
      SET_EMAIL = "set_mail",
      SET_PASSWORD = "set_password",
      SMS_OTP = "sms_otp",
      SOCIAL = "social",
      TOTP = "totp",
      VERIFY_EMAIL = "verify_email",
    }

    export interface ChoiceItem {
      choice: string;
      data: Dictionary;
    }

    export interface Result {
      flow_id: string;
      flow_type: string[];
      email: string;
      disclaimer?: string;
      flow_phase: string;
      flow_choices: Flow.ChoiceItem[];
    }

    export interface CompleteRequest {
      flow_id: string;
    }

    export interface CompleteResult {
      refresh_token: LoginToken;
      active_token?: LoginToken;
    }

    export interface StartRequest {
      cb_uri?: string;
      email?: string;
      flow_types?: FlowType[];
      invitation?: string;
    }

    export interface StartResult extends Flow.Result {}

    export namespace Restart {
      export interface DataSMSOTP {
        phone: string;
      }

      export type Data = Dictionary | DataSMSOTP;
    }

    export interface RestartRequest {
      flow_id: string;
      choice: Choice;
      data: Restart.Data;
    }

    export interface RestartResult extends Flow.Result {}

    export namespace Update {
      export interface DataAgreements {
        agreed: string[];
      }

      export interface DataCaptcha {
        code: string;
      }

      export interface DataEmailOTP {
        code: string;
      }

      export interface DataMagiclink {
        state: string;
        code: string;
      }

      export interface DataPassword {
        password: string;
      }

      export interface DataProfile {
        profile: Profile;
      }

      export interface DataProvisionalEnrollment {
        state: string;
        code: string;
      }

      export interface DataResetPassword {
        state: string;
        code: string;
      }

      export interface DataSetEmail {
        email: string;
      }

      export interface DataSetPassword {
        password: string;
      }

      export interface DataSMSOTP {
        code: string;
      }

      export interface DataSocialProvider {
        social_provider: string;
        uri: string;
      }

      export interface DataTOTP {
        code: string;
      }

      export interface DataVerifyEmail {
        state: string;
        code: string;
      }

      export type Data =
        | Dictionary
        | DataAgreements
        | DataCaptcha
        | DataEmailOTP
        | DataMagiclink
        | DataPassword
        | DataProfile
        | DataProvisionalEnrollment
        | DataResetPassword
        | DataSetEmail
        | DataSetPassword
        | DataSMSOTP
        | DataSocialProvider
        | DataTOTP
        | DataVerifyEmail;
    }

    export interface UpdateRequest {
      flow_id: string;
      choice: Flow.Choice;
      data: Flow.Update.Data;
    }

    export interface UpdateResult extends Flow.Result {}
  }

  export namespace Client {
    export interface UserinfoRequest {
      code: string;
    }

    export interface UserinfoResult {
      refresh_token: LoginToken;
      active_token: LoginToken;
    }

    export interface JWKSResult {
      keys: [Vault.JWK.JWKrsa | Vault.JWK.JWKec][];
    }

    export namespace Token {
      export interface CheckRequest {
        token: string;
      }

      export interface CheckResult extends LoginToken {}
    }

    export namespace Password {
      export interface UpdateRequest {
        token: string;
        old_password: string;
        new_password: string;
      }
    }

    export namespace Session {
      export interface InvalidateRequest {
        token: string;
        session_id: string;
      }

      export interface ListOptions {
        filter?: Object | AuthN.Session.ListFilter;
        last?: string;
        order?: string;
        order_by?: string;
        size?: number;
      }

      export interface ListRequest extends ListOptions {
        token: string;
      }

      export interface RefreshOptions {
        user_token?: string;
      }

      export interface RefreshRequest extends RefreshOptions {
        refresh_token: string;
      }

      export interface RefreshResult {
        refresh_token: LoginToken;
        active_token?: LoginToken;
      }
    }
  }

  export namespace Session {
    export interface Item {
      id: string;
      type: TokenType;
      life: number;
      expire: string;
      profile: Profile;
      created_at: string;
      scopes?: Scopes;
      active_token?: SessionToken;
    }

    export interface ListFilter {
      active_token_id?: string;
      active_token_id__contains?: string[];
      active_token_id__in?: string[];
      created_at?: string;
      created_at__gt?: string;
      created_at__gte?: string;
      created_at__lt?: string;
      created_at__lte?: string;
      email?: string;
      email__contains?: string[];
      email__in?: string[];
      expire?: string;
      expire__gt?: string;
      expire__gte?: string;
      expire__lt?: string;
      expire__lte?: string;
      id?: string;
      id__contains?: string[];
      id__in?: string[];
      identity?: string;
      identity__contains?: string[];
      identity__in?: string[];
      scopes?: string[];
      type?: string;
      type__contains?: string[];
      type__in?: string[];
    }

    export interface ListRequest {
      filter?: Object | ListFilter;
      last?: string;
      order?: string;
      order_by?: string;
      size?: number;
    }

    export interface ListResult {
      sessions: Item[];
      last?: string;
    }
  }

  export namespace User {
    export interface CreateOptions {}

    export interface CreateRequest extends CreateOptions {
      /** An email address. */
      email: string;

      /** A user profile as a collection of string properties. */
      profile: Profile;

      /** A username. */
      username?: string;
    }

    export interface CreateResult {
      id: string;
      email: string;
      profile: Profile;
      scopes?: Scopes;
      id_providers: string[];
      mfa_provider?: MFAProvider[];
      require_mfa: boolean;
      verified: boolean;
      disable: boolean;
      accepted_eula_id?: string;
      last_login_at?: string;
      created_at: string;
    }

    export interface InviteItem {
      id: string;
      inviter: string;
      invite_org: string;
      email: string;
      callback: string;
      state: string;
      require_mfa: boolean;
      created_at: string;
      expire: string;
    }

    export interface InviteRequest {
      inviter: string;
      email: string;
      callback: string;
      state: string;
    }

    export interface InviteResult extends InviteItem {}

    export namespace Delete {
      export interface EmailRequest {
        /** An email address. */
        email: string;
      }

      export interface IDRequest {
        /** The identity of a user or a service. */
        id: string;
      }

      export interface UsernameRequest {
        /** A username. */
        username: string;
      }
    }

    export enum ListOrderBy {
      ID = "id",
      CREATED_AT = "created_at",
      LAST_LOGIN_AT = "last_login_at",
      EMAIL = "email",
    }

    export interface ListFilter {
      accepted_eula_id?: string;
      accepted_eula_id__contains?: string[];
      accepted_eula_id__in?: string[];
      created_at?: string;
      created_at__gt?: string;
      created_at__gte?: string;
      created_at__lt?: string;
      created_at__lte?: string;
      disabled?: boolean;
      email?: string;
      email__contains?: string[];
      email__in?: string[];
      id?: string;
      id__contains?: string[];
      id__in?: string[];
      last_login_at?: string;
      last_login_at__gt?: string;
      last_login_at__gte?: string;
      last_login_at__lt?: string;
      last_login_at__lte?: string;
      last_login_ip?: string;
      last_login_ip__contains?: string[];
      last_login_ip__in?: string[];
      last_login_city?: string;
      last_login_city__contains?: string[];
      last_login_city__in?: string[];
      last_login_country?: string;
      last_login_country__contains?: string[];
      last_login_country__in?: string[];
      login_count?: number;
      login_count__gt?: number;
      login_count__gte?: number;
      login_count__lt?: number;
      login_count__lte?: number;
      require_mfa?: boolean;
      scopes?: string[];
      verified?: boolean;
    }

    export interface ListRequest {
      filter?: Object | ListFilter;
      last?: string;
      order?: AuthN.ItemOrder;
      order_by?: AuthN.User.ListOrderBy;
      size?: number;
      use_new?: boolean; // Temporary field, need to be true
    }

    export interface ListResult {
      users: UserItem[];
      last?: string;
      count: number;
    }

    export namespace Invite {
      export enum OrderBy {
        ID = "id",
        CREATED_AT = "created_at",
        TYPE = "type",
        EXPIRE = "expire",
        CALLBACK = "callback",
        STATE = "state",
        EMAIL = "email",
        INVITER = "inviter",
        INVITE_ORG = "invite_org",
      }

      export interface DeleteRequest {
        id: string;
      }

      export interface ListFilter {
        callback?: string;
        callback__contains?: string[];
        callback__in?: string[];
        created_at?: string;
        created_at__gt?: string;
        created_at__gte?: string;
        created_at__lt?: string;
        created_at__lte?: string;
        email?: string;
        email__contains?: string[];
        email__in?: string[];
        expire?: string;
        expire__gt?: string;
        expire__gte?: string;
        expire__lt?: string;
        expire__lte?: string;
        id?: string;
        id__contains?: string[];
        id__in?: string[];
        invite_org?: string;
        invite_org__contains?: string[];
        invite_org__in?: string[];
        inviter?: string;
        inviter__contains?: string[];
        inviter__in?: string[];
        is_signup?: boolean;
        require_mfa?: boolean;
        state?: string;
        state__contains?: string[];
        state__in?: string[];
      }

      export interface ListRequest {
        filter?: Object | ListFilter;
        last?: string;
        order?: ItemOrder;
        order_by?: OrderBy;
        size?: number;
      }

      export interface ListResult {
        invites: InviteItem[];
      }
    }

    export namespace Authenticators {
      export namespace Delete {
        export interface IDRequest {
          /** An ID for an authenticator. */
          authenticator_id: string;

          /** The identity of a user or a service. */
          id: string;
        }

        export interface EmailRequest {
          /** An ID for an authenticator. */
          authenticator_id: string;

          /** An email address. */
          email: string;
        }

        export interface UsernameRequest {
          /** An ID for an authenticator. */
          authenticator_id: string;

          /** A username. */
          username: string;
        }
      }

      export interface ListRequest {
        /** An email address. */
        email?: string;

        /** The identity of a user or a service. */
        id?: string;

        /** A username. */
        username?: string;
      }

      /** Authenticator. */
      export interface Authenticator {
        /** An ID for an authenticator. */
        id: string;

        /** An authentication mechanism. */
        type: string;

        /** Enabled. */
        enabled: boolean;

        /** Provider. */
        provider?: string;

        /** Provider name. */
        provider_name?: string;

        /** RPID. */
        rpid: string;

        /** Phase. */
        phase: string;

        /** Enrolling browser. */
        enrolling_browser?: string;

        /** Enrolling IP. */
        enrolling_ip?: string;

        /** A time in ISO-8601 format. */
        created_at: string;

        /** A time in ISO-8601 format. */
        updated_at: string;

        /** State. */
        state?: string;
      }

      export interface ListResult {
        /** A list of authenticators. */
        authenticators: Authenticator[];
      }
    }

    export namespace Profile {
      export interface GetResult extends UserItem {}

      export namespace Get {
        export interface EmailRequest {
          /** An email address. */
          email: string;
        }

        export interface IDRequest {
          /** The identity of a user or a service. */
          id: string;
        }

        export interface UsernameRequest {
          /** A username. */
          username: string;
        }
      }

      export namespace Update {
        export interface Common {
          /** Updates to a user profile. */
          profile: Profile;
        }

        export interface EmailRequest extends Common {
          /** An email address. */
          email: string;
        }

        export interface IDRequest extends Common {
          /** The identity of a user or a service. */
          id: string;
        }

        export interface UsernameRequest extends Common {
          /** A username. */
          username: string;
        }
      }

      export interface UpdateResult extends UserItem {}
    }

    export namespace Update {
      export interface Options {
        /**
         * New disabled value. Disabling a user account will prevent them from
         * logging in.
         */
        disabled?: boolean;

        /**
         * Unlock a user account if it has been locked out due to failed
         * authentication attempts.
         */
        unlock?: boolean;
      }

      export interface EmailRequest extends Options {
        /** An email address. */
        email: string;
      }

      export interface IDRequest extends Options {
        /** The identity of a user or a service. */
        id: string;
      }

      export interface UsernameRequest extends Options {
        /** A username. */
        username: string;
      }
    }

    export interface UpdateResult extends UserItem {}
  }
}

export namespace AuthZ {
  export enum ItemOrder {
    ASC = "asc",
    DESC = "desc",
  }
  export enum TupleOrderBy {
    RESOURCE_NAMESPACE = "resource_namespace",
    RESOURCE_ID = "resource_id",
    RELATION = "relation",
    SUBJECT_NAMESPACE = "subject_namespace",
    SUBJECT_ID = "subject_id",
    SUBJECT_ACTION = "subject_action",
  }

  export interface Resource {
    type: string;
    id?: string;
  }

  export interface Subject {
    type: string;
    id: string;
    action?: string;
  }

  export interface Tuple {
    resource: Resource;
    relation: string;
    subject: Subject;
  }

  export interface TupleCreateRequest {
    tuples: Tuple[];
  }

  export interface TupleCreateResult {}

  export interface TupleListFilter {
    resource_type?: string;
    resource_type__contains?: string[];
    resource_type__in?: string[];
    resource_id?: string;
    resource_id__contains?: string[];
    resource_id__in?: string[];
    relation?: string;
    relation__contains?: string[];
    relation__in?: string[];
    subject_type?: string;
    subject_type__contains?: string[];
    subject_type__in?: string[];
    subject_id?: string;
    subject_id__contains?: string[];
    subject_id__in?: string[];
    subject_action?: string;
    subject_action__contains?: string[];
    subject_action__in?: string[];
  }

  export interface TupleListRequest {
    filter: TupleListFilter;
    size?: number;
    last?: string;
    order?: ItemOrder;
    order_by?: TupleOrderBy;
  }

  export interface TupleListResult {
    tuples: Tuple[];
    last: string;
    count: number;
  }

  export interface TupleDeleteRequest {
    tuples: Tuple[];
  }

  export interface TupleDeleteResult {}

  export interface CheckRequest {
    resource: Resource;
    action: string;
    subject: Subject;
    debug?: boolean;
    attributes?: Dictionary;
  }

  export interface DebugPath {
    type: string;
    id: string;
    action: string;
  }

  export interface Debug {
    path: DebugPath[];
  }

  export interface CheckResult {
    schema_id: string;
    schema_version: number;
    depth: number;
    allowed: boolean;
    debug?: Debug;
  }

  export interface ListResourcesRequest {
    type: string;
    action: string;
    subject: Subject;

    /** A JSON object of attribute data. */
    attributes?: Dictionary;
  }

  export interface ListResourcesResult {
    ids: string[];
  }

  export interface ListSubjectsRequest {
    resource: Resource;
    action: string;

    /** A JSON object of attribute data. */
    attributes?: Dictionary;
  }

  export interface ListSubjectsResult {
    subjects: Subject[];
  }
}

export namespace Sanitize {
  export interface SanitizeFile {
    /** Provider to use for File Scan. */
    scan_provider?: string;
  }

  export interface SanitizeContent {
    /** Perform URL Intel lookup. */
    url_intel?: boolean;

    /** Provider to use for URL Intel. */
    url_intel_provider?: string;

    /** Perform Domain Intel lookup. */
    domain_intel?: boolean;

    /** Provider to use for Domain Intel lookup. */
    domain_intel_provider?: string;

    /** Defang external links. */
    defang?: boolean;

    /** Defang risk threshold. */
    defang_threshold?: number;

    /** Redact sensitive content. */
    redact?: boolean;

    /**
     * If redact is enabled, avoids redacting the file and instead returns the
     * PII analysis engine results. Only works if redact is enabled.
     */
    redact_detect_only?: boolean;
  }

  export interface SanitizeShareOutput {
    /**
     * Store Sanitized files to Pangea Secure Share. If not enabled, a
     * presigned URL will be returned in 'result.dest_url'.
     */
    enabled?: boolean;

    /**
     * Store Sanitized files to this Secure Share folder (will be auto-created
     * if not exists).
     */
    output_folder?: string;
  }

  export interface SanitizeRequest {
    /** The transfer method used to upload the file data. */
    transfer_method: TransferMethod;

    /** A URL where the file to be Sanitized can be downloaded. */
    source_url?: string;

    /** A Pangea Secure Share ID where the file to be Sanitized is stored. */
    share_id?: string;

    /** File. */
    file?: SanitizeFile;

    /** Content. */
    content?: SanitizeContent;

    /** Share output. */
    share_output?: SanitizeShareOutput;

    /**
     * The size (in bytes) of the file. If the upload doesn't match, the call
     * will fail.
     */
    size?: number;

    /**
     * The CRC32C hash of the file data, which will be verified by the server if
     * provided.
     */
    crc32c?: string;

    /**
     * The hexadecimal-encoded SHA256 hash of the file data, which will be
     * verified by the server if provided.
     */
    sha256?: string;

    /**
     * Name of the user-uploaded file, required for transfer-method 'put-url'
     * and 'post-url'.
     */
    uploaded_file_name?: string;
  }

  export interface DefangData {
    /** Number of external links found. */
    external_urls_count?: number;

    /** Number of external domains found. */
    external_domains_count?: number;

    /** Number of items defanged per provided rules and detections. */
    defanged_count?: number;

    /** Processed N URLs: X are malicious, Y are suspicious, Z are unknown. */
    url_intel_summary?: string;

    /** Processed N Domains: X are malicious, Y are suspicious, Z are unknown. */
    domain_intel_summary?: string;
  }

  export interface RedactRecognizerResult {
    /** The entity name. */
    field_type: string;

    /** The certainty score that the entity matches this specific snippet. */
    score: number;

    /** The text snippet that matched. */
    text: string;

    /** The starting index of a snippet. */
    start: number;

    /** The ending index of a snippet. */
    end: number;

    /** Indicates if this rule was used to anonymize a text snippet. */
    redacted: boolean;
  }

  export interface RedactData {
    /** Number of items redacted. */
    redaction_count?: number;

    /** Summary counts. */
    summary_counts?: Dictionary;

    /** The scoring result of a set of rules. */
    recognizer_results?: RedactRecognizerResult[];
  }

  export interface SanitizeData {
    /** Defang. */
    defang?: DefangData;

    /** Redact. */
    redact?: RedactData;

    /** If the file scanned was malicious. */
    malicious_file?: boolean;
  }

  export interface SanitizeResult {
    /** A URL where the Sanitized file can be downloaded. */
    dest_url?: string;

    /** Pangea Secure Share ID of the Sanitized file. */
    dest_share_id?: string;

    /** Sanitize data. */
    data: SanitizeData;

    /** The parameters, which were passed in the request, echoed back. */
    parameters: Dictionary;
  }

  export interface Options {
    pollResultSync?: boolean;
  }
}

export namespace Share {
  export enum FileFormat {
    F3G2 = "3G2",
    F3GP = "3GP",
    F3MF = "3MF",
    F7Z = "7Z",
    A = "A",
    AAC = "AAC",
    ACCDB = "ACCDB",
    AIFF = "AIFF",
    AMF = "AMF",
    AMR = "AMR",
    APE = "APE",
    ASF = "ASF",
    ATOM = "ATOM",
    AU = "AU",
    AVI = "AVI",
    AVIF = "AVIF",
    BIN = "BIN",
    BMP = "BMP",
    BPG = "BPG",
    BZ2 = "BZ2",
    CAB = "CAB",
    CLASS = "CLASS",
    CPIO = "CPIO",
    CRX = "CRX",
    CSV = "CSV",
    DAE = "DAE",
    DBF = "DBF",
    DCM = "DCM",
    DEB = "DEB",
    DJVU = "DJVU",
    DLL = "DLL",
    DOC = "DOC",
    DOCX = "DOCX",
    DWG = "DWG",
    EOT = "EOT",
    EPUB = "EPUB",
    EXE = "EXE",
    FDF = "FDF",
    FITS = "FITS",
    FLAC = "FLAC",
    FLV = "FLV",
    GBR = "GBR",
    GEOJSON = "GEOJSON",
    GIF = "GIF",
    GLB = "GLB",
    GML = "GML",
    GPX = "GPX",
    GZ = "GZ",
    HAR = "HAR",
    HDR = "HDR",
    HEIC = "HEIC",
    HEIF = "HEIF",
    HTML = "HTML",
    ICNS = "ICNS",
    ICO = "ICO",
    ICS = "ICS",
    ISO = "ISO",
    JAR = "JAR",
    JP2 = "JP2",
    JPF = "JPF",
    JPG = "JPG",
    JPM = "JPM",
    JS = "JS",
    JSON = "JSON",
    JXL = "JXL",
    JXR = "JXR",
    KML = "KML",
    LIT = "LIT",
    LNK = "LNK",
    LUA = "LUA",
    LZ = "LZ",
    M3U = "M3U",
    M4A = "M4A",
    MACHO = "MACHO",
    MDB = "MDB",
    MIDI = "MIDI",
    MKV = "MKV",
    MOBI = "MOBI",
    MOV = "MOV",
    MP3 = "MP3",
    MP4 = "MP4",
    MPC = "MPC",
    MPEG = "MPEG",
    MQV = "MQV",
    MRC = "MRC",
    MSG = "MSG",
    MSI = "MSI",
    NDJSON = "NDJSON",
    NES = "NES",
    ODC = "ODC",
    ODF = "ODF",
    ODG = "ODG",
    ODP = "ODP",
    ODS = "ODS",
    ODT = "ODT",
    OGA = "OGA",
    OGV = "OGV",
    OTF = "OTF",
    OTG = "OTG",
    OTP = "OTP",
    OTS = "OTS",
    OTT = "OTT",
    OWL = "OWL",
    P7S = "P7S",
    PAT = "PAT",
    PDF = "PDF",
    PHP = "PHP",
    PL = "PL",
    PNG = "PNG",
    PPT = "PPT",
    PPTX = "PPTX",
    PS = "PS",
    PSD = "PSD",
    PUB = "PUB",
    PY = "PY",
    QCP = "QCP",
    RAR = "RAR",
    RMVB = "RMVB",
    RPM = "RPM",
    RSS = "RSS",
    RTF = "RTF",
    SHP = "SHP",
    SHX = "SHX",
    SO = "SO",
    SQLITE = "SQLITE",
    SRT = "SRT",
    SVG = "SVG",
    SWF = "SWF",
    SXC = "SXC",
    TAR = "TAR",
    TCL = "TCL",
    TCX = "TCX",
    TIFF = "TIFF",
    TORRENT = "TORRENT",
    TSV = "TSV",
    TTC = "TTC",
    TTF = "TTF",
    TXT = "TXT",
    VCF = "VCF",
    VOC = "VOC",
    VTT = "VTT",
    WARC = "WARC",
    WASM = "WASM",
    WAV = "WAV",
    WEBM = "WEBM",
    WEBP = "WEBP",
    WOFF = "WOFF",
    WOFF2 = "WOFF2",
    X3D = "X3D",
    XAR = "XAR",
    XCF = "XCF",
    XFDF = "XFDF",
    XLF = "XLF",
    XLS = "XLS",
    XLSX = "XLSX",
    XML = "XML",
    XPM = "XPM",
    XZ = "XZ",
    ZIP = "ZIP",
    ZST = "ZST",
  }

  export enum ArchiveFormat {
    TAR = "tar",
    ZIP = "zip",
  }

  export enum LinkType {
    UPLOAD = "upload",
    DOWNLOAD = "download",
    EDITOR = "editor",
  }
  export enum AuthenticatorType {
    EMAIL_OTP = "email_otp",
    PASSWORD = "password",
    SMS_OTP = "sms_otp",
    SOCIAL = "social",
  }

  export enum ItemOrder {
    ASC = "asc",
    DESC = "desc",
  }

  export enum ItemOrderBy {
    ID = "id",
    CREATED_AT = "created_at",
    NAME = "name",
    PARENT_ID = "parent_id",
    TYPE = "type",
    UPDATED_AT = "updated_at",
  }

  export interface Metadata {
    [key: string]: string;
  }

  export type Tags = string[];

  export interface ItemData {
    /**
     * The number of billable bytes (includes Metadata, Tags, etc.) for the
     * object.
     */
    billable_size?: number;

    /** The date and time the object was created. */
    created_at: string;

    /** The key in the external bucket that contains this file. */
    external_bucket_key: string;

    /** The explicit file TTL setting for this object. */
    file_ttl?: string;

    /**
     * The effective file TTL setting for this object, either explicitly set or
     * inherited (see file_ttl_from_id.)
     */
    file_ttl_effective?: string;

    /**
     * The ID of the object the expiry / TTL is set from. Either a service
     * configuration, the object itself, or a parent folder.
     */
    file_ttl_from_id?: string;

    /** The ID of a stored object. */
    id: string;

    /** The MD5 hash of the file contents. */
    md5?: string;

    /**
     * A set of string-based key/value pairs used to provide additional data
     * about an object.
     */
    metadata?: Metadata;

    /** Protected (read-only) metadata. */
    metadata_protected?: Metadata;

    /** The name of the object. */
    name: string;

    /** The parent ID (a folder). Blanks means the root folder. */
    parent_id: string;

    /** The SHA256 hash of the file contents. */
    sha256?: string;

    /** The SHA512 hash of the file contents. */
    sha512?: string;

    /** The size of the object in bytes. */
    size?: number;

    /** A list of user-defined tags. */
    tags?: Tags;

    /** Protected (read-only) flags. */
    tags_protected?: Tags;

    /** The type of the item (file or dir). */
    type: string;

    /** The date and time the object was last updated. */
    updated_at: string;
  }

  export interface DeleteRequest {
    /**
     * The ID of the object to delete.
     */
    id?: string;

    /**
     * If true, delete a folder even if it's not empty. Deletes the contents of
     * folder as well.
     */
    force?: boolean;

    /**
     * The path of the object to delete.
     */
    path?: string;

    /** The bucket to use, if not the default. */
    bucket_id?: string;
  }

  export interface Authenticator {
    /**
     * An authentication mechanism.
     */
    auth_type: AuthenticatorType;

    /**
     * An email address.
     */
    auth_context: string;
  }

  export interface Bucket {
    /** The ID of a share bucket resource. */
    id: string;

    /** If true, is the default bucket. */
    default: boolean;

    /** The bucket's friendly name. */
    name: string;
    transfer_methods: TransferMethod[];
  }

  export interface BucketsResult {
    /** A list of available buckets. */
    buckets: Bucket[];
  }

  export interface DeleteResult {
    /**
     * Number of objects deleted.
     */
    count: number;
  }

  export interface FolderCreateRequest {
    /**
     * The name of an object.
     */
    name?: string;

    /** Duration until files within this folder are automatically deleted. */
    file_ttl?: string;

    /**
     * A set of string-based key/value pairs used to provide additional data
     * about an object.
     */
    metadata?: Metadata;

    /**
     * The ID of a stored object.
     */
    parent_id?: string;

    /**
     * The folder to place the folder in. Must match `parent_id` if also set.
     */
    folder?: string;

    /**
     * A list of user-defined tags.
     */
    tags?: Tags;

    /** The bucket to use, if not the default. */
    bucket_id?: string;
  }

  export interface FolderCreateResult {
    object: ItemData;
  }

  export interface GetRequest {
    /** The bucket to use, if not the default. */
    bucket_id?: string;

    /** The ID of the object to retrieve. */
    id?: string;

    /** The requested transfer method for the file data. */
    transfer_method?: TransferMethod;

    /** If the file was protected with a password, the password to decrypt with. */
    password?: string;
  }

  export interface GetResult {
    object: ItemData;

    /** A URL where the file can be downloaded from. */
    dest_url?: string;
  }

  export interface PutRequest {
    /** The bucket to use, if not the default. */
    bucket_id?: string;

    /**
     * The hexadecimal-encoded CRC32C hash of the file data, which will be
     * verified by the server if provided.
     */
    crc32c?: string;

    /**
     * The format of the file, which will be verified by the server if provided.
     * Uploads not matching the supplied format will be rejected.
     */
    format?: FileFormat;

    /**
     * The hexadecimal-encoded MD5 hash of the file data, which will be verified
     * by the server if provided.
     */
    md5?: string;

    /**
     * A set of string-based key/value pairs used to provide additional data
     * about an object.
     */
    metadata?: Metadata;

    /**
     * The MIME type of the file, which will be verified by the server if
     * provided. Uploads not matching the supplied MIME type will be rejected.
     */
    mimetype?: string;

    /** The name of the object to store. */
    name?: string;

    /**
     * The parent ID of the object (a folder). Leave blank to keep in the root
     * folder.
     */
    parent_id?: string;

    /**
     * The path to the parent folder. Leave blank for the root folder. Path must
     * resolve to parent_id if also set.
     */
    folder?: string;

    /** The TTL before expiry for the file. */
    file_ttl?: string;

    /** An optional password to protect the file with. Downloading the file will require this password. */
    password?: string;

    /** An optional password algorithm to protect the file with. See symmetric vault password_algorithm. */
    password_algorithm?: string;

    /**
     * The hexadecimal-encoded SHA1 hash of the file data, which will be
     * verified by the server if provided.
     */
    sha1?: string;

    /**
     * The SHA256 hash of the file data, which will be verified by the server
     * if provided.
     */
    sha256?: string;

    /**
     * The hexadecimal-encoded SHA512 hash of the file data, which will be
     * verified by the server if provided.
     */
    sha512?: string;

    /**
     * The size (in bytes) of the file. If the upload doesn't match, the call
     * will fail.
     */
    size?: number;

    /** The URL to fetch the file payload from (for transfer_method source-url). */
    source_url?: string;

    /** A list of user-defined tags */
    tags?: Tags;

    /** The transfer method used to upload the file data. */
    transfer_method?: TransferMethod;
  }

  export interface PutResult {
    object: ItemData;
  }

  export interface UpdateRequest {
    /**
     * A list of metadata key/values to set in the object. If a provided key
     * exists, the value will be replaced.
     */
    add_metadata?: Metadata;

    /**
     * A list of tags to add. It is not an error to provide a tag which already
     * exists.
     */
    add_tags?: Tags;

    /** Set the file TTL. */
    file_ttl?: string;

    /** The bucket to use, if not the default. */
    bucket_id?: string;

    /** Protect the file with the supplied password. */
    add_password?: string;

    /** The algorithm to use to password protect the file. */
    add_password_algorithm?: string;

    /** An identifier for the file to update. */
    id: string;

    /** Set the object's metadata. */
    metadata?: Metadata;

    /** Set the parent (folder) of the object. */
    parent_id?: string;

    /**
     * Set the parent (folder). Leave blank for the root folder. Path must
     * resolve to parent_id if also set.
     */
    folder?: string;

    /**
     * A list of metadata key/values to remove in the object. It is not an
     * error for a provided key to not exist. If a provided key exists but
     * doesn't match the provided value, it will not be removed.
     */
    remove_metadata?: Metadata;

    /** Remove the supplied password from the file. */
    remove_password?: string;

    /**
     * A list of tags to remove. It is not an error to provide a tag which is
     * not present.
     */
    remove_tags?: Tags;

    /** Set the object's tags. */
    tags?: Tags;

    /**
     * The date and time the object was last updated. If included, the update
     * will fail if this doesn't match the date and time of the last update for
     * the object.
     */
    updated_at?: string;
  }

  export interface UpdateResult {
    object: ItemData;
  }

  export interface ListFilter {
    /** Only records where created_at equals this value. */
    created_at?: string;

    /** Only records where created_at is greater than this value. */
    created_at__gt?: string;

    /** Only records where created_at is greater than or equal to this value. */
    created_at__gte?: string;

    /** Only records where created_at is less than this value. */
    created_at__lt?: string;

    /** Only records where created_at is less than or equal to this value. */
    created_at__lte?: string;

    /**
     * Only records where the object exists in the supplied parent folder path
     * name.
     */
    folder?: string;

    /** Only records where id equals this value. */
    id?: string;

    /** Only records where id equals one of the provided substrings. */
    id__in?: string[];

    /** Only records where name equals this value. */
    name?: string;

    /** Only records where name includes each substring. */
    name__contains?: string[];

    /** Only records where name equals one of the provided substrings. */
    name__in?: string[];

    /** Only records where parent_id equals this value. */
    parent_id?: string;

    /** Only records where parent_id equals one of the provided substrings. */
    parent_id__in?: string[];

    /** Only records where size equals this value. */
    size?: number;

    /** Only records where size is greater than this value. */
    size__gt?: number;

    /** Only records where size is greater than or equal to this value. */
    size__gte?: number;

    /** Only records where size is less than to this value. */
    size__lt?: number;

    /** Only records where size is less than or equal to this value. */
    size__lte?: number;

    /** A list of tags that all must be present. */
    tags?: string[];

    /** Only records where type equals this value. */
    type?: string;

    /** Only records where type includes each substring. */
    type__contains?: string[];

    /** Only records where type equals one of the provided substrings. */
    type__in?: string[];

    /** Only records where updated_at equals this value. */
    updated_at?: string;

    /** Only records where updated_at is greater than this value. */
    updated_at__gt?: string;

    /** Only records where updated_at is greater than or equal to this value. */
    updated_at__gte?: string;

    /** Only records where updated_at is less than this value. */
    updated_at__lt?: string;

    /** Only records where updated_at is less than or equal to this value. */
    updated_at__lte?: string;
  }

  export interface ListRequest {
    /** The bucket to use, if not the default. */
    bucket_id?: string;

    /** If true, include the `external_bucket_key` in results. */
    include_external_bucket_key?: boolean;

    filter?: ListFilter;

    /**
     * Reflected value from a previous response to obtain the next page of
     * results.
     */
    last?: string;

    /** Order results asc(ending) or desc(ending). */
    order?: ItemOrder;

    /** Which field to order results by. */
    order_by?: ItemOrderBy;

    /** Maximum results to include in the response. */
    size?: number;
  }

  export interface ListResult {
    /** The total number of objects matched by the list request. */
    count: number;

    /**
     * Used to fetch the next page of the current listing when provided in a
     * repeated request's last parameter.
     */
    last?: string;
    objects: ItemData[];
  }

  export interface GetArchiveRequest {
    /** The bucket to use, if not the default. */
    bucket_id?: string;

    /**
     * The IDs of the objects to include in the archive. Folders include all
     * children.
     */
    ids: string[];

    /** The format to use to build the archive. */
    format?: ArchiveFormat;

    /** The requested transfer method for the file data. */
    transfer_method?: TransferMethod;
  }

  export interface GetArchiveResult {
    /** A location where the archive can be downloaded from. */
    dest_url?: string;

    /** Number of objects included in the archive. */
    count: number;

    /** A list of all objects included in the archive. */
    objects?: ItemData[];
  }

  export interface Authenticator {
    /** An authentication mechanism. */
    auth_type: AuthenticatorType;

    /** An email address. */
    auth_context: string;
  }

  export interface ShareLinkCreateItem {
    /** List of storage IDs. */
    targets: string[];

    /** Type of link. */
    link_type?: LinkType;

    /** The date and time the share link expires. */
    expires_at?: string;

    /**
     * The maximum number of times a user can be authenticated to access the
     * share link.
     */
    max_access_count?: number;

    /** A list of authenticators. */
    authenticators: Authenticator[];

    /** An optional message to use in accessing shares. */
    message?: string;

    /** An optional title to use in accessing shares. */
    title?: string;

    /** An email address. */
    notify_email?: string;

    /** A list of user-defined tags. */
    tags?: Tags;
  }

  export interface ShareLinkCreateRequest {
    links: ShareLinkCreateItem[];
  }

  export interface ShareLinkItem {
    /** The ID of a share link. */
    id: string;

    /** The ID of a share bucket resource. */
    bucket_id: string;

    /** List of storage IDs. */
    targets: string[];

    /** Type of link. */
    link_type: string;

    /**
     * The number of times a user has authenticated to access the share link.
     */
    access_count: number;

    /**
     * The maximum number of times a user can be authenticated to access the
     * share link.
     */
    max_access_count: number;

    /** The date and time the share link was created. */
    created_at: string;

    /** The date and time the share link expires. */
    expires_at: string;

    /** The date and time the share link was last accessed. */
    last_accessed_at?: string;

    /** A list of authenticators */
    authenticators: Authenticator[];

    /** A URL to access the file/folders shared with a link. */
    link: string;

    /** An optional message to use in accessing shares. */
    message?: string;

    /** An optional title to use in accessing shares. */
    title?: string;

    /** An email address. */
    notify_email?: string;

    /** A list of user-defined tags. */
    tags?: Tags;
  }

  export interface ShareLinkCreateResult {
    share_link_objects: ShareLinkItem[];
  }

  export interface ShareLinkGetRequest {
    /** The ID of a share link. */
    id: string;
  }

  export interface ShareLinkGetResult {
    share_link_object: ShareLinkItem;
  }

  export interface ShareLinkListFilter {
    /** Only records where id equals this value. */
    id?: string;

    /** Only records where id includes each substring. */
    id__contains?: string[];

    /** Only records where id equals one of the provided substrings. */
    id__in?: string[];

    /** Only records where target_id equals this value. */
    target_id?: string;

    /** Only records where target_id includes each substring. */
    target_id__contains?: string[];

    /** Only records where target_id equals one of the provided substrings. */
    target_id__in?: string[];

    /** Only records where link_type equals this value. */
    link_type?: string;

    /** Only records where link_type includes each substring. */
    link_type__contains?: string[];

    /** Only records where link_type equals one of the provided substrings. */
    link_type__in?: string[];

    /** Only records where access_count equals this value. */
    access_count?: number;

    /** Only records where access_count is greater than this value. */
    access_count__gt?: number;

    /** Only records where access_count is greater than or equal to this value. */
    access_count__gte?: number;

    /** Only records where access_count is less than this value. */
    access_count__lt?: number;

    /** Only records where access_count is less than or equal to this value. */
    access_count__lte?: number;

    /** Only records where max_access_count equals this value. */
    max_access_count?: number;

    /** Only records where max_access_count is greater than this value. */
    max_access_count__gt?: number;

    /** Only records where max_access_count is greater than or equal to this value. */
    max_access_count__gte?: number;

    /** Only records where max_access_count is less than this value. */
    max_access_count__lt?: number;

    /** Only records where max_access_count is less than or equal to this value. */
    max_access_count__lte?: number;

    /** Only records where created_at equals this value. */
    created_at?: string;

    /** Only records where created_at is greater than this value. */
    created_at__gt?: string;

    /** Only records where created_at is greater than or equal to this value. */
    created_at__gte?: string;

    /** Only records where created_at is less than this value. */
    created_at__lt?: string;

    /** Only records where created_at is less than or equal to this value. */
    created_at__lte?: string;

    /** Only records where expires_at equals this value. */
    expires_at?: string;

    /** Only records where expires_at is greater than this value. */
    expires_at__gt?: string;

    /** Only records where expires_at is greater than or equal to this value. */
    expires_at__gte?: string;

    /** Only records where expires_at is less than this value. */
    expires_at__lt?: string;

    /** Only records where expires_at is less than or equal to this value. */
    expires_at__lte?: string;

    /** Only records where last_accessed_at equals this value. */
    last_accessed_at?: string;

    /** Only records where last_accessed_at is greater than this value. */
    last_accessed_at__gt?: string;

    /** Only records where last_accessed_at is greater than or equal to this value. */
    last_accessed_at__gte?: string;

    /** Only records where last_accessed_at is less than this value. */
    last_accessed_at__lt?: string;

    /** Only records where last_accessed_at is less than or equal to this value. */
    last_accessed_at__lte?: string;

    /** Only records where link equals this value. */
    link?: string;

    /** Only records where link includes each substring. */
    link__contains?: string[];

    /** Only records where link equals one of the provided substrings. */
    link__in?: string[];
  }

  export interface ShareLinkListRequest {
    /** The bucket to use, if not the default. */
    bucket_id?: string;

    filter?: ShareLinkListFilter;

    /** Reflected value from a previous response to obtain the next page of results. */
    last?: string;

    /** Order results asc(ending) or desc(ending). */
    order?: ItemOrder;

    /** Which field to order results by. */
    order_by?: ItemOrderBy;

    /** Maximum results to include in the response. */
    size?: number;
  }

  export interface ShareLinkListResult {
    /** The total number of share links matched by the list request. */
    count: number;

    /** Used to fetch the next page of the current listing when provided in a repeated request's last parameter. */
    last?: string;

    share_link_objects: ShareLinkItem[];
  }

  export interface ShareLinkDeleteRequest {
    /** The bucket to use, if not the default. */
    bucket_id?: string;

    ids: string[];
  }

  export interface ShareLinkDeleteResult {
    share_link_objects: ShareLinkItem[];
  }

  export interface ShareLinkSendItem {
    /** The ID of a share link. */
    id: string;

    /** An email address. */
    email: string;
  }

  export interface ShareLinkSendRequest {
    links: ShareLinkSendItem[];

    /** An email address. */
    sender_email: string;
    sender_name?: string;
  }

  export interface ShareLinkSendResult {
    share_link_objects: ShareLinkItem[];
  }
}
