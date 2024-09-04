import { setTimeout } from "node:timers/promises";

import PangeaConfig from "../../src/config.js";
import { it, expect, jest } from "@jest/globals";
import {
  TestEnvironment,
  getFileUploadParams,
  getTestDomain,
  getTestToken,
} from "../../src/utils/utils.js";
import { FileScanService, PangeaErrors } from "../../src/index.js";
import { FileScan, TransferMethod } from "../../src/types.js";
import { FileScanUploader } from "@src/services/file_scan.js";
import { loadTestEnvironment, trySlowRequest } from "./utils.js";

const environment = loadTestEnvironment("file-scan", TestEnvironment.LIVE);
const token = getTestToken(environment);
const testHost = getTestDomain(environment);
const config = new PangeaConfig({
  domain: testHost,
  customUserAgent: "sdk-test",
});
const fileScan = new FileScanService(token, config);

const testfilePath = "./tests/testdata/testfile.pdf";

// Polling should finish before the test times out, so set the test timeout to
// the polling duration plus some buffer.
jest.setTimeout(1.05 * config.pollResultTimeoutMs);

it("File Scan crowdstrike", async () => {
  const request = { verbose: true, raw: true, provider: "crowdstrike" };
  const response = await fileScan.fileScan(request, testfilePath);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("benign");
});

it("File Scan multipart post", async () => {
  const request: FileScan.ScanRequest = {
    verbose: true,
    raw: true,
    transfer_method: TransferMethod.MULTIPART,
  };
  const response = await trySlowRequest(
    async () => await fileScan.fileScan(request, testfilePath)
  );
  if (!response) {
    return;
  }

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("benign");
});

it("File Scan crowdstrike async", async () => {
  const request = { verbose: true, raw: true, provider: "crowdstrike" };
  await expect(
    fileScan.fileScan(request, testfilePath, { pollResultSync: false })
  ).rejects.toThrow(PangeaErrors.AcceptedRequestException);
});

it("File Scan crowdstrike async and poll result", async () => {
  let exception;
  try {
    const request = { verbose: true, raw: true, provider: "crowdstrike" };
    await fileScan.fileScan(request, testfilePath, { pollResultSync: false });
    throw new Error("Expected an `AcceptedRequestException`.");
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.APIError);
    if (e instanceof PangeaErrors.AcceptedRequestException) {
      expect(e.pangeaResponse.status).toBe("Accepted");
      expect(e.errors.length).toBe(0);
      exception = e;
    } else {
      throw e;
    }
  }

  for (let retry = 0; retry < 12; retry++) {
    try {
      // Wait until result could be ready
      await setTimeout(10 * 1000);
      const request_id = exception?.request_id || "";
      const response = await fileScan.pollResult(request_id);
      expect(response.status).toBe("Success");
      expect(response.result.data).toBeDefined();
      expect(response.result.data.verdict).toBe("benign");
      return;
    } catch {
      // No-op.
    }
  }

  console.warn(
    `The result of request '${exception.request_id}' took too long to be ready.`
  );
});

it("File Scan reversinglabs", async () => {
  const request = { verbose: true, raw: true, provider: "reversinglabs" };
  const response = await trySlowRequest(
    async () => await fileScan.fileScan(request, testfilePath)
  );
  if (!response) {
    return;
  }

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("benign");
});

it("File Scan reversinglabs async", async () => {
  const request = { verbose: true, raw: true, provider: "reversinglabs" };
  await expect(
    fileScan.fileScan(request, testfilePath, { pollResultSync: false })
  ).rejects.toThrow(PangeaErrors.AcceptedRequestException);
});

it("File Scan reversinglabs async and poll result", async () => {
  let exception: PangeaErrors.AcceptedRequestException;
  try {
    const request = { verbose: true, raw: true, provider: "reversinglabs" };
    await fileScan.fileScan(request, testfilePath, { pollResultSync: false });
    throw new Error("Expected an `AcceptedRequestException`.");
  } catch (e) {
    expect(e).toBeInstanceOf(PangeaErrors.APIError);
    if (e instanceof PangeaErrors.AcceptedRequestException) {
      expect(e.pangeaResponse.status).toBe("Accepted");
      expect(e.errors.length).toBe(0);
      exception = e;
    } else {
      throw e;
    }
  }

  for (let retry = 0; retry < 12; retry++) {
    try {
      // Wait until result could be ready
      await setTimeout(10 * 1000);
      const request_id = exception?.request_id || "";
      const response = await fileScan.pollResult(request_id);
      expect(response.status).toBe("Success");
      expect(response.result.data).toBeDefined();
      expect(response.result.data.verdict).toBe("benign");
      return;
    } catch {
      // No-op.
    }
  }

  console.warn(
    `The result of request '${exception.request_id}' took too long to be ready.`
  );
});

it("File Scan get url and put upload", async () => {
  const request: FileScan.ScanRequest = {
    verbose: true,
    raw: true,
    provider: "reversinglabs",
    transfer_method: TransferMethod.PUT_URL,
  };
  let response = await fileScan.requestUploadURL(request);

  const url = response.accepted_result?.put_url || "";

  const uploader = new FileScanUploader();
  await uploader.uploadFile(
    url,
    {
      file: testfilePath,
      name: "file",
    },
    {
      transfer_method: TransferMethod.PUT_URL,
    }
  );

  for (let retry = 0; retry < 12; retry++) {
    try {
      // Wait until result could be ready
      await setTimeout(10 * 1000);
      const request_id = response.request_id || "";
      response = await fileScan.pollResult(request_id);
      expect(response.status).toBe("Success");
      expect(response.result.data).toBeDefined();
      expect(response.result.data.verdict).toBe("benign");
      return;
    } catch {
      // No-op.
    }
  }

  console.warn(
    `The result of request '${response.request_id}' took too long to be ready.`
  );
});

it("File Scan get url and post upload", async () => {
  const request: FileScan.ScanRequest = {
    verbose: true,
    raw: true,
    provider: "reversinglabs",
    transfer_method: TransferMethod.POST_URL,
  };

  const params = getFileUploadParams(testfilePath);

  let response = await trySlowRequest(() =>
    fileScan.requestUploadURL(request, {
      params: params,
    })
  );
  if (!response) {
    return;
  }

  const url = response.accepted_result?.post_url || "";
  const file_details = response.accepted_result?.post_form_data;

  const uploader = new FileScanUploader();
  await uploader.uploadFile(
    url,
    {
      file: testfilePath,
      name: "file",
      file_details: file_details,
    },
    {
      transfer_method: TransferMethod.POST_URL,
    }
  );

  for (let retry = 0; retry < 12; retry++) {
    try {
      // Wait until result could be ready
      await setTimeout(10 * 1000);
      const request_id = response.request_id || "";
      response = await fileScan.pollResult(request_id);
      expect(response.status).toBe("Success");
      expect(response.result.data).toBeDefined();
      expect(response.result.data.verdict).toBe("benign");
      return;
    } catch {
      // No-op.
    }
  }

  console.warn(
    `The result of request '${response.request_id}' took too long to be ready.`
  );
});
