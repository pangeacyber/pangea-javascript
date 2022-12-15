import PangeaConfig from "../../src/config";
import { FileIntelService, DomainIntelService } from "../../src/services/intel";
import { it, expect } from "@jest/globals";

const token = process.env.PANGEA_INTEGRATION_TOKEN || "";
const testHost = process.env.PANGEA_INTEGRATION_DOMAIN || "";
const config = new PangeaConfig({ domain: testHost });
const fileIntel = new FileIntelService(token, config);
const domainIntel = new DomainIntelService(token, config);

it("file lookup should succeed", async () => {
  const options = { provider: "reversinglabs", verbose: true, raw: true };
  const response = await fileIntel.lookup(
    "142b638c6a60b60c7f9928da4fb85a5a8e1422a9ffdc9ee49e17e56ccca9cf6e",
    "sha256",
    options
  );

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});

it("Domain lookup should succeed", async () => {
  const options = { provider: "domaintools", verbose: true, raw: true };
  const response = await domainIntel.lookup("737updatesboeing.com", options);

  expect(response.status).toBe("Success");
  expect(response.result.data).toBeDefined();
  expect(response.result.data.verdict).toBe("malicious");
});
