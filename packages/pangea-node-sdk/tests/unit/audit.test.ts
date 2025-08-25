import { it, expect } from "vitest";

import { AuditService, PangeaConfig } from "@src/index.js";

it("is really a test", () => {
  const config = new PangeaConfig({});
  const audit = new AuditService("TEST_TOKEN", config);

  expect(config).toBeDefined();
  expect(audit).toBeDefined();
});
