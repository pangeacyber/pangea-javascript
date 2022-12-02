import PangeaConfig from "../../src/config";
import { PangeaErrors } from "../../src/errors";
import RedactService from "../../src/services/redact";
import { it, expect } from "@jest/globals";

const token = process.env.PANGEA_INTEGRATION_REDACT_TOKEN || "";
const testHost = process.env.PANGEA_INTEGRATION_DOMAIN || "";
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
      expect(e.summary).toBe(
        "There was 1 error(s) in the given payload. Please visit https://pangea.cloud/docs/api/redact#redact for more information."
      );
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
