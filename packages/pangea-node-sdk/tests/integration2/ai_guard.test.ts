import { describe, expect, it } from "vitest";

import PangeaConfig from "../../src/config.js";
import AIGuardService from "../../src/services/ai_guard.js";

const client = new AIGuardService(
  "my_api_token",
  new PangeaConfig({
    baseUrlTemplate: process.env.TEST_API_BASE_URL ?? "http://127.0.0.1:4010",
  })
);

describe("AI Guard", () => {
  it("guardText: text", async () => {
    const response = await client.guardText({
      text: "what was pangea?",
      recipe: "my_recipe",
      debug: true,
      log_fields: {
        source: "foobar",
      },
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
  });

  it("guardText: messages", async () => {
    const response = await client.guardText({
      messages: [{ role: "user", content: "what was pangea?" }],
      recipe: "my_recipe",
      debug: true,
      log_fields: {
        source: "foobar",
      },
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
  });
});
