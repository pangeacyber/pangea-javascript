import PangeaConfig from "../../src/config.js";
import { it, expect } from "@jest/globals";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils.js";
import { FileIntelService } from "../../src/index.js";

const testEnvironment = TestEnvironment.DEVELOP;

const token = getTestToken(testEnvironment);
const testHost = getTestDomain(testEnvironment);
const config = new PangeaConfig({ domain: testHost, customUserAgent: "sdk-test" });
const fileIntel = new FileIntelService(token, config);

it("file hash reputation should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const response = await fileIntel.hashReputation(
    "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
    "sha256",
    options
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("file hash reputation bulk should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const hashes = [
    "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
    "179e2b8a4162372cd9344b81793cbf74a9513a002eda3324e6331243f3137a63",
  ];

  const response = await fileIntel.hashReputationBulk(hashes, "sha256", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("file filepathReputation with filepath should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const response = await fileIntel.filepathReputation("./README.md", options);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("file reputation with filepath should faild", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };

  try {
    const response = await fileIntel.filepathReputation("./not/a/real/path/file.txt", options);
    expect(response).toBeFalsy();
  } catch (e: unknown) {
    // @ts-ignore
    expect(e.code).toBe("ENOENT");
  }
});
