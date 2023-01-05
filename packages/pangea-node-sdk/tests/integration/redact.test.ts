import PangeaConfig from "../../src/config";
import { PangeaErrors } from "../../src/errors";
import RedactService from "../../src/services/redact";
import { it, expect } from "@jest/globals";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils";

const token = getTestToken(TestEnvironment.LIVE);
const testHost = getTestDomain(TestEnvironment.LIVE);
const config = new PangeaConfig({ domain: testHost });
const redact = new RedactService(token, config);

it("redact a data string", async () => {
  const data = "Jenny Jenny... 415-867-5309";
  const expected = { redacted_text: "<PERSON>... <PHONE_NUMBER>" };

  const response = await redact.redact(data);
  expect(response.status).toBe("Success");
  expect(response.result).toMatchObject(expected);
});

it("redact a data object", async () => {
  const data = { phone: "415-867-5309" };
  const expected = { redacted_data: { phone: "<PHONE_NUMBER>" } };

  const response = await redact.redactStructured(data);
  expect(response.status).toBe("Success");
  expect(response.result).toMatchObject(expected);
});

it("plain redact with object should fail", async () => {
  const data = { phone: "415-867-5309" };

  try {
    // @ts-expect-error
    const response = await redact.redact(data);
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.errors.length).toBe(1);
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
