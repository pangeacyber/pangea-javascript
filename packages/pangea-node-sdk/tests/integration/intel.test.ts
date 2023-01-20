import PangeaConfig from "../../src/config";
import { it, expect } from "@jest/globals";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils";
import { FileIntelService, DomainIntelService, IPIntelService, URLIntelService } from "../../src";

const token = getTestToken(TestEnvironment.LIVE);
const testHost = getTestDomain(TestEnvironment.LIVE);
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

it("file lookup with filepath should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const response = await fileIntel.lookupFilepath("./README.md", options);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("benign");
});

it("file lookup with filepath should faild", async () => {
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

it("IP lookup should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await ipIntel.lookup("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("IP reputation should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await ipIntel.reputation("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("URL lookup should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await urlIntel.lookup("http://113.235.101.11:54384", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});
