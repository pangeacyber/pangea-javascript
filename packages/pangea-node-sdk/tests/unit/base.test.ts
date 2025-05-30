import { it, expect } from "vitest";

import PangeaConfig from "@src/config.js";
import BaseService from "@src/services/base.js";

const token = "token";
const serviceName = "service";
const config = new PangeaConfig({});

it("base service success", () => {
  const base = new BaseService(serviceName, token, config);
  expect(base).toBeDefined();
});

it("base service with no token fails", () => {
  try {
    new BaseService(serviceName, "", config);
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});

it("base service with no service name fails", () => {
  try {
    new BaseService("", token, config);
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});
