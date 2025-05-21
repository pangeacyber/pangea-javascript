import { describe, expect, it } from "vitest";

import PangeaConfig from "../../src/config.js";
import PromptGuardService from "../../src/services/prompt_guard.js";

const client = new PromptGuardService(
  "my_api_token",
  new PangeaConfig({
    baseUrlTemplate: process.env.TEST_API_BASE_URL ?? "http://127.0.0.1:4010",
  })
);

describe("Prompt Guard", () => {
  it("getServiceConfig", async () => {
    const response = await client.getServiceConfig({ id: "id" });
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
  });

  it("createServiceConfig", async () => {
    const response = await client.createServiceConfig({ id: "id" });
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
  });

  it("updateServiceConfig", async () => {
    const response = await client.updateServiceConfig({
      id: "id",
      version: "version",
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
  });

  it("deleteServiceConfig", async () => {
    const response = await client.deleteServiceConfig("my_service_config");
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
  });

  it("listServiceConfigs", async () => {
    const response = await client.listServiceConfigs({
      filter: {
        id: "foo",
        id__contains: ["foo", "bar"],
      },
      last: "foo",
      order: "asc",
      order_by: "id",
      size: 10,
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
    expect(response.result.count).toBeTypeOf("number");
    expect(response.result.last).toBeTypeOf("string");
    expect(response.result.items).toBeDefined();
  });
});
