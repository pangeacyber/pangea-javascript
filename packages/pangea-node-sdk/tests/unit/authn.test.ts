import PangeaConfig from "../../src/config";
import AuthNService from "../../src/services/authn";
import { jest, it, expect, describe } from "@jest/globals";
import { ConfigEnv } from "../../src/types";

it("is really a test", async () => {
  const config = new PangeaConfig({});
  const authn = new AuthNService("TEST_TOKEN", config);

  expect(config).toBeDefined();
  expect(authn).toBeDefined();
});
