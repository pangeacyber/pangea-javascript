import CryptoJS from "crypto-js";

function orderKeysRecursive(obj: Object) {
  const orderedEntries = Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]));
  orderedEntries.forEach((value) => {
    if (value[1] instanceof Object) {
      value[1] = orderKeysRecursive(value[1]);
    }
  });
  const orderedObj = Object.fromEntries(orderedEntries);
  return orderedObj;
}

var replacer = function (this: any, key: string, value: any) {
  if (this[key] instanceof Date) {
    return this[key].toISOString();
  }
  return value;
};

export function eventOrderAndStringifySubfields(obj: Object) {
  const orderedEntries = Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]));
  orderedEntries.forEach((value) => {
    if (value[1] instanceof Date) {
      value[1] = value[1].toISOString();
    } else if (value[1] instanceof Object) {
      value[1] = JSON.stringify(value[1], replacer); // This is to stringify JSON objects in the same way server do
    }
  });
  const orderedObj = Object.fromEntries(orderedEntries);
  return orderedObj;
}

export function canonicalize(obj: Object): string {
  return JSON.stringify(orderKeysRecursive(obj), replacer);
}

export function canonicalizeEnvelope(obj: Object) {
  const objCopy = JSON.parse(JSON.stringify(obj));
  if (objCopy.event !== undefined) {
    objCopy.event = eventOrderAndStringifySubfields(objCopy.event);
  }
  return canonicalize(objCopy);
}

export function canonicalizeEvent(obj: Object) {
  return canonicalize(eventOrderAndStringifySubfields(obj));
}

export function strToB64(data: string) {
  return Buffer.from(data, "utf8").toString("base64");
}

export function b64toStr(data: string) {
  return Buffer.from(data, "base64").toString("utf8");
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

export function getTestDomain(environment: string) {
  const name = "PANGEA_INTEGRATION_DOMAIN_" + environment;
  return process.env[name] || "";
}

export function getTestToken(environment: string) {
  const name = "PANGEA_INTEGRATION_TOKEN_" + environment;
  return process.env[name] || "";
}

export function getVaultSignatureTestToken(environment: string) {
  const name = "PANGEA_INTEGRATION_VAULT_TOKEN_" + environment;
  return process.env[name] || "";
}

export function getCustomSchemaTestToken(environment: string) {
  const name = "PANGEA_INTEGRATION_CUSTOM_SCHEMA_TOKEN_" + environment;
  return process.env[name] || "";
}
