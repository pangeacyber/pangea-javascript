import PangeaConfig from "../../src/config.js";
import AuditService from "../../src/services/audit.js";
import { it, expect } from "@jest/globals";

it("is really a test", async () => {
  const config = new PangeaConfig({});
  const audit = new AuditService("TEST_TOKEN", config);

  expect(config).toBeDefined();
  expect(audit).toBeDefined();
});
