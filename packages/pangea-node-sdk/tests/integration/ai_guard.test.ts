import { expect, it } from "@jest/globals";

import PangeaConfig from "../../src/config.js";
import AIGuardService from "../../src/services/ai_guard.js";
import {
  TestEnvironment,
  getTestDomain,
  getTestToken,
} from "../../src/utils/utils.js";
import { loadTestEnvironment } from "./utils.js";

const environment = loadTestEnvironment("ai-guard", TestEnvironment.LIVE);

const token = getTestToken(environment);
const testHost = getTestDomain(environment);
const config = new PangeaConfig({
  domain: testHost,
  customUserAgent: "sdk-test",
});
const client = new AIGuardService(token, config);

describe("AI Guard", () => {
  it("should guard text", async () => {
    let response = await client.guardText({
      text: "hello world",
      recipe: "pangea_prompt_guard",
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result.prompt).toBeDefined();
    expect(response.result.detectors.prompt_injection.detected).toBe(false);
    expect(response.result.detectors.prompt_injection.data).toBeNull();
    expect(response.result.detectors.pii_entity?.detected).toBe(false);
    expect(response.result.detectors.pii_entity?.data).toBeNull();
    expect(response.result.detectors.malicious_entity?.detected).toBe(false);
    expect(response.result.detectors.malicious_entity?.data).toBeNull();

    response = await client.guardText({
      text: "security@pangea.cloud",
      recipe: "pangea_prompt_guard",
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result.prompt).toBeDefined();
    expect(response.result.detectors.pii_entity?.detected).toBe(true);
    expect(response.result.detectors.pii_entity?.data?.entities.length).toEqual(
      1
    );
  });
});
