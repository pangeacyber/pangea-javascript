import { it, expect, vi } from "vitest";

import PangeaConfig from "../../src/config.js";
import {
  TestEnvironment,
  getTestDomain,
  getTestToken,
} from "../../src/utils/utils.js";
import { FileIntelService } from "../../src/index.js";
import { loadTestEnvironment } from "./utils.js";

const environment = loadTestEnvironment("file-intel", TestEnvironment.LIVE);
const token = getTestToken(environment);
const testHost = getTestDomain(environment);
const config = new PangeaConfig({
  domain: testHost,
  customUserAgent: "sdk-test",
});
const fileIntel = new FileIntelService(token, config);
vi.setConfig({ testTimeout: 60_000 });

it("file hash reputation should succeed", async () => {
  const response = await fileIntel.hashReputation(
    "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
    "sha256",
    {
      provider: "reversinglabs",
      verbose: true,
      raw: true,
    }
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("file hash reputation bulk should succeed", async () => {
  const response = await fileIntel.hashReputationBulk(
    [
      "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
      "179e2b8a4162372cd9344b81793cbf74a9513a002eda3324e6331243f3137a63",
    ],
    "sha256",
    {
      provider: "reversinglabs",
      verbose: true,
      raw: true,
    }
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("file filepathReputation with filepath should succeed", async () => {
  const response = await fileIntel.filepathReputation("./README.md", {
    provider: "reversinglabs",
    verbose: true,
    raw: true,
  });
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("file filepathReputationBulk with filepath should succeed", async () => {
  const response = await fileIntel.filepathReputationBulk(
    ["./README.md", "./CHANGELOG.md"],
    {
      provider: "reversinglabs",
      verbose: true,
      raw: true,
    }
  );
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("file reputation with filepath should fail", async () => {
  try {
    const response = await fileIntel.filepathReputation(
      "./not/a/real/path/file.txt",
      {
        provider: "reversinglabs",
        verbose: true,
        raw: true,
      }
    );
    expect(response).toBeFalsy();
  } catch (e: unknown) {
    // @ts-expect-error
    expect(e.code).toBe("ENOENT");
  }
});
