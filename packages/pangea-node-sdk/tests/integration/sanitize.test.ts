import { it, expect, vi } from "vitest";

import PangeaConfig from "../../src/config.js";
import {
  TestEnvironment,
  getCustomSchemaTestToken,
  getFileUploadParams,
  getTestDomain,
} from "../../src/utils/utils.js";
import {
  SanitizeService,
  PangeaErrors,
  FileUploader,
} from "../../src/index.js";
import { Sanitize, TransferMethod } from "../../src/types.js";
import { loadTestEnvironment, trySlowRequest, delay } from "./utils.js";

const environment = loadTestEnvironment("sanitize", TestEnvironment.LIVE);

// The Sanitize config in the regular org was obsoleted by a breaking change,
// so the custom schema org is used instead.
const token = getCustomSchemaTestToken(environment);
const testHost = getTestDomain(environment);
const config = new PangeaConfig({
  domain: testHost,
  customUserAgent: "sdk-test",
  pollResultTimeoutMs: 180000,
});
const client = new SanitizeService(token, config);

const testfilePath = "./tests/testdata/test-sanitize.txt";
vi.setConfig({ testTimeout: 2 * config.pollResultTimeoutMs });

it("Sanitize and share", async () => {
  const file_scan: Sanitize.SanitizeFile = { scan_provider: "crowdstrike" };
  const content: Sanitize.SanitizeContent = {
    url_intel: true,
    url_intel_provider: "crowdstrike",
    domain_intel: true,
    domain_intel_provider: "crowdstrike",
    defang: true,
    defang_threshold: 20,
    redact: true,
  };
  const share_output: Sanitize.SanitizeShareOutput = {
    enabled: true,
    output_folder: "sdk_test/sanitize/",
  };
  const request: Sanitize.SanitizeRequest = {
    transfer_method: TransferMethod.POST_URL,
    file: file_scan,
    content,
    share_output,
    uploaded_file_name: "uploaded_file",
  };
  const response = await trySlowRequest(
    async () =>
      await client.sanitize(request, {
        file: testfilePath,
        name: "file",
      })
  );
  if (!response) {
    return;
  }

  expect(response.status).toBe("Success");
  expect(response.result.dest_url).toBeUndefined();
  expect(response.result.dest_share_id).toBeDefined();
  expect(response.result.data.redact).toBeDefined();
  if (response.result.data.redact) {
    expect(response.result.data.redact.redaction_count).toBeGreaterThan(0);
    expect(response.result.data.redact.summary_counts).not.toEqual({});
  }
  expect(response.result.data.defang).toBeDefined();
  if (response.result.data.defang) {
    expect(response.result.data.defang.external_urls_count).toBeGreaterThan(0);
    expect(response.result.data.defang.external_domains_count).toBeGreaterThan(
      0
    );
    expect(response.result.data.defang.defanged_count).toBe(0);
    expect(response.result.data.defang.domain_intel_summary).toBeDefined();
  }
  expect(response.result.data.malicious_file).toBeFalsy();
});

it("Sanitize no share", async () => {
  const file_scan: Sanitize.SanitizeFile = { scan_provider: "crowdstrike" };
  const content: Sanitize.SanitizeContent = {
    url_intel: true,
    url_intel_provider: "crowdstrike",
    domain_intel: true,
    domain_intel_provider: "crowdstrike",
    defang: true,
    defang_threshold: 20,
    redact: true,
  };
  const share_output: Sanitize.SanitizeShareOutput = {
    enabled: false,
  };
  const request: Sanitize.SanitizeRequest = {
    transfer_method: TransferMethod.POST_URL,
    file: file_scan,
    content,
    share_output,
    uploaded_file_name: "uploaded_file",
  };
  const response = await trySlowRequest(
    async () =>
      await client.sanitize(request, {
        file: testfilePath,
        name: "file",
      })
  );
  if (!response) {
    return;
  }

  expect(response.status).toBe("Success");
  expect(response.result.dest_url).toBeDefined();
  expect(response.result.dest_share_id).toBeUndefined();
  expect(response.result.data.redact).toBeDefined();
  if (response.result.data.redact) {
    expect(response.result.data.redact.redaction_count).toBeGreaterThan(0);
    expect(response.result.data.redact.summary_counts).not.toEqual({});
  }
  expect(response.result.data.defang).toBeDefined();
  if (response.result.data.defang) {
    expect(response.result.data.defang.external_urls_count).toBeGreaterThan(0);
    expect(response.result.data.defang.external_domains_count).toBeGreaterThan(
      0
    );
    expect(response.result.data.defang.defanged_count).toBe(0);
    expect(response.result.data.defang.domain_intel_summary).toBeDefined();
  }
  expect(response.result.data.malicious_file).toBeFalsy();

  if (response.result.dest_url) {
    const attachedFile = await client.downloadFile(
      new URL(response.result.dest_url)
    );
    attachedFile.save("./");
  }
});

it("Sanitize all defaults", async () => {
  const request: Sanitize.SanitizeRequest = {
    transfer_method: TransferMethod.POST_URL,
    uploaded_file_name: "uploaded_file",
  };
  const response = await trySlowRequest(
    async () =>
      await client.sanitize(request, {
        file: testfilePath,
        name: "file",
      })
  );
  if (!response) {
    return;
  }

  expect(response.status).toBe("Success");
  expect(response.result.dest_url).toBeDefined();
  expect(response.result.dest_share_id).toBeUndefined();
  expect(response.result.data.redact).toBeUndefined();
  expect(response.result.data.defang).toBeDefined();
  if (response.result.data.defang) {
    expect(response.result.data.defang.external_urls_count).toBeGreaterThan(0);
    expect(response.result.data.defang.external_domains_count).toBeGreaterThan(
      0
    );
    expect(response.result.data.defang.defanged_count).toBe(0);
    expect(response.result.data.defang.domain_intel_summary).toBeDefined();
  }
  expect(response.result.data.malicious_file).toBeFalsy();
  if (response.result.dest_url) {
    const attachedFile = await client.downloadFile(
      new URL(response.result.dest_url)
    );
    attachedFile.save("./");
  }
});

it("Sanitize multipart upload", async () => {
  const file_scan: Sanitize.SanitizeFile = { scan_provider: "crowdstrike" };
  const content: Sanitize.SanitizeContent = {
    url_intel: true,
    url_intel_provider: "crowdstrike",
    domain_intel: true,
    domain_intel_provider: "crowdstrike",
    defang: true,
    defang_threshold: 20,
    redact: true,
  };
  const share_output: Sanitize.SanitizeShareOutput = {
    enabled: false,
  };
  const request: Sanitize.SanitizeRequest = {
    transfer_method: TransferMethod.MULTIPART,
    file: file_scan,
    content,
    share_output,
    uploaded_file_name: "uploaded_file",
  };
  const response = await trySlowRequest(
    async () =>
      await client.sanitize(request, {
        file: testfilePath,
        name: "file",
      })
  );
  if (!response) {
    return;
  }

  expect(response.status).toBe("Success");
  expect(response.result.dest_url).toBeDefined();
  expect(response.result.dest_share_id).toBeUndefined();
  expect(response.result.data.redact).toBeDefined();
  if (response.result.data.redact) {
    expect(response.result.data.redact.redaction_count).toBeGreaterThan(0);
    expect(response.result.data.redact.summary_counts).not.toEqual({});
  }
  expect(response.result.data.defang).toBeDefined();
  if (response.result.data.defang) {
    expect(response.result.data.defang.external_urls_count).toBeGreaterThan(0);
    expect(response.result.data.defang.external_domains_count).toBeGreaterThan(
      0
    );
    expect(response.result.data.defang.defanged_count).toBe(0);
    expect(response.result.data.defang.domain_intel_summary).toBeDefined();
  }
  expect(response.result.data.malicious_file).toBeFalsy();

  if (response.result.dest_url) {
    const attachedFile = await client.downloadFile(
      new URL(response.result.dest_url)
    );
    attachedFile.save("./");
  }
});

it("Sanitize async and poll result", async () => {
  let exception: PangeaErrors.AcceptedRequestException | undefined;
  try {
    const request: Sanitize.SanitizeRequest = {
      transfer_method: TransferMethod.POST_URL,
      uploaded_file_name: "uploaded_file",
    };
    await client.sanitize(
      request,
      {
        file: testfilePath,
        name: "file",
      },
      {
        pollResultSync: false,
      }
    );
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

  const maxRetry = 12;
  for (let retry = 0; retry < maxRetry; retry++) {
    try {
      // Wait until result could be ready
      await delay(10 * 1000);
      const request_id = exception?.request_id || "";
      const response =
        await client.pollResult<Sanitize.SanitizeResult>(request_id);
      expect(response.status).toBe("Success");
      expect(response.result.dest_url).toBeDefined();
      expect(response.result.dest_share_id).toBeUndefined();
      expect(response.result.data.redact).toBeUndefined();
      expect(response.result.data.defang).toBeDefined();
      if (response.result.data.defang) {
        expect(response.result.data.defang.external_urls_count).toBeGreaterThan(
          0
        );
        expect(
          response.result.data.defang.external_domains_count
        ).toBeGreaterThan(0);
        expect(response.result.data.defang.defanged_count).toBe(0);
        expect(response.result.data.defang.domain_intel_summary).toBeDefined();
      }
      expect(response.result.data.malicious_file).toBeFalsy();
      if (response.result.dest_url) {
        const attachedFile = await client.downloadFile(
          new URL(response.result.dest_url)
        );
        attachedFile.save("./");
      }
      return;
    } catch (e) {
      if (!(e instanceof PangeaErrors.AcceptedRequestException)) {
        throw e;
      }
    }
  }

  console.warn(
    `The result of request '${exception?.request_id}' took too long to be ready.`
  );
});

it("Sanitize get url and put upload", async () => {
  const request: Sanitize.SanitizeRequest = {
    transfer_method: TransferMethod.PUT_URL,
    uploaded_file_name: "uploaded_file",
  };
  let response = await client.requestUploadURL(request);

  const url = response.accepted_result?.put_url || "";

  const uploader = new FileUploader();
  await uploader.uploadFile(
    new URL(url),
    {
      file: testfilePath,
      name: "file",
    },
    {
      transfer_method: TransferMethod.PUT_URL,
    }
  );

  const maxRetry = 12;
  for (let retry = 0; retry < maxRetry; retry++) {
    try {
      // Wait until result could be ready
      await delay(10 * 1000);
      const request_id: string = response.request_id || "";
      response = await client.pollResult<Sanitize.SanitizeResult>(request_id);
      expect(response.status).toBe("Success");
      expect(response.result.dest_url).toBeDefined();
      expect(response.result.dest_share_id).toBeUndefined();
      expect(response.result.data.redact).toBeUndefined();
      expect(response.result.data.defang).toBeDefined();
      if (response.result.data.defang) {
        expect(response.result.data.defang.external_urls_count).toBeGreaterThan(
          0
        );
        expect(
          response.result.data.defang.external_domains_count
        ).toBeGreaterThan(0);
        expect(response.result.data.defang.defanged_count).toBe(0);
        expect(response.result.data.defang.domain_intel_summary).toBeDefined();
      }
      expect(response.result.data.malicious_file).toBeFalsy();
      if (response.result.dest_url) {
        const attachedFile = await client.downloadFile(
          new URL(response.result.dest_url)
        );
        attachedFile.save("./");
      }
      return;
    } catch (e) {
      if (!(e instanceof PangeaErrors.AcceptedRequestException)) {
        throw e;
      }
    }
  }

  console.warn(
    `The result of request '${response.request_id}' took too long to be ready.`
  );
});

it("Sanitize get url and post upload", async () => {
  const params = getFileUploadParams(testfilePath);
  const request: Sanitize.SanitizeRequest = {
    transfer_method: TransferMethod.POST_URL,
    uploaded_file_name: "uploaded_file",
    crc32c: params.crc32c,
    sha256: params.sha256,
    size: params.size,
  };
  let response = await client.requestUploadURL(request);

  const url = response.accepted_result?.post_url || "";
  const file_details = response.accepted_result?.post_form_data;

  const uploader = new FileUploader();
  await uploader.uploadFile(
    new URL(url),
    {
      file: testfilePath,
      name: "file",
      file_details,
    },
    {
      transfer_method: TransferMethod.POST_URL,
    }
  );

  const maxRetry = 12;
  for (let retry = 0; retry < maxRetry; retry++) {
    try {
      // Wait until result could be ready
      await delay(10 * 1000);
      const request_id: string = response.request_id || "";
      response = await client.pollResult<Sanitize.SanitizeResult>(request_id);
      expect(response.status).toBe("Success");
      expect(response.result.dest_url).toBeDefined();
      expect(response.result.dest_share_id).toBeUndefined();
      expect(response.result.data.redact).toBeUndefined();
      expect(response.result.data.defang).toBeDefined();
      if (response.result.data.defang) {
        expect(response.result.data.defang.external_urls_count).toBeGreaterThan(
          0
        );
        expect(
          response.result.data.defang.external_domains_count
        ).toBeGreaterThan(0);
        expect(response.result.data.defang.defanged_count).toBe(0);
        expect(response.result.data.defang.domain_intel_summary).toBeDefined();
      }
      expect(response.result.data.malicious_file).toBeFalsy();
      if (response.result.dest_url) {
        const attachedFile = await client.downloadFile(
          new URL(response.result.dest_url)
        );
        attachedFile.save("./");
      }
      return;
    } catch (e) {
      if (!(e instanceof PangeaErrors.AcceptedRequestException)) {
        throw e;
      }
    }
  }

  console.warn(
    `The result of request '${response.request_id}' took too long to be ready.`
  );
});
