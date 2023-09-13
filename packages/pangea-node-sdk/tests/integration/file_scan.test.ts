import PangeaConfig from "../../src/config.js";
import { it, expect, jest } from "@jest/globals";
import { TestEnvironment, getTestDomain, getTestToken } from "../../src/utils/utils.js";
import { FileScanService, PangeaErrors } from "../../src/index.js";

const testEnvironment = TestEnvironment.LIVE;

const token = getTestToken(testEnvironment);
const testHost = getTestDomain(testEnvironment);
const config = new PangeaConfig({ domain: testHost, customUserAgent: "sdk-test" });
const fileScan = new FileScanService(token, config);

const testfilePath = "./tests/testdata/testfile.pdf";
jest.setTimeout(60000);

const delay = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

it("File Scan crowdstrike", async () => {
  try {
    const request = { verbose: true, raw: true, provider: "crowdstrike" };
    const response = await fileScan.fileScan(request, testfilePath);

    expect(response.status).toBe("Success");
    expect(response.result.data).toBeDefined();
    expect(response.result.data.verdict).toBe("benign");
  } catch (e) {
    console.log(e);
    expect(false).toBeTruthy();
  }
});

it("File Scan crowdstrike async", async () => {
  try {
    const request = { verbose: true, raw: true, provider: "crowdstrike" };
    await fileScan.fileScan(request, testfilePath, { pollResultSync: false });
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

it("File Scan crowdstrike async and poll result", async () => {
  let exception;
  try {
    const request = { verbose: true, raw: true, provider: "crowdstrike" };
    await fileScan.fileScan(request, testfilePath, { pollResultSync: false });
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
  await delay(30 * 1000);
  const request_id = exception?.request_id || "";
  const response = await fileScan.pollResult(request_id);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("benign");
});

it("File Scan reversinglabs", async () => {
  try {
    const request = { verbose: true, raw: true, provider: "reversinglabs" };
    const response = await fileScan.fileScan(request, testfilePath);

    expect(response.status).toBe("Success");
    expect(response.result.data).toBeDefined();
    expect(response.result.data.verdict).toBe("benign");
  } catch (e) {
    console.log(e);
    expect(false).toBeTruthy();
  }
});

it("File Scan reversinglabs async", async () => {
  try {
    const request = { verbose: true, raw: true, provider: "reversinglabs" };
    await fileScan.fileScan(request, testfilePath, { pollResultSync: false });
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

it("File Scan reversinglabs async and poll result", async () => {
  let exception;
  try {
    const request = { verbose: true, raw: true, provider: "reversinglabs" };
    await fileScan.fileScan(request, testfilePath, { pollResultSync: false });
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
  await delay(30 * 1000);
  const request_id = exception?.request_id || "";
  const response = await fileScan.pollResult(request_id);
  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("benign");
});
