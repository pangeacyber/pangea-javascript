import PangeaConfig from "../../src/config.js";
import { it, expect } from "@jest/globals";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils.js";
import { IPIntelService } from "../../src/index.js";

const testEnvironment = TestEnvironment.DEVELOP;

const token = getTestToken(testEnvironment);
const testHost = getTestDomain(testEnvironment);
const config = new PangeaConfig({ domain: testHost, customUserAgent: "sdk-test" });
const ipIntel = new IPIntelService(token, config);

it("IP geolocate should succeed", async () => {
  const options = { provider: "digitalelement", verbose: true, raw: true };
  const response = await ipIntel.geolocate("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.country).toBe("Federal Republic Of Germany");
  expect(response.result.data.city).toBe("unna");
  expect(response.result.data.postal_code).toBe("59425");
});

it("IP geolocate with default provider should succeed", async () => {
  const response = await ipIntel.geolocate("93.231.182.110");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("IP geolocate bulk provider should succeed", async () => {
  const response = await ipIntel.geolocateBulk(["93.231.182.110", "24.235.114.61"]);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("IP get domain should succeed", async () => {
  const options = { provider: "digitalelement", verbose: true, raw: true };
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

it("IP get domain bulk provider should succeed", async () => {
  const response = await ipIntel.getDomainBulk(["93.231.182.110", "24.235.114.61"]);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("IP get domain not found", async () => {
  const response = await ipIntel.getDomain("127.0.0.1");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.domain_found).toBeFalsy();
  expect(response.result.data.domain).toBeUndefined();
});

it("IP is VPN should succeed", async () => {
  const options = { provider: "digitalelement", verbose: true, raw: true };
  const response = await ipIntel.isVPN("2.56.189.74", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_vpn).toBeTruthy();
});

it("IP is VPN with default provider should succeed", async () => {
  const response = await ipIntel.isVPN("2.56.189.74");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_vpn).toBeTruthy();
});

it("IP is VPN bulk should succeed", async () => {
  const response = await ipIntel.isVPNBulk(["2.56.189.74", "24.235.114.61"]);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("IP is VPN not found", async () => {
  const response = await ipIntel.isVPN("127.0.0.1");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_vpn).toBeFalsy();
});

it("IP is proxy should succeed", async () => {
  const options = { provider: "digitalelement", verbose: true, raw: true };
  const response = await ipIntel.isProxy("132.76.150.141", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_proxy).toBeTruthy();
});

it("IP is proxy with default provider should succeed", async () => {
  const response = await ipIntel.isProxy("132.76.150.141");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_proxy).toBeTruthy();
});

it("IP is proxy bulk should succeed", async () => {
  const response = await ipIntel.isProxyBulk(["132.76.150.141", "24.235.114.61"]);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("IP is proxy not found", async () => {
  const response = await ipIntel.isProxy("127.0.0.1");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_proxy).toBeFalsy();
});

it("IP reputation should succeed. Crowdstrike provider", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await ipIntel.reputation("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("IP reputation should succeed. Cymru provider", async () => {
  const options = { provider: "cymru", verbose: true, raw: true };
  const response = await ipIntel.reputation("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("IP reputation bulk should succeed. Crowdstrike provider", async () => {
  const ips = ["93.231.182.110", "190.28.74.251"];
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await ipIntel.reputationBulk(ips, options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("IP reputation not found", async () => {
  const options = { provider: "cymru", verbose: true, raw: true };
  const response = await ipIntel.reputation("127.0.0.1", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.category).toBeDefined();
  expect(response.result.data.verdict).toBeDefined();
  expect(response.result.data.score).toBeDefined();
});
