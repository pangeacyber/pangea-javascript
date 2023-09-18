import PangeaConfig from "../../src/config.js";
import { it, expect } from "@jest/globals";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils.js";
import { URLIntelService } from "../../src/index.js";

const testEnvironment = TestEnvironment.LIVE;

const token = getTestToken(testEnvironment);
const testHost = getTestDomain(testEnvironment);
const config = new PangeaConfig({ domain: testHost, customUserAgent: "sdk-test" });
const urlIntel = new URLIntelService(token, config);

it("URL reputation should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await urlIntel.reputation("http://113.235.101.11:54384", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
  expect(response.result.data_details).toBeUndefined();
});

it("URL reputation bulk should succeed", async () => {
  const url_list = [
    "http://113.235.101.11:54384",
    "http://45.14.49.109:54819",
    "https://chcial.ru/uplcv?utm_term%3Dcost%2Bto%2Brezone%2Bland",
  ];
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await urlIntel.reputation(url_list, options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
  expect(response.result.data_details).toBeDefined();
  expect(Object.keys(response.result.data_details ?? {}).length).toBe(3);
});

it("URL reputation with default provider should succeed", async () => {
  const response = await urlIntel.reputation("http://113.235.101.11:54384");
  expect(response.status).toBe("Success");
});

it("URL reputation not found", async () => {
  const response = await urlIntel.reputation("http://thisshouldbeafakeurlasdasd12:54384");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBeDefined();
  expect(response.result.data.category).toBeDefined();
  expect(response.result.data.score).toBeDefined();
});
