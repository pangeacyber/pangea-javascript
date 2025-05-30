import { it, expect } from "vitest";

import PangeaConfig from "@src/config.js";
import AuthNService from "@src/services/authn/index.js";

it("is really a test", () => {
  const config = new PangeaConfig({});
  const authn = new AuthNService("TEST_TOKEN", config);

  expect(config).toBeDefined();
  expect(authn).toBeDefined();
});
