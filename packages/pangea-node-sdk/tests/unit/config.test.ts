import { it, expect } from "@jest/globals";

import PangeaConfig from "@src/config.js";
import PangeaRequest from "@src/request.js";

const token = "faketoken";
const serviceName = "serviceName";

it("should be able to set base URL template", () => {
  const config = new PangeaConfig({
    baseUrlTemplate: "https://example.org/{SERVICE_NAME}",
  });
  const request = new PangeaRequest(serviceName, token, config);
  expect(request.getUrl("api")).toStrictEqual(
    new URL("https://example.org/serviceName/api")
  );
});

it("should be able to set domain", () => {
  const config = new PangeaConfig({ domain: "example.org" });
  const request = new PangeaRequest(serviceName, token, config);
  expect(request.getUrl("api")).toStrictEqual(
    new URL("https://servicename.example.org/api")
  );
});

it("should prefer base URL template over domain", () => {
  const config = new PangeaConfig({
    baseUrlTemplate: "https://example.org/{SERVICE_NAME}",
    domain: "example.net",
  });
  const request = new PangeaRequest(serviceName, token, config);
  expect(request.getUrl("api")).toStrictEqual(
    new URL("https://example.org/serviceName/api")
  );
});
