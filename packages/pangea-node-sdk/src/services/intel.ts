import PangeaResponse from "@src/response.js";
import BaseService from "./base.js";
import PangeaConfig from "@src/config.js";
import { Intel, PangeaToken } from "@src/types.js";
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
 *    const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
 *    const token = process.env.PANGEA_TOKEN;
 *    const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
 *
 *    const fileIntel = new FileIntelService(token, config);
 *    const options = { provider: "reversinglabs", verbose: true };
 *
 *    const response = await fileIntel.lookup("142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e", "sha256", options);
 */
export class FileIntelService extends BaseService {
  /**
   * Creates a new `FileIntelService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ baseURLTemplate: "https://{SERVICE_NAME}.aws.us.pangea.cloud" });
   * const fileIntel = new FileIntelService("pangea_token", config);
   * ```
   *
   * @summary File Intel
   */
  constructor(token: PangeaToken, config: PangeaConfig) {
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
   * @summary Reputation V2
   * @description Retrieve reputations for a list of file hashes, from a provider, including an optional detailed report.
   * @operationId file_intel_post_v2_reputation
   * @param {String[]} hashes - Hashes of each file to be looked up
   * @param {String} hashType - Type of hash, can be "sha256", "sha" or "md5"
   * @param {Object} options - An object of optional parameters
   *   - provider - Provider of the reputation information. ("reversinglabs").
   *   Default provider defined by the configuration.
   *   - verbose - Echo back the parameters of the API in the response. Default: verbose=false.
   *   - raw - Return additional details from the provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * ```js
   * const hashes = [
   *   "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
   * ];
   *
   * const response = await fileIntel.hashReputationBulk(
   *   hashes,
   *   "sha256",
   *   { provider: "reversinglabs" }
   * );
   * ```
   */
  hashReputationBulk(
    hashes: string[],
    hashType: string,
    options?: Intel.File.ReputationOptions
  ): Promise<PangeaResponse<Intel.File.ReputationBulkResult>> {
    const data: Intel.File.ReputationRequest = {
      hashes: hashes,
      hash_type: hashType,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v2/reputation", data);
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

  /**
   * @summary Reputation, from file paths
   * @description Retrieve file reputations from a provider, using the files' hashes.
   * @param {String[]} filepaths - Paths to the files to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider: "reversinglabs".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * ```js
   * const response = await fileIntel.filepathReputationBulk(
   *   ["./myfile1.exe", "./myfile2.exe"],
   *   { provider: "reversinglabs" }
   * );
   * ```
   */
  filepathReputationBulk(
    filepaths: string[],
    options?: Intel.File.ReputationOptions
  ): Promise<PangeaResponse<Intel.File.ReputationBulkResult>> {
    let hashes: string[] = [];

    filepaths.forEach((filepath) => {
      const content = readFileSync(filepath);
      const fileHash = createHash(hashType).update(content).digest("hex");
      hashes.push(fileHash);
    });

    return this.hashReputationBulk(hashes, "sha256", options);
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
 *  const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
 *  const token = process.env.PANGEA_TOKEN;
 *  const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
 *
 *  const domainIntel = new DomainIntelService(token, config);
 *  const options = { provider: "domaintools", verbose: true };
 *
 *  const response = await domainIntel.lookup("teoghehofuuxo", options);
 */
export class DomainIntelService extends BaseService {
  /**
   * Creates a new `DomainIntelService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ baseURLTemplate: "https://{SERVICE_NAME}.aws.us.pangea.cloud" });
   * const domainIntel = new DomainIntelService("pangea_token", config);
   * ```
   *
   * @summary Domain Intel
   */
  constructor(token: PangeaToken, config: PangeaConfig) {
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
      domain: domain,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/reputation", data);
  }

  /**
   * @summary Bulk reputation check
   * @description Retrieve reputations for a list of domains, from a provider, including an optional detailed report.
   * @operationId domain_intel_post_v2_reputation
   * @param {String[]} domains - The domain list to be looked up.
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from these providers: "crowdstrike" or "domaintools".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * ```js
   * const response = await domainIntel.reputationBulk(
   *   ["google.com"]
   * );
   * ```
   */
  reputationBulk(
    domains: string[],
    options?: Intel.Domain.ReputationOptions
  ): Promise<PangeaResponse<Intel.Domain.ReputationBulkResult>> {
    const data: Intel.Domain.ReputationRequest = {
      domains: domains,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v2/reputation", data);
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
 *    const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
 *    const token = process.env.PANGEA_IP_INTEL_TOKEN;
 *    const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
 *
 *    const ipIntel = new IPIntelService(token, config);
 *    const options = { provider: "crowdstrike", verbose: true };
 *
 *    const response = await ipIntel.lookup("93.231.182.110", options);
 */
export class IPIntelService extends BaseService {
  /**
   * Creates a new `IPIntelService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ baseURLTemplate: "https://{SERVICE_NAME}.aws.us.pangea.cloud" });
   * const ipIntel = new IPIntelService("pangea_token", config);
   * ```
   *
   * @summary IP Intel
   */
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("ip-intel", token, config);
  }

  /**
   * @summary Reputation
   * @description Retrieve a reputation score for an IP address from a provider, including an optional detailed report.
   * @operationId ip_intel_post_v1_reputation
   * @param {String} ip - The IP to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider.
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the /reputation endpoint.
   * @example
   * ```js
   * const response = await ipIntel.reputation(
   *   "190.28.74.251",
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
   * @summary Reputation V2
   * @description Retrieve reputation scores for IP addresses from a provider, including an optional detailed report.
   * @operationId ip_intel_post_v2_reputation
   * @param {String[]} ips - A list of IPs to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider.
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the /reputation endpoint.
   * @example
   * ```js
   * const response = await ipIntel.reputationBulk(
   *   ["190.28.74.251"],
   *   {
   *     provider: "crowdstrike"
   *   }
   * );
   * ```
   */
  reputationBulk(
    ips: string[],
    options?: Intel.IP.ReputationOptions
  ): Promise<PangeaResponse<Intel.IP.ReputationBulkResult>> {
    const data: Intel.IP.ReputationParams = {
      ips,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v2/reputation", data);
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
   * @summary Geolocate V2
   * @description Retrieve geolocation information for a list of IP addresses, from a provider, including an optional detailed report.
   * @operationId ip_intel_post_v2_geolocate
   * @param {String} ips - The list of IP addresses to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use geolocation data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the geolocate endpoint.
   * @example
   * ```js
   * const response = await ipIntel.geolocateBulk(
   *   ["1.1.1.1"],
   *   {
   *     provider: "digitalelement"
   *   }
   * );
   * ```
   */
  geolocateBulk(
    ips: string[],
    options?: Intel.IP.GeolocateOptions
  ): Promise<PangeaResponse<Intel.IP.GeolocateBulkResult>> {
    const data: Intel.IP.GeolocateRequest = {
      ips,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v2/geolocate", data);
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
   * @summary Domain V2
   * @description Retrieve the domain names associated with a list of IP addresses.
   * @operationId ip_intel_post_v2_domain
   * @param {String} ips - The list of IP addresses to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the domain endpoint.
   * @example
   * ```js
   * const response = await ipIntel.getDomainBulk(
   *   ["1.1.1.1"],
   *   {
   *     provider: "digitalelement"
   *   }
   * );
   * ```
   */
  getDomainBulk(
    ips: string[],
    options?: Intel.IP.DomainOptions
  ): Promise<PangeaResponse<Intel.IP.DomainBulkResult>> {
    const data: Intel.IP.DomainRequest = {
      ips,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v2/domain", data);
  }

  /**
   * @summary VPN
   * @description Determine if an IP address originates from a VPN.
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
  isVPN(
    ip: string,
    options?: Intel.IP.VPNOptions
  ): Promise<PangeaResponse<Intel.IP.VPNResult>> {
    const data: Intel.IP.VPNRequest = {
      ip,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/vpn", data);
  }

  /**
   * @summary VPN V2
   * @description Determine which IP addresses originate from a VPN.
   * @operationId ip_intel_post_v2_vpn
   * @param {String} ip - The IP to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the vpn endpoint.
   * @example
   * ```js
   * const response = await ipIntel.isVPNBulk(
   *   ["1.1.1.1"],
   *   {
   *     provider: "digitalelement"
   *   }
   * );
   * ```
   */
  isVPNBulk(
    ips: string[],
    options?: Intel.IP.VPNOptions
  ): Promise<PangeaResponse<Intel.IP.VPNBulkResult>> {
    const data: Intel.IP.VPNRequest = {
      ips,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v2/vpn", data);
  }

  /**
   * @summary Proxy
   * @description Determine if an IP address originates from a proxy.
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

  /**
   * @summary Proxy V2
   * @description Determine if an IP address originates from a proxy.
   * @operationId ip_intel_post_v2_proxy
   * @param {String} ips - The list of IP addresses to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use data from this provider: "digitalelement".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the vpn endpoint.
   * @example
   * ```js
   * const response = await ipIntel.isProxyBulk(
   *   ["1.1.1.1"],
   *   {
   *     provider: "digitalelement"
   *   }
   * );
   * ```
   */
  isProxyBulk(
    ips: string[],
    options?: Intel.IP.ProxyOptions
  ): Promise<PangeaResponse<Intel.IP.ProxyBulkResult>> {
    const data: Intel.IP.ProxyRequest = {
      ips,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v2/proxy", data);
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
 *    const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
 *    const token = process.env.PANGEA_TOKEN;
 *    const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
 *
 *    const urlIntel = new URLIntelService(token, config);
 *    const options = { provider: "crowdstrike", verbose: true };
 *
 *    const response = await urlIntel.lookup("http://113.235.101.11:54384", options);
 */
export class URLIntelService extends BaseService {
  /**
   * Creates a new `URLIntelService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ baseURLTemplate: "https://{SERVICE_NAME}.aws.us.pangea.cloud" });
   * const urlIntel = new URLIntelService("pangea_token", config);
   * ```
   *
   * @summary URL Intel
   */
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("url-intel", token, config);
  }

  /**
   * @summary Reputation check
   * @description Retrieve a reputation score for a URL from a provider, including an optional detailed report.
   * @operationId url_intel_post_v2_reputation
   * @param {String} url - The URL to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider.
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * ```js
   * const response = await urlIntel.reputation(
   *   "http://113.235.101.11:54384",
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
      url: url,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v1/reputation", data);
  }

  /**
   * @summary Reputation check V2
   * @description Retrieve reputation scores for URLs, from a provider, including an optional detailed report.
   * @operationId url_intel_post_v2_reputation
   * @param {String[]} urls - A list of URLs to be looked up
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use reputation data from this provider.
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the lookup endpoint.
   * @example
   * ```js
   * const response = await urlIntel.reputationBulk(
   *   ["http://113.235.101.11:54384"],
   *   {
   *     provider: "crowdstrike"
   *   }
   * );
   * ```
   */
  reputationBulk(
    urls: string[],
    options?: Intel.URL.ReputationOptions
  ): Promise<PangeaResponse<Intel.URL.ReputationBulkResult>> {
    const data: Intel.URL.ReputationRequest = {
      urls: urls,
    };

    if (options?.provider) data.provider = options.provider;
    if (options?.verbose) data.verbose = options.verbose;
    if (options?.raw) data.raw = options.raw;

    return this.post("v2/reputation", data);
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
 *    const urlTemplate = process.env.PANGEA_URL_TEMPLATE;
 *    const token = process.env.PANGEA_TOKEN;
 *    const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
 *
 *    const userIntel = new UserIntelService(token, config);
 *    const options = { provider: "spycloud", verbose: true };
 *    const response = await userIntel.passwordBreached(Intel.HashType.SHA256, "5baa6", options);
 */
export class UserIntelService extends BaseService {
  /**
   * Creates a new `UserIntelService` with the given Pangea API token and
   * configuration.
   *
   * @param token Pangea API token.
   * @param config Configuration.
   *
   * @example
   * ```js
   * const config = new PangeaConfig({ baseURLTemplate: "https://{SERVICE_NAME}.aws.us.pangea.cloud" });
   * const userIntel = new UserIntelService("pangea_token", config);
   * ```
   *
   * @summary User Intel
   */
  constructor(token: PangeaToken, config: PangeaConfig) {
    super("user-intel", token, config);
  }

  /**
   * @summary Look up breached users
   * @description Determine if an email address, username, phone number, or IP address was exposed in a security breach.
   * @operationId user_intel_post_v1_user_breached
   * @param request Request to send to user/breached endpoint
   * @returns A promise representing an async call to the user/breached endpoint.
   * @example
   * ```js
   * const response = await userIntel.userBreached({
   *   phone_number: "8005550123",
   *   verbose: true,
   *   raw: true,
   * });
   * ```
   */
  userBreached(
    request: Intel.User.User.BreachedRequest
  ): Promise<PangeaResponse<Intel.User.User.BreachedResult>> {
    return this.post("v1/user/breached", request);
  }

  /**
   * @summary Look up breached users V2
   * @description Determine if an email address, username, phone number, or IP address was exposed in a security breach.
   * @operationId user_intel_post_v2_user_breached
   * @param request Request to send to user/breached endpoint
   * @returns A promise representing an async call to the user/breached endpoint.
   * @example
   * ```js
   * const response = await userIntel.userBreachedBulk({
   *   phone_numbers: ["8005550123"],
   *   verbose: true,
   *   raw: true,
   * });
   * ```
   */
  userBreachedBulk(
    request: Intel.User.User.BreachedBulkRequest
  ): Promise<PangeaResponse<Intel.User.User.BreachedBulkResult>> {
    return this.post("v2/user/breached", request);
  }

  /**
   * @summary Look up breached passwords
   * @description Determine if a password has been exposed in a security breach using a 5 character prefix of the password hash.
   * @operationId user_intel_post_v1_password_breached
   * @param {Intel.HashType} hashType - Hash type to be looked up
   * @param {String} hashPrefix - The prefix of the hash to be looked up.
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use breached data from this provider: "spycloud".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the password/breached endpoint.
   * @example
   * ```js
   * const response = await userIntel.passwordBreached(
   *   Intel.HashType.SHA256,
   *   "5baa6",
   *   {
   *     provider: "spycloud",
   *     verbose: true,
   *     raw: true
   *   }
   * );
   * ```
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

  /**
   * @summary Look up breached passwords V2
   * @description Find out if a password has been exposed in security breaches by providing a 5 character prefix of the password hash.
   * @operationId user_intel_post_v2_password_breached
   * @param {Intel.HashType} hashType - Hash type to be looked up
   * @param {String[]} hashPrefixes - The list of prefixes of the hash to be looked up.
   * @param {Object} options - An object of optional parameters. Parameters supported:
   *   - provider {String} - Use breached data from this provider: "spycloud".
   *   Default provider defined by the configuration.
   *   - verbose {Boolean} - Echo the API parameters in the response. Default: verbose=false.
   *   - raw {Boolean} - Include raw data from this provider. Default: raw=false.
   * @returns {Promise} - A promise representing an async call to the password/breached endpoint.
   * @example
   * ```js
   * const response = await userIntel.passwordBreachedBulk(
   *   Intel.HashType.SHA256,
   *   ["5baa6"],
   *   {
   *     provider: "spycloud",
   *     verbose: true,
   *     raw: true
   *   }
   * );
   * ```
   */
  passwordBreachedBulk(
    hashType: Intel.HashType,
    hashPrefixes: string[],
    options: Intel.User.Password.BreachedOptions
  ): Promise<PangeaResponse<Intel.User.User.BreachedBulkResult>> {
    const data: Intel.User.Password.BreachedBulkRequest = {
      hash_type: hashType,
      hash_prefixes: hashPrefixes,
    };
    Object.assign(data, options);

    return this.post("v2/password/breached", data);
  }

  /**
   * @summary Look up information about a specific breach
   * @description Given a provider specific breach ID, find details about the breach.
   * @operationId user_intel_post_v1_breach
   * @param request Request to send to v1/breach endpoint
   * @returns {Promise} - A promise representing an async call to the breach endpoint.
   * @example
   * ```js
   * const response = await userIntel.breach({
   *  breach_id: "66111",
   * });
   * ```
   */
  breach(
    request: Intel.User.BreachRequest
  ): Promise<PangeaResponse<Intel.User.BreachResult>> {
    return this.post("v1/breach", request);
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
