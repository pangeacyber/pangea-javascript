import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { Intel } from "@src/types.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { PangeaErrors } from "@src/errors.js";

const hashType = "sha256";

/**
 * FileIntelService class provides methods for interacting with the File Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://pangea.cloud/docs/api/file-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *     User Console at [https://console.pangea.cloud/service/file-intel](https://console.pangea.cloud/service/file-intel)
 *
 * Examples:
 *    import { PangeaConfig, FileIntelService } from "node-pangea";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_TOKEN;
 *    const config = new PangeaConfig({ domain });
 *
 *    const fileIntel = new FileIntelService(token, config);
 *    const options = { provider: "reversinglabs", verbose: true };
 *
 *    const response = await fileIntel.lookup("142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e", "sha256", options);
 */
export class FileIntelService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("file-intel", token, config);
  }

  /**
   * @summary Reputation, from file hash
   * @description Retrieve hash-based file reputation from a provider, including an optional detailed report.
   * @param {String} fileHash - Hash of the file to be looked up
   * @param {String} hashType - Type of hash, can be "sha256", "sha" or "md5"
   * @param {Object} options - An object of optional parameters
   * @param {String} options.provider - Provider of the reputation information. ("reversinglabs"). Default provider defined by the configuration.
   * @param {Boolean} options.verbose - Echo back the parameters of the API in the response. Default: verbose=false.
   * @param {Boolean} options.raw - Return additional details from the provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * ```js
   * const response = await fileIntel.hashReputation(
   *   "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
   *   "sha256",
   *   { provider: "reversinglabs" }
   * );
   * ```
   */
  hashReputation(
    fileHash: string,
    hashType: string,
    options?: Intel.File.ReputationOptions
  ): Promise<PangeaResponse<Intel.File.ReputationResult>> {
    const data: Intel.File.ReputationRequest = {
      hash: fileHash,
      hash_type: hashType,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/reputation", data);
  }

  /**
   * @summary Reputation, from file path
   * @description Retrieve file reputation from a provider, using the file's hash.
   * @operationId file_intel_post_v1_reputation
   * @param {String} filepath - Path to the file to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "reversinglabs".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * ```js
   * const response = await fileIntel.filepathReputation(
   *   "./myfile.exe",
   *   { provider: "reversinglabs" }
   * );
   * ```
   */
  filepathReputation(
    filepath: string,
    options?: Intel.File.ReputationOptions
  ): Promise<PangeaResponse<Intel.File.ReputationResult>> {
    const content = readFileSync(filepath);
    const fileHash = createHash(hashType).update(content).digest("hex");

    const data: Intel.File.ReputationRequest = {
      hash: fileHash,
      hash_type: hashType,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/reputation", data);
  }
}

/**
 * DomainIntelService class provides methods for interacting with the Domain Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://pangea.cloud/docs/api/domain-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *     User Console at [https://console.pangea.cloud/service/domain-intel](https://console.pangea.cloud/service/domain-intel)
 *
 * Examples:
 *  import { PangeaConfig, DomainIntelService } from "node-pangea";
 *
 *  const domain = process.env.PANGEA_DOMAIN;
 *  const token = process.env.PANGEA_TOKEN;
 *  const config = new PangeaConfig({ domain });
 *
 *  const domainIntel = new DomainIntelService(token, config);
 *  const options = { provider: "domaintools", verbose: true };
 *
 *  const response = await domainIntel.lookup("teoghehofuuxo", options);
 */
export class DomainIntelService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("domain-intel", token, config);
  }

  /**
   * @summary Reputation check
   * @description Retrieve reputation for a domain from a provider, including an optional detailed report.
   * @operationId domain_intel_post_v1_reputation
   * @param {String} domain - The domain to be looked up.
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from these providers: "crowdstrike" or "domaintools".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * ```js
   * const response = await domainIntel.reputation(
   *   "google.com"
   * );
   * ```
   */
  reputation(
    domain: string,
    options?: Intel.Domain.ReputationOptions
  ): Promise<PangeaResponse<Intel.Domain.ReputationResult>> {
    const data: Intel.Domain.ReputationRequest = {
      domain,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/reputation", data);
  }

  /**
   * @summary WhoIs
   * @description Retrieve who is for a domain from a provider, including an optional detailed report.
   * @operationId domain_intel_post_v1_whois
   * @param {String} domain - The domain to query.
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "whoisxml".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the whois endpoint.
   * @example
   * ```js
   * const response = await domainIntel.whoIs(
   *   "google.com",
   *   {
   *     verbose: true,
   *     raw: true,
   *   }
   * );
   * ```
   */
  whoIs(
    domain: string,
    options?: Intel.Domain.WhoIsOptions
  ): Promise<PangeaResponse<Intel.Domain.WhoIsResult>> {
    const data: Intel.Domain.WhoIsRequest = {
      domain,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/whois", data);
  }
}

/**
 * IPIntelService class provides methods for interacting with the IP Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://docs.pangea.cloud/docs/api/ip-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *
 * Examples:
 *    import { PangeaConfig, IPIntelService } from "node-pangea";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_IP_INTEL_TOKEN;
 *    const config = new PangeaConfig({ domain });
 *
 *    const ipIntel = new IPIntelService(token, config);
 *    const options = { provider: "crowdstrike", verbose: true };
 *
 *    const response = await ipIntel.lookup("93.231.182.110", options);
 */
export class IPIntelService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("ip-intel", token, config);
  }

  /**
   * @summary Reputation
   * @description Retrieve a reputation score for an IP address from a provider, including an optional detailed report.
   * @operationId ip_intel_post_v1_reputation
   * @param {String} ip - Geolocate this IP and check the corresponding country against
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "crowdstrike".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the /reputation endpoint.
   * @example
   * ```js
   * const response = await ipIntel.reputation(
   *   "1.1.1.1",
   *   {
   *     provider: "crowdstrike"
   *   }
   * );
   * ```
   */
  reputation(
    ip: string,
    options?: Intel.IP.ReputationOptions
  ): Promise<PangeaResponse<Intel.IP.ReputationResult>> {
    const data: Intel.IP.ReputationParams = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/reputation", data);
  }

  /**
   * @summary Geolocate
   * @description Retrieve geolocation information for an IP address from a provider, including an optional detailed report.
   * @operationId ip_intel_post_v1_geolocate
   * @param {String} ip - The IP to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use geolocation data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the geolocate endpoint.
   * @example
   * ```js
   * const response = await ipIntel.geolocate(
   *   "1.1.1.1",
   *   {
   *     provider: "digitalelement"
   *   }
   * );
   * ```
   */
  geolocate(
    ip: string,
    options?: Intel.IP.GeolocateOptions
  ): Promise<PangeaResponse<Intel.IP.GeolocateResult>> {
    const data: Intel.IP.GeolocateRequest = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/geolocate", data);
  }

  /**
   * @summary Domain
   * @description Retrieve the domain name associated with an IP address.
   * @operationId ip_intel_post_v1_domain
   * @param {String} ip - The IP to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the domain endpoint.
   * @example
   * ```js
   * const response = await ipIntel.getDomain(
   *   "1.1.1.1",
   *   {
   *     provider: "digitalelement"
   *   }
   * );
   * ```
   */
  getDomain(
    ip: string,
    options?: Intel.IP.DomainOptions
  ): Promise<PangeaResponse<Intel.IP.DomainResult>> {
    const data: Intel.IP.DomainRequest = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/domain", data);
  }

  /**
   * @summary VPN
   * @description Determine if an IP address is provided by a VPN service.
   * @operationId ip_intel_post_v1_vpn
   * @param {String} ip - The IP to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the vpn endpoint.
   * @example
   * ```js
   * const response = await ipIntel.isVPN(
   *   "1.1.1.1",
   *   {
   *     provider: "digitalelement"
   *   }
   * );
   * ```
   */
  isVPN(ip: string, options?: Intel.IP.VPNOptions): Promise<PangeaResponse<Intel.IP.VPNResult>> {
    const data: Intel.IP.VPNRequest = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/vpn", data);
  }

  /**
   * @summary Proxy
   * @description Determine if an IP address is provided by a proxy service.
   * @operationId ip_intel_post_v1_proxy
   * @param {String} ip - The IP to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the vpn endpoint.
   * @example
   * ```js
   * const response = await ipIntel.isProxy(
   *   "1.1.1.1",
   *   {
   *     provider: "digitalelement"
   *   }
   * );
   * ```
   */
  isProxy(
    ip: string,
    options?: Intel.IP.ProxyOptions
  ): Promise<PangeaResponse<Intel.IP.ProxyResult>> {
    const data: Intel.IP.ProxyRequest = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/proxy", data);
  }
}

/**
 * URLIntelService class provides methods for interacting with the URL Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://docs.pangea.cloud/docs/api/file-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *
 * Examples:
 *    import { PangeaConfig, URLIntelService } from "pangea-node-sdk";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_TOKEN;
 *    const config = new PangeaConfig({ domain });
 *
 *    const urlIntel = new URLIntelService(token, config);
 *    const options = { provider: "crowdstrike", verbose: true };
 *
 *    const response = await urlIntel.lookup("http://113.235.101.11:54384", options);
 */
export class URLIntelService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("url-intel", token, config);
  }

  /**
   * @summary Reputation check
   * @description Retrieve a reputation score for a URL from a provider, including an optional detailed report.
   * @operationId url_intel_post_v1_reputation
   * @param {String} url - The URL to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "crowdstrike".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * ```js
   * const response = await urlIntel.reputation(
   *   "http://113.235.101.11:54384,
   *   {
   *     provider: "crowdstrike"
   *   }
   * );
   * ```
   */
  reputation(
    url: string,
    options?: Intel.URL.ReputationOptions
  ): Promise<PangeaResponse<Intel.URL.ReputationResult>> {
    const data: Intel.URL.ReputationRequest = {
      url,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/reputation", data);
  }
}

// User

/**
 * UserIntelService class provides methods for interacting with the User Intel Service
 * @extends BaseService
 *
 * Documentation
 *   https://docs.pangea.cloud/docs/api/file-intel
 *
 * The following information is needed:
 *   PANGEA_TOKEN - service token which can be found on the Pangea User
 *     Console at [https://console.pangea.cloud/project/tokens](https://console.pangea.cloud/project/tokens)
 *
 * Examples:
 *    import { PangeaConfig, UserIntelService } from "pangea-node-sdk";
 *
 *    const domain = process.env.PANGEA_DOMAIN;
 *    const token = process.env.PANGEA_TOKEN;
 *    const config = new PangeaConfig({ domain });
 *
 *    const userIntel = new UserIntelService(token, config);
 *    const options = { provider: "spycloud", verbose: true };
 *    const response = await userIntel.passwordBreached(Intel.HashType.SHA256, "5baa6", options);
 */
export class UserIntelService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("user-intel", token, config);
  }

  /**
   * @summary Look up breached users
   * @description Find out if an email address, username, phone number, or IP address was exposed in a security breach.
   * @operationId user_intel_post_v1_user_breached
   * @param {BrechedRequest} request - Request to be send to user/breached endpoint
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use breached data from this provider: "spycloud".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the user/breached endpoint.
   * @example
   *  const request = {phone_number: "8005550123", verbose: true, raw: true };
   *  const response = await userIntel.userBreached(request);
   */
  userBreached(
    request: Intel.User.User.BreachedRequest
  ): Promise<PangeaResponse<Intel.User.User.BreachedResult>> {
    return this.post("v1/user/breached", request);
  }

  /**
   * @summary Look up breached passwords
   * @description Find out if a password has been exposed in security breaches by providing a 5 character prefix of the password hash.
   * @operationId user_intel_post_v1_password_breached
   * @param {String} hashType - Hash type to be looked up
   * @param {String} hashPrefix - The prefix of the hash to be looked up.
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use breached data from this provider: "spycloud".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the password/breached endpoint.
   * @example
   * const options = {provider: "spycloud", verbose: true, raw: true };
   * const response = await userIntel.passwordBreached(Intel.HashType.SHA256, "5baa6", options);
   */
  passwordBreached(
    hashType: Intel.HashType,
    hashPrefix: string,
    options: Intel.User.Password.BreachedOptions
  ): Promise<PangeaResponse<Intel.User.User.BreachedResult>> {
    const data: Intel.User.Password.BreachedRequest = {
      hash_type: hashType,
      hash_prefix: hashPrefix,
    };
    Object.assign(data, options);

    return this.post("v1/password/breached", data);
  }

  static isPasswordBreached(
    response: PangeaResponse<Intel.User.User.BreachedResult>,
    hash: string
  ): Intel.User.Password.PasswordStatus {
    if (response.result.raw_data === undefined) {
      throw new PangeaErrors.PangeaError(
        "Need raw data to check if hash is breached. Send request with raw=true"
      );
    }

    const hashData = response.result.raw_data[hash];
    if (hashData != undefined) {
      // If hash is present in raw data, it's because it was breached
      return Intel.User.Password.PasswordStatus.BREACHED;
    } else if (Object.keys(response.result.raw_data).length >= 1000) {
      // If it's not present, should check if I have all breached hash
      // Server will return a maximum of 1000 hash, so if breached count is greater than that,
      // I can't conclude is password is or is not breached
      return Intel.User.Password.PasswordStatus.INCONCLUSIVE;
    } else {
      return Intel.User.Password.PasswordStatus.UNBREACHED;
    }
  }
}
