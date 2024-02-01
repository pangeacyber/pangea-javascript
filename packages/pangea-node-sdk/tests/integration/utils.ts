import { TestEnvironment } from "@src/utils/utils.js";

export function loadTestEnvironment(serviceName: string, def: string) {
  serviceName = serviceName.replace("-", "_").toUpperCase();
  const name = `SERVICE_${serviceName}_ENV`;
  const value = process.env[name];
  if (value === undefined) {
    console.log(
      `Environment variable "${name}" is not set. Return default test environment value: ${def}`
    );
    return def;
  } else if (Object.values(TestEnvironment).includes(value)) {
    return value;
  } else {
    throw new Error(`${name} not allowed value: ${value}`);
  }
}
