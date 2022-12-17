import PangeaConfig from "../../src/config";
import AuthnService from "../../src/services/authn";
import { jest } from "@jest/globals";
import { AuthN, ConfigEnv } from "../../src/types";

it("is really a test", async () => {
  const config = new PangeaConfig({});
  const authn = new AuthnService("TEST_TOKEN", config);

  expect(config).toBeDefined();
  expect(authn).toBeDefined();
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
      [],
      [null, null, null],
      [undefined, undefined, undefined],
      [0],
      [""],
      [" ", " ", " "],
    ];

    argumentsToTest.forEach((testCaseArgs) => {
      expect(() => {
        // @ts-ignore testing passing no params that are required
        authn.passwordUpdate(...testCaseArgs);
      }).toThrow("passwordUpdate was called without supplying an email");
    });
  });

  it("should sanity check: oldSecret is required", () => {
    const argumentsToTest = [
      ["e@example.com"],
      ["e@example.com", null, null],
      ["e@example.com", undefined, undefined],
      ["e@example.com", 0],
      ["e@example.com", ""],
      ["e@example.com", " ", " "],
    ];

    argumentsToTest.forEach((testCaseArgs) => {
      expect(() => {
        // @ts-ignore testing passing no params that are required
        authn.passwordUpdate(...testCaseArgs);
      }).toThrow("passwordUpdate was called without supplying an oldSecret");
    });
  });

  it("should sanity check: newSecret is required", () => {
    const argumentsToTest = [
      ["e@example.com", "hunter2"],
      ["e@example.com", "hunter2", null],
      ["e@example.com", "hunter2", undefined],
      ["e@example.com", "hunter2", 0],
      ["e@example.com", "hunter2", ""],
      ["e@example.com", "hunter2", " "],
    ];

    argumentsToTest.forEach((testCaseArgs) => {
      expect(() => {
        // @ts-ignore testing passing no params that are required
        authn.passwordUpdate(...testCaseArgs);
      }).toThrow("passwordUpdate was called without supplying an newSecret");
    });
  });

  it("passes the boundary test", () => {
    authn.passwordUpdate("hey", "hunter2", "My2n+Password");

    const dataBoundary: AuthN.PasswordUpdateRequest = {
      email: "hey",
      old_secret: "hunter2",
      new_secret: "My2n+Password",
    };

    expect(authn.post).toHaveBeenCalledTimes(1);
    expect(authn.post).toHaveBeenCalledWith("password/update", dataBoundary);
  });
});
