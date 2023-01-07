import PangeaConfig from "../../src/config";
import AuditService from "../../src/services/audit";

it("is really a test", async () => {
  const config = new PangeaConfig({});
  const audit = new AuditService("TEST_TOKEN", config);

  expect(config).toBeDefined();
  expect(audit).toBeDefined();
});
