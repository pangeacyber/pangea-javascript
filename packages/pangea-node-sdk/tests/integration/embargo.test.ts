import PangeaConfig from "../../src/config";
import EmbargoService from "../../src/services/embargo";
import { PangeaErrors } from "../../src/errors";
import { it, expect } from "@jest/globals";

const token = process.env.PANGEA_INTEGRATION_EMBARGO_TOKEN || "";
const testHost = process.env.PANGEA_INTEGRATION_DOMAIN || "";
const config = new PangeaConfig({ domain: testHost });
const embargo = new EmbargoService(token, config);

it("check IP in Russia", async () => {
  const expected = {
    list_name: "ITAR",
    embargoed_country_name: "Russia",
    embargoed_country_iso_code: "RU",
    issuing_country: "US",
    annotations: expect.any(Object),
  };
  const response = await embargo.ipCheck("213.24.238.26");
  expect(response.status).toBe("Success");

  const sanction = response.result.sanctions[0];
  expect(sanction).toBeDefined();
  expect(sanction).toEqual(expect.objectContaining(expected));
});

it("check ISO for Cuba", async () => {
  const expected = {
    list_name: "ITAR",
    embargoed_country_name: "Cuba",
    embargoed_country_iso_code: "CU",
    issuing_country: "US",
    annotations: expect.any(Object),
  };
  const response = await embargo.isoCheck("CU");
  expect(response.status).toBe("Success");

  const sanction = response.result.sanctions[0];
  expect(sanction).toBeDefined();
  expect(sanction).toEqual(expect.objectContaining(expected));
});

it("wrong IP format fails. Empty string", async () => {
  try {
    const response = await embargo.ipCheck("");
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.pangeaResponse.status).toBe("ValidationError");
      expect(e.errors.length).toBe(1);
      expect(e.pangeaResponse.result.errors.length).toBe(1);
      expect(e.summary).toBe(
        "There was 1 error(s) in the given payload. Please visit https://dev.pangea.cloud/docs/api/embargo#check-ip for more information."
      );
    }
  }
});

it("wrong IP format fails. Not numeric values", async () => {
  try {
    const response = await embargo.ipCheck("thisisnotanIP");
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.pangeaResponse.status).toBe("ValidationError");
      expect(e.errors.length).toBe(1);
      expect(e.pangeaResponse.result.errors.length).toBe(1);
      expect(e.summary).toBe(
        "There was 1 error(s) in the given payload. Please visit https://dev.pangea.cloud/docs/api/embargo#check-ip for more information."
      );
    }
  }
});

it("wrong IP format fails. Missing part", async () => {
  try {
    const response = await embargo.ipCheck("213.24.238");
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.pangeaResponse.status).toBe("ValidationError");
      expect(e.errors.length).toBe(1);
      expect(e.pangeaResponse.result.errors.length).toBe(1);
      expect(e.summary).toBe(
        "There was 1 error(s) in the given payload. Please visit https://dev.pangea.cloud/docs/api/embargo#check-ip for more information."
      );
    }
  }
});

it("wrong IP format fails. Out of range", async () => {
  try {
    const response = await embargo.ipCheck("213.24.238.300");
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.pangeaResponse.status).toBe("ValidationError");
      expect(e.errors.length).toBe(1);
      expect(e.pangeaResponse.result.errors.length).toBe(1);
      expect(e.summary).toBe(
        "There was 1 error(s) in the given payload. Please visit https://dev.pangea.cloud/docs/api/embargo#check-ip for more information."
      );
    }
  }
});

it("bad Auth token", async () => {
  const config = new PangeaConfig({ domain: testHost });
  const badembargo = new EmbargoService("notavalidauthtoken", config);

  try {
    const response = await badembargo.ipCheck("213.24.238.26");
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.UnauthorizedError);
    if (e instanceof PangeaErrors.UnauthorizedError) {
      expect(e.pangeaResponse.status).toBe("Unauthorized");
      expect(e.errors.length).toBe(0);
      expect(e.summary).toBe("Not authorized to access this resource");
    }
  }
});
