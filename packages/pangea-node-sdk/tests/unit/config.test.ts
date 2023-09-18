import PangeaConfig from "@src/config.js";
import { ConfigEnv } from "@src/types.js";
import { it, expect } from "@jest/globals";
import PangeaRequest from "@src/request.js";

const token = "faketoken";
const domain = "domain.test";
const path = "path";
const serviceName = "serviceName";

it("insecure true, environment local", async () => {
  const config = new PangeaConfig({ domain: domain, insecure: true, environment: ConfigEnv.LOCAL });
  const request = new PangeaRequest(serviceName, token, config, undefined);
  const url = request.getUrl(path);
  expect(url).toBe("http://" + domain + "/" + path);
});

it("insecure false, environment local", async () => {
  const config = new PangeaConfig({
    domain: domain,
    insecure: false,
    environment: ConfigEnv.LOCAL,
  });
  const request = new PangeaRequest(serviceName, token, config);
  const url = request.getUrl(path);
  expect(url).toBe("https://" + domain + "/" + path);
});

it("insecure true, environment production", async () => {
  const config = new PangeaConfig({
    domain: domain,
    insecure: true,
    environment: ConfigEnv.PRODUCTION,
  });
  const request = new PangeaRequest(serviceName, token, config);
  const url = request.getUrl(path);
  expect(url).toBe("http://" + serviceName + "." + domain + "/" + path);
});

it("insecure false, environment production", async () => {
  const config = new PangeaConfig({
    domain: domain,
    insecure: false,
    environment: ConfigEnv.PRODUCTION,
  });
  const request = new PangeaRequest(serviceName, token, config);
  const url = request.getUrl(path);
  expect(url).toBe("https://" + serviceName + "." + domain + "/" + path);
});

it("insecure default, environment default", async () => {
  const config = new PangeaConfig({ domain: domain });
  const request = new PangeaRequest(serviceName, token, config);
  const url = request.getUrl(path);
  expect(url).toBe("https://" + serviceName + "." + domain + "/" + path);
});

it("url domain", async () => {
  const urlDomain = "https://myurldomain.net";
  const config = new PangeaConfig({ domain: urlDomain });
  const request = new PangeaRequest(serviceName, token, config);
  const url = request.getUrl(path);
  expect(url).toBe(urlDomain + "/" + path);
});
