import { describe, expect, it } from "vitest";

import { AIGuardService, PangeaConfig } from "../../src/index.js";
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
    const response = await client.guardText({ text: "what was pangea?" });
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

  it("should support sending only relevant content", async () => {
    const response = await client.guardText(
      {
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. Here are the tools: Tool1(calc), Tool2(site), Tool3(reverse)",
          },
          {
            role: "user",
            content:
              "What is the sum of response times of example.com and example.org?",
          },
          {
            role: "context",
            content: "example.com and example.org are websites.",
          },
          { role: "assistant", content: "Call Tool2(example.org)." },
          { role: "tool", content: "example.org 2ms" },
          { role: "context", content: "some context about example.org" },
        ],
      },
      { onlyRelevantContent: true }
    );
    expect(response.status).toStrictEqual("Success");
    expect(response.result.prompt_messages).toBeDefined();
    const prompt_messages = response.result
      .prompt_messages as unknown as unknown[];
    expect(Array.isArray(prompt_messages)).toBeTruthy();
    expect(prompt_messages.length).toBe(6);
  });
});
