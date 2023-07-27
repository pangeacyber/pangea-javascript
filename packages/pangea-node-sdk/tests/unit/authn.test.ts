import PangeaConfig from "@src/config.js";
import AuthNService from "@src/services/authn/index.js";
import { it, expect } from "@jest/globals";

it("is really a test", async () => {
  const config = new PangeaConfig({});
  const authn = new AuthNService("TEST_TOKEN", config);

  expect(config).toBeDefined();
  expect(authn).toBeDefined();
});
