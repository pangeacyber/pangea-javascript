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
   * @summary Look up a file
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

    return this.post("lookup", data);
  }

  /**
   * @summary Look up a file, from file path
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

    return this.post("lookup", data);
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
   * @summary Look up a domain
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

    return this.post("lookup", data);
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
   * @summary Look up an IP
   * @description Retrieve a reputation score for an IP address from a provider, including an optional detailed report.
   * @deprecated Since version 1.2.0. Use reputation instead.
   * @param {String} ip - Geolocate this IP and check the corresponding country against
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
   * @summary Look up an IP reputation
   * @description Retrieve a reputation score for an IP address from a provider, including an optional detailed report.
   * @param {String} ip - Geolocate this IP and check the corresponding country against
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
   * const response = await ipIntel.reputation(
   *   "1.1.1.1",
   *   options
   * );
   */
  reputation(ip: string, options?: Intel.Options): Promise<PangeaResponse<Intel.Response>> {
    const data: Intel.IPParams = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("reputation", data);
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
   * @summary Look up a URL
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

    return this.post("lookup", data);
  }
}
