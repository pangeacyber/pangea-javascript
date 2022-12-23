export function canonicalize(obj: Object) {
  function _orderKeys(obj: Object, firstLevel: boolean) {
    const orderedEntries = Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]));
    orderedEntries.forEach((value) => {
      if (value[1] instanceof Date) {
        value[1] = value[1].toISOString();
      } else if (value[1] instanceof Object) {
        if (firstLevel) {
          value[1] = _orderKeys(value[1], false);
        } else {
          value[1] = JSON.stringify(value[1]); // This is to stringify JSON objects in the same way server do
        }
      }
    });
    const orderedObj = Object.fromEntries(orderedEntries);
    return orderedObj;
  }

  const ordererObj = _orderKeys(obj, true);
  return JSON.stringify(ordererObj);
}

export const TestEnvironment = {
  DEVELOP: "DEV",
  LIVE: "LVE",
  STAGING: "STG",
};

export function getTestDomain(environment: string) {
  const name = "PANGEA_INTEGRATION_DOMAIN_" + environment;
  return process.env[name] || "";
}

export function getTestToken(environment: string) {
  const name = "PANGEA_INTEGRATION_TOKEN_" + environment;
  return process.env[name] || "";
}
