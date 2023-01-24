import PangeaConfig from "../../src/config";
import { it, expect } from "@jest/globals";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils";
import { FileIntelService, DomainIntelService, IPIntelService, URLIntelService } from "../../src";

// FIXME: Update testEnvironment to live once released!
const testEnvironment = TestEnvironment.DEVELOP;

const token = getTestToken(testEnvironment);
const testHost = getTestDomain(testEnvironment);
const config = new PangeaConfig({ domain: testHost });
const fileIntel = new FileIntelService(token, config);
const domainIntel = new DomainIntelService(token, config);
const ipIntel = new IPIntelService(token, config);
const urlIntel = new URLIntelService(token, config);

it("file lookup should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const response = await fileIntel.lookup(
    "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
    "sha256",
    options
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("file lookup with default provider should succeed", async () => {
  const response = await fileIntel.lookup(
    "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
    "sha256"
  );
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("file lookup with filepath should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const response = await fileIntel.lookupFilepath("./README.md", options);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("benign");
});

it("file lookup with filepath should fail", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };

  try {
    const response = await fileIntel.lookupFilepath("./not/a/real/path/file.txt", options);
  } catch (e: unknown) {
    // @ts-ignore
    expect(e.code).toBe("ENOENT");
  }
});

it("Domain lookup should succeed", async () => {
  const options = { provider: "domaintools", verbose: true, raw: true };
  const response = await domainIntel.lookup("737updatesboeing.com", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("Domain lookup with default should succeed", async () => {
  const response = await domainIntel.lookup("737updatesboeing.com");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("IP lookup should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await ipIntel.lookup("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("IP lookup with default provider should succeed", async () => {
  const response = await ipIntel.lookup("93.231.182.110");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("IP geolocate should succeed", async () => {
  const options = { provider: "digitalenvoy", verbose: true, raw: true };
  const response = await ipIntel.geolocate("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.country).toBe("deu");
  expect(response.result.data.city).toBe("unna");
  expect(response.result.data.postal_code).toBe("59425");
});

it("IP geolocate with default provider should succeed", async () => {
  const response = await ipIntel.geolocate("93.231.182.110");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("IP get domain should succeed", async () => {
  const options = { provider: "digitalenvoy", verbose: true, raw: true };
  const response = await ipIntel.getDomain("24.235.114.61", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.domain_found).toBeTruthy();
  expect(response.result.data.domain).toBe("rogers.com");
});

it("IP get domain with default provider should succeed", async () => {
  const response = await ipIntel.getDomain("24.235.114.61");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.domain_found).toBeTruthy();
  expect(response.result.data.domain).toBe("rogers.com");
});

it("IP is VPN should succeed", async () => {
  const options = { provider: "digitalenvoy", verbose: true, raw: true };
  const response = await ipIntel.isVPN("1.46.128.165", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_vpn).toBeTruthy();
});

it("IP is VPN with default provider should succeed", async () => {
  const response = await ipIntel.isVPN("1.46.128.165");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_vpn).toBeTruthy();
});

it("IP is proxy should succeed", async () => {
  const options = { provider: "digitalenvoy", verbose: true, raw: true };
  const response = await ipIntel.isProxy("93.231.182.110", options);

  expect(response.status).toBe("34.201.32.172");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_proxy).toBeTruthy();
});

it("IP is proxy with default provider should succeed", async () => {
  const response = await ipIntel.isProxy("34.201.32.172");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_proxy).toBeTruthy();
});

it("URL lookup should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await urlIntel.lookup("http://113.235.101.11:54384", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("URL lookup with default provider should succeed", async () => {
  const response = await urlIntel.lookup("http://113.235.101.11:54384");
  expect(response.status).toBe("Success");
});
