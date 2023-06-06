import PangeaConfig from "../../src/config.js";
import AuditService from "../../src/services/audit.js";
import { it, expect } from "@jest/globals";
import BaseService from "../../src/services/base.js";

const token = "token";
const serviceName = "service";
const config = new PangeaConfig({});

it("base service success", async () => {
  const base = new BaseService(serviceName, token, config);
  expect(true).toBeTruthy();
});

it("base service with no token fails", async () => {
  try {
    const base = new BaseService(serviceName, "", config);
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});

it("base service with no service name fails", async () => {
  try {
    const base = new BaseService("", token, config);
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});
