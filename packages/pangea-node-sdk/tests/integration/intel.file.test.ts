import PangeaConfig from "../../src/config.js";
import { it, expect, jest } from "@jest/globals";
import {
  TestEnvironment,
  getTestURLTemplate,
  getTestToken,
} from "../../src/utils/utils.js";
import { FileIntelService } from "../../src/index.js";
import { loadTestEnvironment } from "./utils.js";

const environment = loadTestEnvironment("file-intel", TestEnvironment.LIVE);
const token = getTestToken(environment);
const urlTemplate = getTestURLTemplate(environment);
const config = new PangeaConfig({
  baseURLTemplate: urlTemplate,
  customUserAgent: "sdk-test",
});
const fileIntel = new FileIntelService(token, config);
jest.setTimeout(60000);

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

  const response = await fileIntel.hashReputationBulk(
    hashes,
    "sha256",
    options
  );

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

it("file filepathReputationBulk with filepath should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const response = await fileIntel.filepathReputationBulk(
    ["./README.md", "./CHANGELOG.md"],
    options
  );
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("file reputation with filepath should fail", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };

  try {
    const response = await fileIntel.filepathReputation(
      "./not/a/real/path/file.txt",
      options
    );
    expect(response).toBeFalsy();
  } catch (e: unknown) {
    // @ts-ignore
    expect(e.code).toBe("ENOENT");
  }
});
