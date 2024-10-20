import { expect, it } from "@jest/globals";
import PangeaConfig from "../../src/config.js";
import DataGuardService from "../../src/services/data_guard.js";
import {
  getTestDomain,
  getTestToken,
  TestEnvironment,
} from "../../src/utils/utils.js";
import { loadTestEnvironment } from "./utils.js";

const environment = loadTestEnvironment("data-guard", TestEnvironment.LIVE);

const token = getTestToken(environment);
const testHost = getTestDomain(environment);
const config = new PangeaConfig({
  domain: testHost,
  customUserAgent: "sdk-test",
});
const client = new DataGuardService(token, config);

describe("Data Guard", () => {
  it("should guard text", async () => {
    let response = await client.guardText({ text: "hello world" });
    expect(response.status).toStrictEqual("Success");
    expect(response.result.redacted_prompt).toBeDefined();
    expect(response.result.findings.artifact_count).toStrictEqual(0);
    expect(response.result.findings.malicious_count).toStrictEqual(0);

    response = await client.guardText({ text: "security@pangea.cloud" });
    expect(response.status).toStrictEqual("Success");
    expect(response.result.redacted_prompt).toBeDefined();
    expect(response.result.findings.artifact_count).toStrictEqual(1);
    expect(response.result.findings.malicious_count).toStrictEqual(0);
  });

  it("should guard file URL", async () => {
    let response = await client.guardFile({
      file_url: "https://pangea.cloud/robots.txt",
    });
    expect(response.status).toStrictEqual("Success");
  });
});
