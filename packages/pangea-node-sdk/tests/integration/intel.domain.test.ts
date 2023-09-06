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
  expect(response.result.data_list).toBeUndefined();
});

it("Domain bulk reputation should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const domain = ["pemewizubidob.cafij.co.za", "redbomb.com.tr", "kmbk8.hicp.net"];
  const response = await domainIntel.reputation(domain, options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
  expect(response.result.data_list).toBeDefined();
  expect(response.result.data_list?.length).toBe(3);
});
