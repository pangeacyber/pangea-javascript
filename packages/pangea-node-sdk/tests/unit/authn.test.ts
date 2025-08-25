import { it, expect } from "vitest";

import { AuthNService, PangeaConfig } from "@src/index.js";

it("is really a test", () => {
  const config = new PangeaConfig({});
  const authn = new AuthNService("TEST_TOKEN", config);

  expect(config).toBeDefined();
  expect(authn).toBeDefined();
});
