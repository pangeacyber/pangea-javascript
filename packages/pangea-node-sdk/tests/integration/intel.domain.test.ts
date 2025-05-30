import { it, expect, vi } from "vitest";

import PangeaConfig from "../../src/config.js";
import {
  TestEnvironment,
  getTestDomain,
  getTestToken,
} from "../../src/utils/utils.js";
import { DomainIntelService } from "../../src/index.js";
import { loadTestEnvironment } from "./utils.js";

const environment = loadTestEnvironment("domain-intel", TestEnvironment.LIVE);

const token = getTestToken(environment);
const testHost = getTestDomain(environment);
const config = new PangeaConfig({
  domain: testHost,
  customUserAgent: "sdk-test",
});
const domainIntel = new DomainIntelService(token, config);
vi.setConfig({ testTimeout: 60_000 });

it("Domain reputation should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await domainIntel.reputation(
    "737updatesboeing.com",
    options
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("Domain bulk reputation should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const domains = [
    "pemewizubidob.cafij.co.za",
    "redbomb.com.tr",
    "kmbk8.hicp.net",
  ];
  const response = await domainIntel.reputationBulk(domains, options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data ?? {}).length).toBe(3);
});

it("Domain reputation should succeed. Default provider.", async () => {
  const options = { verbose: true, raw: true };
  const response = await domainIntel.reputation(
    "737updatesboeing.com",
    options
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("Domain reputation not found", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await domainIntel.reputation(
    "thisshouldbeafakedomain123123sad.com",
    options
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBeDefined();
  expect(response.result.data.category).toBeDefined();
  expect(response.result.data.score).toBeDefined();
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
