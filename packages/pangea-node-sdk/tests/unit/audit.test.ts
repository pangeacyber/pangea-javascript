import { it, expect } from "@jest/globals";

import PangeaConfig from "@src/config.js";
import AuditService from "@src/services/audit.js";

it("is really a test", () => {
  const config = new PangeaConfig({});
  const audit = new AuditService("TEST_TOKEN", config);

  expect(config).toBeDefined();
  expect(audit).toBeDefined();
});
