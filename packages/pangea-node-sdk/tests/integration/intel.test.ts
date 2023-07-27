import PangeaConfig from "../../src/config.js";
import { it, expect, jest, beforeAll } from "@jest/globals";
import {
  TestEnvironment,
  getHashPrefix,
  getTestDomain,
  getTestToken,
} from "../../src/utils/utils.js";
import {
  FileIntelService,
  DomainIntelService,
  IPIntelService,
  URLIntelService,
  UserIntelService,
  FileScanService,
} from "../../src/index.js";
import fs from "fs";
import { PangeaErrors } from "../../src/index.js";
import { Intel } from "../../src/types.js";
import { hashSHA256 } from "../../src/utils/utils.js";

const testEnvironment = TestEnvironment.DEVELOP;

const token = getTestToken(testEnvironment);
const testHost = getTestDomain(testEnvironment);
const config = new PangeaConfig({ domain: testHost, customUserAgent: "sdk-test" });
const fileIntel = new FileIntelService(token, config);
const domainIntel = new DomainIntelService(token, config);
const ipIntel = new IPIntelService(token, config);
const urlIntel = new URLIntelService(token, config);
const userIntel = new UserIntelService(token, config);
const fileScan = new FileScanService(token, config);

const EICAR = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*\n";
const eicarFilePath = "./tests/testdata/file.exe";

function createEICAR() {
  fs.writeFileSync(eicarFilePath, EICAR);
}

beforeAll(() => {
  createEICAR();
});

it("file hash reputation should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const response = await fileIntel.hashReputation(
    "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
    "sha256",
    options
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("file filepathReputation with filepath should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const response = await fileIntel.filepathReputation("./README.md", options);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("file reputation with filepath should faild", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };

  try {
    const response = await fileIntel.filepathReputation("./not/a/real/path/file.txt", options);
    expect(response).toBeFalsy();
  } catch (e: unknown) {
    // @ts-ignore
    expect(e.code).toBe("ENOENT");
  }
});

it("Domain reputation should succeed", async () => {
  const options = { provider: "domaintools", verbose: true, raw: true };
  const response = await domainIntel.reputation("737updatesboeing.com", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("IP geolocate should succeed", async () => {
  const options = { provider: "digitalelement", verbose: true, raw: true };
  const response = await ipIntel.geolocate("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.country).toBe("Federal Republic Of Germany");
  expect(response.result.data.city).toBe("unna");
  expect(response.result.data.postal_code).toBe("59425");
});

it("IP geolocate with default provider should succeed", async () => {
  const response = await ipIntel.geolocate("93.231.182.110");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("IP get domain should succeed", async () => {
  const options = { provider: "digitalelement", verbose: true, raw: true };
  const response = await ipIntel.getDomain("24.235.114.61", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.domain_found).toBeTruthy();
  expect(response.result.data.domain).toBe("rogers.com");
});

it("IP get domain with default provider should succeed", async () => {
  const response = await ipIntel.getDomain("24.235.114.61");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.domain_found).toBeTruthy();
  expect(response.result.data.domain).toBe("rogers.com");
});

it("IP is VPN should succeed", async () => {
  const options = { provider: "digitalelement", verbose: true, raw: true };
  const response = await ipIntel.isVPN("2.56.189.74", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_vpn).toBeTruthy();
});

it("IP is VPN with default provider should succeed", async () => {
  const response = await ipIntel.isVPN("2.56.189.74");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_vpn).toBeTruthy();
});

it("IP is proxy should succeed", async () => {
  const options = { provider: "digitalelement", verbose: true, raw: true };
  const response = await ipIntel.isProxy("132.76.150.141", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_proxy).toBeTruthy();
});

it("IP is proxy with default provider should succeed", async () => {
  const response = await ipIntel.isProxy("132.76.150.141");
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.is_proxy).toBeTruthy();
});

it("IP reputation should succeed. Crowdstrike provider", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await ipIntel.reputation("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("IP reputation should succeed. Cymru provider", async () => {
  const options = { provider: "cymru", verbose: true, raw: true };
  const response = await ipIntel.reputation("93.231.182.110", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
});

it("URL reputation should succeed", async () => {
  const options = { provider: "crowdstrike", verbose: true, raw: true };
  const response = await urlIntel.reputation("http://113.235.101.11:54384", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("URL reputation with default provider should succeed", async () => {
  const response = await urlIntel.reputation("http://113.235.101.11:54384");
  expect(response.status).toBe("Success");
});

it("User breached by phone should succeed", async () => {
  const request = { phone_number: "8005550123", provider: "spycloud", verbose: true, raw: true };
  const response = await userIntel.userBreached(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);
});

jest.setTimeout(10000);
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

jest.setTimeout(10000);
it("User breached by ip should succeed", async () => {
  const request = { ip: "192.168.140.37", provider: "spycloud", verbose: true, raw: true };
  const response = await userIntel.userBreached(request);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);
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

it("User password breached with default provider should succeed", async () => {
  const options = { verbose: true, raw: true };
  const response = await userIntel.passwordBreached(Intel.HashType.SHA256, "5baa6", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.found_in_breach).toBe(true);
  expect(response.result.data.breach_count).toBeGreaterThan(0);
});

jest.setTimeout(60000);
it("File Scan ", async () => {
  try {
    const request = { verbose: true, raw: true, provider: "reversinglabs" };
    const response = await fileScan.fileScan(request, eicarFilePath);

    expect(response.status).toBe("Success");
    expect(response.result.data).toBeDefined();
    expect(response.result.data.verdict).toBe("malicious");
  } catch (e) {
    console.log(e);
    expect(false).toBeTruthy();
  }
});

jest.setTimeout(60000);
it("File Scan async ", async () => {
  try {
    const request = { verbose: true, raw: true, provider: "reversinglabs" };
    const response = await fileScan.fileScan(request, eicarFilePath, { pollResultSync: false });
    expect(false).toBeTruthy();
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.APIError);
    if (e instanceof PangeaErrors.AcceptedRequestException) {
      expect(e.pangeaResponse.status).toBe("Accepted");
      expect(e.errors.length).toBe(0);
    } else {
      console.log(e);
      expect(false).toBeTruthy();
    }
  }
});

const delay = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

jest.setTimeout(120000);
it("File Scan async and poll result", async () => {
  let exception;
  try {
    const request = { verbose: true, raw: true, provider: "reversinglabs" };
    const response = await fileScan.fileScan(request, eicarFilePath, { pollResultSync: false });
    expect(false).toBeTruthy();
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.APIError);
    if (e instanceof PangeaErrors.AcceptedRequestException) {
      expect(e.pangeaResponse.status).toBe("Accepted");
      expect(e.errors.length).toBe(0);
      exception = e;
    } else {
      console.log(e);
      expect(false).toBeTruthy();
    }
  }

  // Wait until result could be ready
  await delay(120 * 1000);
  const request_id = exception?.request_id || "";
  const response = await fileScan.pollResult(request_id);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
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
