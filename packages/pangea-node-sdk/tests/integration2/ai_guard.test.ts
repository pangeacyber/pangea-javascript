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

  it("getServiceConfig", async () => {
    const response = await client.getServiceConfig("my_service_config");
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
    expect(response.result.audit_data_activity).toBeTypeOf("object");
    expect(response.result.connections).toBeTypeOf("object");
    expect(response.result.id).toBeTypeOf("string");
    expect(response.result.name).toBeTypeOf("string");
    expect(response.result.recipes).toBeTypeOf("object");
  });

  it("createServiceConfig", async () => {
    const response = await client.createServiceConfig({
      name: "my_service_config",
      audit_data_activity: {
        enabled: true,
        audit_service_config_id: "my_audit_service_config",
        areas: {
          text_guard: true,
        },
      },
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
    expect(response.result.audit_data_activity).toBeTypeOf("object");
    expect(response.result.connections).toBeTypeOf("object");
    expect(response.result.id).toBeTypeOf("string");
    expect(response.result.name).toBeTypeOf("string");
    expect(response.result.recipes).toBeTypeOf("object");
  });

  it("updateServiceConfig", async () => {
    const response = await client.updateServiceConfig({
      id: "my_service_config",
      name: "my_service_config",
      audit_data_activity: {
        enabled: true,
        audit_service_config_id: "my_audit_service_config",
        areas: {
          text_guard: true,
        },
      },
    });
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
    expect(response.result.audit_data_activity).toBeTypeOf("object");
    expect(response.result.connections).toBeTypeOf("object");
    expect(response.result.id).toBeTypeOf("string");
    expect(response.result.name).toBeTypeOf("string");
    expect(response.result.recipes).toBeTypeOf("object");
  });

  it("deleteServiceConfig", async () => {
    const response = await client.deleteServiceConfig("my_service_config");
    expect(response.status).toStrictEqual("Success");
    expect(response.result).toBeDefined();
    expect(response.result.audit_data_activity).toBeTypeOf("object");
    expect(response.result.connections).toBeTypeOf("object");
    expect(response.result.id).toBeTypeOf("string");
    expect(response.result.name).toBeTypeOf("string");
    expect(response.result.recipes).toBeTypeOf("object");
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
