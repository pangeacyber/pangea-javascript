import PangeaConfig from "../../src/config.js";
import { it, expect } from "@jest/globals";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils.js";
import { DomainIntelService } from "../../src/index.js";

const testEnvironment = TestEnvironment.DEVELOP;

const token = getTestToken(testEnvironment);
const testHost = getTestDomain(testEnvironment);
const config = new PangeaConfig({ domain: testHost, customUserAgent: "sdk-test" });
const domainIntel = new DomainIntelService(token, config);

it("Domain reputation should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await domainIntel.reputation("737updatesboeing.com", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("Domain reputation should succeed. Default provider.", async () => {
  const options = { verbose: true, raw: true };
  const response = await domainIntel.reputation("737updatesboeing.com", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("Domain whoIs should succeed", async () => {
  const options = { provider: "whoisxml", verbose: true, raw: true };
  const response = await domainIntel.whoIs("737updatesboeing.com", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.domain_name).toBeDefined();
  expect(response.result.data.domain_availability).toBeDefined();
});

it("Domain whoIs should succeed. Default provider.", async () => {
  const options = { verbose: true, raw: true };
  const response = await domainIntel.whoIs("737updatesboeing.com", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.domain_name).toBeDefined();
  expect(response.result.data.domain_availability).toBeDefined();
});
