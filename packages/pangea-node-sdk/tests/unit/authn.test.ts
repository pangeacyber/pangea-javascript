import PangeaConfig from "../../src/config";
import AuthnService from "../../src/services/authn";
import { jest, it, expect, describe } from "@jest/globals";
import { AuthN, ConfigEnv } from "../../src/types";

it("is really a test", async () => {
  const config = new PangeaConfig({});
  const authn = new AuthnService("TEST_TOKEN", config);

  expect(config).toBeDefined();
  expect(authn).toBeDefined();
});

describe("authn::/v1/user/login", () => {
  const config = new PangeaConfig({
    domain: "dev.aws.us.pangea.cloud",
    environment: ConfigEnv["local"],
  });

  const authn = new AuthnService("TEST_TOKEN", config);

  // @ts-ignore we don't care... we're mocking it
  authn.post = jest.fn();

  it("should sanity check: email is required", () => {
    const argumentsToTest = [
      {},
      { email: "" },
      { email: " " },
      { email: undefined },
      { email: null },
      { email: 0 },
      { email: true },
      { email: false },
    ];

    argumentsToTest.forEach((params) => {
      expect(() => {
        // @ts-expect-error testing param validation
        authn.user.login(params);
      }).toThrow("userLogin was called without supplying an email");
    });
  });

  it("should sanity check: secret is required", () => {
    const argumentsToTest = [
      { email: "e@ex.co" },
      { email: "e@ex.co", secret: "" },
      { email: "e@ex.co", secret: " " },
      { email: "e@ex.co", secret: undefined },
      { email: "e@ex.co", secret: null },
      { email: "e@ex.co", secret: 0 },
      { email: "e@ex.co", secret: true },
      { email: "e@ex.co", secret: false },
    ];

    argumentsToTest.forEach((params) => {
      expect(() => {
        // @ts-expect-error testing param validation
        authn.user.login(params);
      }).toThrow("userLogin was called without supplying a secret");
    });
  });
});

describe("authn::/v1/password/update", () => {
  const config = new PangeaConfig({
    domain: "dev.aws.us.pangea.cloud",
    environment: ConfigEnv["local"],
  });
  const authn = new AuthnService("TEST_TOKEN", config);

  // @ts-ignore we don't care... we're mocking it
  authn.post = jest.fn();

  it("should sanity check: email is required", () => {
    const argumentsToTest = [
      {},
      { email: null, old_secret: null, new_secret: null },
      { email: undefined, old_secret: undefined, new_secret: undefined },
      { email: 0 },
      { email: "" },
      { email: " ", old_secret: " ", new_secret: " " },
    ];

    argumentsToTest.forEach((params) => {
      expect(() => {
        // @ts-expect-error testing param validation
        authn.passwordUpdate(params);
      }).toThrow("passwordUpdate was called without supplying an email");
    });
  });

  it("should sanity check: oldSecret is required", () => {
    const argumentsToTest = [
      { email: "e@example.com" },
      { email: "e@example.com", old_secret: null, new_secret: null },
      { email: "e@example.com", old_secret: undefined, new_secret: undefined },
      { email: "e@example.com", old_secret: 0 },
      { email: "e@example.com", old_secret: "" },
      { email: "e@example.com", old_secret: " ", new_secret: " " },
    ];

    argumentsToTest.forEach((params) => {
      expect(() => {
        // @ts-expect-error testing param validation
        authn.passwordUpdate(params);
      }).toThrow("passwordUpdate was called without supplying an old_secret");
    });
  });

  it("should sanity check: newSecret is required", () => {
    const argumentsToTest = [
      { email: "e@example.com", old_secret: "hunter2" },
      { email: "e@example.com", old_secret: "hunter2", new_secret: null },
      { email: "e@example.com", old_secret: "hunter2", new_secret: undefined },
      { email: "e@example.com", old_secret: "hunter2", new_secret: 0 },
      { email: "e@example.com", old_secret: "hunter2", new_secret: "" },
      { email: "e@example.com", old_secret: "hunter2", new_secret: " " },
    ];

    argumentsToTest.forEach((params) => {
      expect(() => {
        // @ts-expect-error testing param validation
        authn.passwordUpdate(params);
      }).toThrow("passwordUpdate was called without supplying a new_secret");
    });
  });
});
