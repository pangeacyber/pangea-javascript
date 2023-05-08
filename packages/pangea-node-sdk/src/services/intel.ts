import PangeaResponse from "../response.js";
import BaseService from "./base.js";
import PangeaConfig from "../config.js";
import { Intel } from "../types.js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

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
    this.apiVersion = "v1";
  }

  /**
   * @deprecated Since version 1.2.0. Use hashReputation instead.
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
   * const options = { provider: "reversinglabs" };
   * const response = await fileIntel.lookup("142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e", "sha256", options);
   */
  lookup(
    fileHash: string,
    hashType: string,
    options?: Intel.Options
  ): Promise<PangeaResponse<Intel.Response>> {
    const data: Intel.FileParams = {
      hash: fileHash,
      hash_type: hashType,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("reputation", data);
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
   * const options = { provider: "reversinglabs" };
   * const response = await fileIntel.hashReputation("142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e", "sha256", options);
   */
  hashReputation(
    fileHash: string,
    hashType: string,
    options?: Intel.File.ReputationOptions
  ): Promise<PangeaResponse<Intel.File.ReputationResult>> {
    const data: Intel.File.ReputationParams = {
      hash: fileHash,
      hash_type: hashType,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("reputation", data);
  }

  /**
   * @deprecated Since version 1.2.0. Use filepathReputation instead.
   * @summary Reputation, from file path
   * @description Retrieve file reputation from a provider, using the file's hash.
   * @param {String} fileHash - Hash of the file to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "reversinglabs".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * const options = { provider: "reversinglabs" };
   * const response = await fileIntel.lookupFilepath("./myfile.exe", options);
   */
  lookupFilepath(
    filepath: string,
    options?: Intel.Options
  ): Promise<PangeaResponse<Intel.Response>> {
    const content = readFileSync(filepath);
    const fileHash = createHash(hashType).update(content).digest("hex");

    const data: Intel.FileParams = {
      hash: fileHash,
      hash_type: hashType,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("reputation", data);
  }

  /**
   * @summary Reputation, from file path
   * @description Retrieve file reputation from a provider, using the file's hash.
   * @param {String} fileHash - Hash of the file to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "reversinglabs".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * const options = { provider: "reversinglabs" };
   * const response = await fileIntel.filepathReputation("./myfile.exe", options);
   */
  filepathReputation(
    filepath: string,
    options?: Intel.File.ReputationOptions
  ): Promise<PangeaResponse<Intel.File.ReputationResult>> {
    const content = readFileSync(filepath);
    const fileHash = createHash(hashType).update(content).digest("hex");

    const data: Intel.File.ReputationParams = {
      hash: fileHash,
      hash_type: hashType,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("reputation", data);
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
    this.apiVersion = "v1";
  }

  /**
   * @deprecated Since version 1.2.0. Use reputation instead.
   * @summary Reputation check
   * @description Retrieve reputation for a domain from a provider, including an optional detailed report.
   * @param {String} domain - Domain address to be looked up.
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from these providers: "reversinglabs" or "domaintools".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * const response = await domainIntel.lookup("google.com")
   */
  lookup(domain: string, options?: Intel.Options): Promise<PangeaResponse<Intel.Response>> {
    const data: Intel.DomainParams = {
      domain,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("reputation", data);
  }

  /**
   * @summary Reputation check
   * @description Retrieve reputation for a domain from a provider, including an optional detailed report.
   * @param {String} domain - Domain address to be looked up.
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from these providers: "reversinglabs" or "domaintools".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * const response = await domainIntel.reputation("google.com")
   */
  reputation(
    domain: string,
    options?: Intel.Domain.ReputationOptions
  ): Promise<PangeaResponse<Intel.Domain.ReputationResult>> {
    const data: Intel.Domain.ReputationParams = {
      domain,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("reputation", data);
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
    this.apiVersion = "v1";
  }

  /**
   * @deprecated Since version 1.2.0. Use reputation instead.
   * @summary Reputation
   * @description Retrieve a reputation score for an IP address from a provider, including an optional detailed report.
   * @param {String} ip - Geolocate this IP and check the corresponding country against
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "crowdstrike".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the /reputation endpoint.
   * @example
   * const options = {
   *   provider: "crowdstrike"
   * };
   *
   * const response = await ipIntel.lookup(
   *   "1.1.1.1",
   *   options
   * );
   */
  lookup(ip: string, options?: Intel.Options): Promise<PangeaResponse<Intel.Response>> {
    const data: Intel.IPParams = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("reputation", data);
  }

  /**
   * @summary Reputation
   * @description Retrieve a reputation score for an IP address from a provider, including an optional detailed report.
   * @param {String} ip - Geolocate this IP and check the corresponding country against
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "crowdstrike".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the /reputation endpoint.
   * @example
   * const options = {
   *   provider: "reversinglabs"
   * };
   *
   * const response = await ipIntel.reputation(
   *   "1.1.1.1",
   *   options
   * );
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

    return this.post("reputation", data);
  }

  /**
   * @summary Geolocate
   * @description Retrieve geolocation information for an IP address from a provider, including an optional detailed report.
   * @param {String} ip - The IP to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use geolocation data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the geolocate endpoint.
   * @example
   * const options = {
   *   provider: "digitalelement"
   * };
   *
   * const response = await ipIntel.geolocate(
   *   "1.1.1.1",
   *   options
   * );
   */
  geolocate(
    ip: string,
    options?: Intel.Options
  ): Promise<PangeaResponse<Intel.IP.GeolocateResult>> {
    const data: Intel.IPParams = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("geolocate", data);
  }

  /**
   * @summary Domain
   * @description Retrieve the domain name associated with an IP address.
   * @param {String} ip - The IP to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the domain endpoint.
   * @example
   * const options = {
   *   provider: "digitalelement"
   * };
   *
   * const response = await ipIntel.getDomain(
   *   "1.1.1.1",
   *   options
   * );
   */
  getDomain(ip: string, options?: Intel.Options): Promise<PangeaResponse<Intel.IP.DomainResult>> {
    const data: Intel.IPParams = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("domain", data);
  }

  /**
   * @summary VPN
   * @description Determine if an IP address is provided by a VPN service.
   * @param {String} ip - The IP to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the vpn endpoint.
   * @example
   * const options = {
   *   provider: "digitalelement"
   * };
   *
   * const response = await ipIntel.isVPN(
   *   "1.1.1.1",
   *   options
   * );
   */
  isVPN(ip: string, options?: Intel.Options): Promise<PangeaResponse<Intel.IP.VPNResult>> {
    const data: Intel.IPParams = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("vpn", data);
  }

  /**
   * @summary Proxy
   * @description Determine if an IP address is provided by a proxy service.
   * @param {String} ip - The IP to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the vpn endpoint.
   * @example
   * const options = {
   *   provider: "digitalelement"
   * };
   *
   * const response = await ipIntel.isProxy(
   *   "1.1.1.1",
   *   options
   * );
   */
  isProxy(ip: string, options?: Intel.Options): Promise<PangeaResponse<Intel.IP.ProxyResult>> {
    const data: Intel.IPParams = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("proxy", data);
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
    this.apiVersion = "v1";
  }

  /**
   * @deprecated Since version 1.2.0. Use reputation instead.
   * @summary Reputation check
   * @description Retrieve a reputation score for a URL from a provider, including an optional detailed report.
   * @param {String} url - The URL to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "crowdstrike".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * const options = {
   *   provider: "reversinglabs"
   * };
   *
   * const response = await urlIntel.lookup(
   *   "http://113.235.101.11:54384,
   *   options
   * );
   */
  lookup(url: string, options?: Intel.Options): Promise<PangeaResponse<Intel.Response>> {
    const data: Intel.URLParams = {
      url,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("reputation", data);
  }

  /**
   * @summary Reputation check
   * @description Retrieve a reputation score for a URL from a provider, including an optional detailed report.
   * @param {String} url - The URL to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "crowdstrike".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * const options = {
   *   provider: "reversinglabs"
   * };
   *
   * const response = await urlIntel.reputation(
   *   "http://113.235.101.11:54384,
   *   options
   * );
   */
  reputation(
    url: string,
    options?: Intel.URL.ReputationOptions
  ): Promise<PangeaResponse<Intel.URL.ReputationResult>> {
    const data: Intel.URL.ReputationParams = {
      url,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("reputation", data);
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
    this.apiVersion = "v1";
  }

  /**
   * @summary Look up breached users
   * @description Find out if an email address, username, phone number, or IP address was exposed in a security breach.
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
    return this.post("user/breached", request);
  }

  /**
   * @summary Look up breached passwords
   * @description Find out if a password has been exposed in security breaches by providing a 5 character prefix of the password hash.
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

    return this.post("password/breached", data);
  }
}

// FileScan
// FIXME: docs
export class FileScanService extends BaseService {
  constructor(token: string, config: PangeaConfig) {
    super("file-scan", token, config);
    this.apiVersion = "v1";
  }

  // FIXME: docs
  fileScan(
    request: Intel.FileScan.ScanRequest,
    filepath: string,
    options: Intel.FileScan.Options = {
      pollResultSync: true,
    }
  ): Promise<PangeaResponse<Intel.FileScan.ScanResult>> {
    return this.postMultipart("scan", request, filepath, options);
  }
}
