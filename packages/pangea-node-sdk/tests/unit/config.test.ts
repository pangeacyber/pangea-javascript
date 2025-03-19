import PangeaConfig from "@src/config.js";
import { it, expect } from "@jest/globals";
import PangeaRequest from "@src/request.js";

const token = "faketoken";
const urlTemplate = "https://{SERVICE_NAME}.domain.test";
const path = "path";
const serviceName = "serviceName";

it("API URL test", async () => {
  const config = new PangeaConfig({
    baseURLTemplate: urlTemplate,
    insecure: true,
  });
  const request = new PangeaRequest(serviceName, token, config, undefined);
  const url = request.getUrl(path);
  const reference = new URL(
    path,
    urlTemplate.replace("{SERVICE_NAME}", serviceName)
  ).toString();
  expect(url).toBe(reference);
});
