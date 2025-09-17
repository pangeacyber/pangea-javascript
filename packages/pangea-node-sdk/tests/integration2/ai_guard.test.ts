import { describe, expect, it } from "vitest";

import { AIGuardService, PangeaConfig } from "../../src/index.js";

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

  it("guard", async () => {
    const response = await client.guard({
      input: {
        messages: [{ role: "user", content: "what was pangea?" }],
        tools: [],
      },
      recipe: "my_recipe",
      debug: true,
      extra_info: {
        app_name: "foobar",
        other_stuff: "baz",
      },
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
  });
});
