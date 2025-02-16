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
    let response = await client.guardText({ text: "what was pangea?" });
    expect(response.status).toStrictEqual("Success");
    expect(response.result.prompt_text).toBeDefined();

    if (response.result.detectors.prompt_injection) {
      expect(response.result.detectors.prompt_injection.detected).toBe(false);
      expect(response.result.detectors.prompt_injection.data).toBeNull();
    }

    if (response.result.detectors.pii_entity) {
      expect(response.result.detectors.pii_entity.detected).toBe(false);
      expect(response.result.detectors.pii_entity.data).toBeNull();
    }

    if (response.result.detectors.malicious_entity) {
      expect(response.result.detectors.malicious_entity.detected).toBe(false);
      expect(response.result.detectors.malicious_entity.data).toBeNull();
    }
  });

  it("should support messages", async () => {
    const response = await client.guardText({
      messages: [{ role: "user", content: "what was pangea?" }],
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result.prompt_messages).toBeDefined();
  });

  it("should support LLM input", async () => {
    const response = await client.guardText({
      llm_input: {
        model: "gpt-4o",
        messages: [{ role: "user", content: "what was pangea?" }],
      },
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result.prompt_messages).toBeDefined();
  });
});
