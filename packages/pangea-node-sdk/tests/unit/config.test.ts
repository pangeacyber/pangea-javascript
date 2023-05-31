import PangeaConfig from "../../src/config";
import AuditService from "../../src/services/audit";
import { ConfigEnv } from "../../src/types";
import { jest, it, expect } from "@jest/globals";

const token = "faketoken";
const domain = "domain.test";
const path = "path";
const serviceSubdomain = "audit.";

it("insecure true, environment local", async () => {
  const config = new PangeaConfig({ domain: domain, insecure: true, environment: ConfigEnv.LOCAL });
  const audit = new AuditService(token, config);
  const url = audit.request.getUrl(path);
  expect(url).toBe("http://" + domain + "/" + path);
});

it("insecure false, environment local", async () => {
  const config = new PangeaConfig({
    domain: domain,
    insecure: false,
    environment: ConfigEnv.LOCAL,
  });
  const audit = new AuditService(token, config);
  const url = audit.request.getUrl(path);
  expect(url).toBe("https://" + domain + "/" + path);
});

it("insecure true, environment production", async () => {
  const config = new PangeaConfig({
    domain: domain,
    insecure: true,
    environment: ConfigEnv.PRODUCTION,
  });
  const audit = new AuditService(token, config);
  const url = audit.request.getUrl(path);
  expect(url).toBe("http://" + serviceSubdomain + domain + "/" + path);
});

it("insecure false, environment production", async () => {
  const config = new PangeaConfig({
    domain: domain,
    insecure: false,
    environment: ConfigEnv.PRODUCTION,
  });
  const audit = new AuditService(token, config);
  const url = audit.request.getUrl(path);
  expect(url).toBe("https://" + serviceSubdomain + domain + "/" + path);
});

it("insecure default, environment default", async () => {
  const config = new PangeaConfig({ domain: domain });
  const audit = new AuditService(token, config);
  const url = audit.request.getUrl(path);
  expect(url).toBe("https://" + serviceSubdomain + domain + "/" + path);
});

it("url domain", async () => {
  const urlDomain = "https://myurldomain.net";
  const config = new PangeaConfig({ domain: urlDomain });
  const audit = new AuditService(token, config);
  const url = audit.request.getUrl(path);
  expect(url).toBe(urlDomain + "/" + path);
});
