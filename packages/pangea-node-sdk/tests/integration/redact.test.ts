import PangeaConfig from "../../src/config.js";
import { PangeaErrors } from "../../src/errors.js";
import RedactService from "../../src/services/redact.js";
import { it, expect } from "@jest/globals";
import {
  TestEnvironment,
  getTestDomain,
  getTestToken,
  getMultiConfigTestToken,
  getConfigID,
} from "../../src/utils/utils.js";

const environment = TestEnvironment.LIVE;

const token = getTestToken(environment);
const tokenMultiConfig = getMultiConfigTestToken(environment);
const domain = getTestDomain(environment);
const config = new PangeaConfig({ domain: domain, customUserAgent: "sdk-test" });
const redact = new RedactService(token, config);

it("redact a data string", async () => {
  const data = "Jenny Jenny... 415-867-5309";
  const expected = { redacted_text: "<PERSON>... <PHONE_NUMBER>", count: 2 };

  const response = await redact.redact(data);
  expect(response.status).toBe("Success");
  expect(response.result).toEqual(expected);
});

it("redact a data string without result", async () => {
  const data = "Jenny Jenny... 415-867-5309";
  const expected = { count: 2 };

  const response = await redact.redact(data, { return_result: false });
  expect(response.status).toBe("Success");
  expect(response.result).toEqual(expected);
});

it("redact a data object", async () => {
  const data = { phone: "415-867-5309" };
  const expected = { redacted_data: { phone: "<PHONE_NUMBER>" }, count: 1 };

  const response = await redact.redactStructured(data);
  expect(response.status).toBe("Success");
  expect(response.result).toEqual(expected);
});

it("redact a data object without result", async () => {
  const data = { phone: "415-867-5309" };
  const expected = { count: 1 };

  const response = await redact.redactStructured(data, { return_result: false });
  expect(response.status).toBe("Success");
  expect(response.result).toEqual(expected);
});

it("plain redact with object should fail", async () => {
  const data = { phone: "415-867-5309" };

  try {
    // @ts-expect-error
    const response = await redact.redact(data);
    expect(false).toBeTruthy();
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.errors.length).toBe(1);
      expect(e.toString()).toBeDefined();
    }
  }
});

it("bad token should fail", async () => {
  const data = { phone: "415-867-5309" };
  const badredact = new RedactService("notarealtoken", config);

  try {
    // @ts-expect-error
    const response = await badredact.redact(data);
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.UnauthorizedError);
  }
});

it("redact multi config 1", async () => {
  const configID = getConfigID(environment, "redact", 1);
  const config = new PangeaConfig({
    domain: domain,
    customUserAgent: "sdk-test",
  });
  const redactMultiConfig = new RedactService(tokenMultiConfig, config, {
    config_id: configID,
  });

  const data = "Jenny Jenny... 415-867-5309";
  const expected = { redacted_text: "<PERSON>... <PHONE_NUMBER>", count: 2 };

  const response = await redactMultiConfig.redact(data);
  expect(response.status).toBe("Success");
  expect(response.result).toEqual(expected);
});

it("redact multi config 2. no verbose", async () => {
  const configID = getConfigID(environment, "redact", 2);
  const config = new PangeaConfig({
    domain: domain,
    customUserAgent: "sdk-test",
  });
  const redactMultiConfig = new RedactService(tokenMultiConfig, config, {
    config_id: configID,
  });

  const data = "Jenny Jenny... 415-867-5309";
  const expected = { redacted_text: "<PERSON>... <PHONE_NUMBER>", count: 2 };

  const response = await redactMultiConfig.redact(data);
  expect(response.status).toBe("Success");
  expect(response.result).toEqual(expected);
});

it("log multi config token, without config id", async () => {
  const config = new PangeaConfig({
    domain: domain,
    customUserAgent: "sdk-test",
  });

  const redactMultiConfig = new RedactService(tokenMultiConfig, config);
  const data = "Jenny Jenny... 415-867-5309";

  const t = async () => {
    const response = await redactMultiConfig.redact(data);
    expect(response).toBeFalsy();
  };

  await expect(t()).rejects.toThrow(PangeaErrors.APIError);
});
