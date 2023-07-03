import CryptoJS from "crypto-js";

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

export function canonicalizeEnvelope(obj: Object) {
  const ordererObj = _orderKeys(obj, true);
  return JSON.stringify(ordererObj);
}

export function strToB64(data: string) {
  return Buffer.from(data, "utf8").toString("base64");
}

export function b64toStr(data: string) {
  return Buffer.from(data, "base64").toString("utf8");
}

export function canonicalizeEvent(obj: Object) {
  const ordererObj = _orderKeys(obj, false);
  return JSON.stringify(ordererObj);
}

export function hashSHA256(data: string) {
  var sha256 = CryptoJS.algo.SHA256.create();
  sha256.update(data);
  return sha256.finalize().toString();
}

export function hashSHA1(data: string) {
  var sha1 = CryptoJS.algo.SHA1.create();
  sha1.update(data);
  return sha1.finalize().toString();
}

export function getHashPrefix(hash: string, len: number = 5) {
  return hash.substring(0, len);
}

export const TestEnvironment = {
  DEVELOP: "DEV",
  LIVE: "LVE",
  STAGING: "STG",
};

function loadEnvVar(name: string) {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`${name} environment variable need to be set`);
  }
  return value;
}

export function getTestDomain(environment: string) {
  const name = "PANGEA_INTEGRATION_DOMAIN_" + environment;
  return loadEnvVar(name);
}

export function getTestToken(environment: string) {
  const name = "PANGEA_INTEGRATION_TOKEN_" + environment;
  return loadEnvVar(name);
}

export function getVaultSignatureTestToken(environment: string) {
  const name = "PANGEA_INTEGRATION_VAULT_TOKEN_" + environment;
  return loadEnvVar(name);
}

export function getMultiConfigTestToken(environment: string) {
  const name = "PANGEA_INTEGRATION_MULTI_CONFIG_TOKEN_" + environment;
  return loadEnvVar(name);
}

export function getConfigID(environment: string, service: string, configNumber: number) {
  const name = `PANGEA_${service.toUpperCase()}_CONFIG_ID_${configNumber}_` + environment;
  return loadEnvVar(name);
}
