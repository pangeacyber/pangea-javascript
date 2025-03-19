import PangeaConfig from "../../src/config.js";
import EmbargoService from "../../src/services/embargo.js";
import { PangeaErrors } from "../../src/errors.js";
import { it, expect } from "@jest/globals";
import {
  TestEnvironment,
  getTestURLTemplate,
  getTestToken,
} from "../../src/utils/utils.js";
import { loadTestEnvironment } from "./utils.js";

const environment = loadTestEnvironment("embargo", TestEnvironment.LIVE);

const token = getTestToken(environment);
const urlTemplate = getTestURLTemplate(environment);
const config = new PangeaConfig({
  baseURLTemplate: urlTemplate,
  customUserAgent: "sdk-test",
});
const embargo = new EmbargoService(token, config);

it("check IP in Russia", async () => {
  const expected = {
    list_name: "US - ITAR",
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
    list_name: "US - ITAR",
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
    expect(response).toBeFalsy();
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.pangeaResponse.status).toBe("ValidationError");
      expect(e.errors.length).toBe(1);
      expect(e.pangeaResponse.result.errors.length).toBe(1);
    }
  }
});

it("wrong IP format fails. Not numeric values", async () => {
  try {
    const response = await embargo.ipCheck("thisisnotanIP");
    expect(response).toBeFalsy();
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.pangeaResponse.status).toBe("ValidationError");
      expect(e.errors.length).toBe(1);
      expect(e.pangeaResponse.result.errors.length).toBe(1);
    }
  }
});

it("wrong IP format fails. Missing part", async () => {
  try {
    const response = await embargo.ipCheck("213.24.238");
    expect(response).toBeFalsy();
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.pangeaResponse.status).toBe("ValidationError");
      expect(e.errors.length).toBe(1);
      expect(e.pangeaResponse.result.errors.length).toBe(1);
    }
  }
});

it("wrong IP format fails. Out of range", async () => {
  try {
    const response = await embargo.ipCheck("213.24.238.300");
    expect(response).toBeFalsy();
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.ValidationError);
    if (e instanceof PangeaErrors.ValidationError) {
      expect(e.pangeaResponse.status).toBe("ValidationError");
      expect(e.errors.length).toBe(1);
      expect(e.pangeaResponse.result.errors.length).toBe(1);
    }
  }
});

it("bad Auth token", async () => {
  const config = new PangeaConfig({ baseURLTemplate: urlTemplate });
  const badembargo = new EmbargoService("notavalidauthtoken", config);

  try {
    const response = await badembargo.ipCheck("213.24.238.26");
    expect(response).toBeFalsy();
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.UnauthorizedError);
    if (e instanceof PangeaErrors.UnauthorizedError) {
      expect(e.pangeaResponse.status).toBe("Unauthorized");
      expect(e.errors.length).toBe(0);
      expect(e.summary).toBe("Not authorized to access this resource");
    }
  }
});
