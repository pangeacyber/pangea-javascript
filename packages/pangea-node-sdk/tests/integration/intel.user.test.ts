import PangeaConfig from "../../src/config.js";
import { it, expect, jest } from "@jest/globals";
import {
  TestEnvironment,
  getHashPrefix,
  getTestDomain,
  getTestToken,
} from "../../src/utils/utils.js";
import { UserIntelService } from "../../src/index.js";
import { Intel } from "../../src/types.js";
import { hashSHA256 } from "../../src/utils/utils.js";

const testEnvironment = TestEnvironment.DEVELOP;

const token = getTestToken(testEnvironment);
const testHost = getTestDomain(testEnvironment);
const config = new PangeaConfig({ domain: testHost, customUserAgent: "sdk-test" });
const userIntel = new UserIntelService(token, config);

jest.setTimeout(60000);
it("User breached by phone should succeed", async () => {
  const request = { phone_number: "8005550123", provider: "spycloud", verbose: true, raw: true };
  const response = await userIntel.userBreached(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);
});

it("User breached bulk by phone should succeed", async () => {
  const request = {
    phone_numbers: ["8005550123", "8005550124"],
    provider: "spycloud",
    verbose: true,
    raw: true,
  };
  const response = await userIntel.userBreachedBulk(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("User breached by email should succeed", async () => {
  const request = {
    email: "test@example.com",
    provider: "spycloud",
    verbose: true,
    raw: true,
  };
  const response = await userIntel.userBreached(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);
});

it("User breached bulk by email should succeed", async () => {
  const request = {
    emails: ["test@example.com", "noreply@example.com"],
    provider: "spycloud",
    verbose: true,
    raw: true,
  };
  const response = await userIntel.userBreachedBulk(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("User breached by username should succeed", async () => {
  const request = {
    username: "shortpatrick",
    provider: "spycloud",
    verbose: true,
    raw: true,
  };
  const response = await userIntel.userBreached(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);
});

it("User breached bulk by username should succeed", async () => {
  const request = {
    usernames: ["shortpatrick", "user1"],
    provider: "spycloud",
    verbose: true,
    raw: true,
  };
  const response = await userIntel.userBreachedBulk(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("User breached by ip should succeed", async () => {
  const request = { ip: "192.168.140.37", provider: "spycloud", verbose: true, raw: true };
  const response = await userIntel.userBreached(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);
});

it("User breached bulk by ip should succeed", async () => {
  const request = {
    ips: ["192.168.140.37", "1.1.1.1"],
    provider: "spycloud",
    verbose: true,
    raw: true,
  };
  const response = await userIntel.userBreachedBulk(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("User breached with default provider should succeed", async () => {
  const request = { phone_number: "8005550123", verbose: true, raw: true };
  const response = await userIntel.userBreached(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);
});

it("User password breached should succeed", async () => {
  const options = { provider: "spycloud", verbose: true, raw: true };
  const response = await userIntel.passwordBreached(Intel.HashType.SHA256, "5baa6", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);
});

it("User password breached bulk should succeed", async () => {
  const options = { provider: "spycloud", verbose: true, raw: true };
  const response = await userIntel.passwordBreachedBulk(
    Intel.HashType.SHA256,
    ["5baa6", "5baa7"],
    options
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(Object.keys(response.result.data).length).toBe(2);
});

it("User password breached with default provider should succeed", async () => {
  const options = { verbose: true, raw: true };
  const response = await userIntel.passwordBreached(Intel.HashType.SHA256, "5baa6", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);
});

it("User password breached complete workflow", async () => {
  const password = "admin123";
  const hash = hashSHA256(password);
  const hashPrefix = getHashPrefix(hash);

  const options = { verbose: true, raw: true };
  const response = await userIntel.passwordBreached(Intel.HashType.SHA256, hashPrefix, options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);

  const status = UserIntelService.isPasswordBreached(response, hash);
  expect(status).toBe(Intel.User.Password.PasswordStatus.BREACHED);
});
