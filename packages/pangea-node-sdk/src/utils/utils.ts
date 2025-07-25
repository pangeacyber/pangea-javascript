import { Buffer } from "node:buffer";
import crypto from "node:crypto";
import fs from "node:fs";

import { crc32c } from "@aws-crypto/crc32c";
import CryptoJS from "crypto-js";
import serialize from "json-canon";

import { PangeaErrors } from "@src/errors.js";
import { FileScan } from "@src/types.js";

export function eventOrderAndStringifySubfields(obj: Object) {
  const orderedEntries = Object.entries(obj).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  for (const value of orderedEntries) {
    if (value[1] instanceof Date) {
      value[1] = value[1].toISOString();
    } else if (value[1] instanceof Object) {
      value[1] = canonicalize(value[1]); // This is to stringify JSON objects in the same way server do
    }
  }
  return Object.fromEntries(orderedEntries);
}

export function canonicalize(obj: Object): string {
  return serialize(obj);
}

export function canonicalizeEnvelope(obj: Object): string {
  const objCopy = JSON.parse(JSON.stringify(obj));
  if (objCopy.event !== undefined) {
    objCopy.event = eventOrderAndStringifySubfields(objCopy.event);
  }
  return canonicalize(objCopy);
}

export function canonicalizeEvent(obj: Object): string {
  return canonicalize(eventOrderAndStringifySubfields(obj));
}

export function strToB64(data: string) {
  return Buffer.from(data, "utf8").toString("base64");
}

export function b64toStr(data: string) {
  return Buffer.from(data, "base64").toString("utf8");
}

export function hashSHA256(data: string): string {
  const sha256 = CryptoJS.algo.SHA256.create();
  sha256.update(data);
  return sha256.finalize().toString();
}

export function hashSHA1(data: string): string {
  const sha1 = CryptoJS.algo.SHA1.create();
  sha1.update(data);
  return sha1.finalize().toString();
}

export function hashSHA512(data: string): string {
  const sha512 = CryptoJS.algo.SHA512.create();
  sha512.update(data);
  return sha512.finalize().toString();
}

export function hashNTLM(password: string): string {
  // Calculate the MD4 hash
  const md4Hash = crypto.createHash("md4");
  md4Hash.update(Buffer.from(password, "utf16le"));

  // Get the NTLM hash as a hexadecimal string
  return md4Hash.digest("hex").toUpperCase();
}

export function getHashPrefix(hash: string, len: number = 5) {
  return hash.substring(0, len);
}

// TODO: convert to enum
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
  const name = `PANGEA_INTEGRATION_DOMAIN_${environment}`;
  return loadEnvVar(name);
}

export function getTestToken(environment: string) {
  const name = `PANGEA_INTEGRATION_TOKEN_${environment}`;
  return loadEnvVar(name);
}

export function getVaultSignatureTestToken(environment: string) {
  const name = `PANGEA_INTEGRATION_VAULT_TOKEN_${environment}`;
  return loadEnvVar(name);
}

export function getMultiConfigTestToken(environment: string) {
  const name = `PANGEA_INTEGRATION_MULTI_CONFIG_TOKEN_${environment}`;
  return loadEnvVar(name);
}

export function getConfigID(
  environment: string,
  service: string,
  configNumber: number
): string {
  const name = `PANGEA_${service.toUpperCase()}_CONFIG_ID_${configNumber}_${environment}`;
  return loadEnvVar(name);
}

export function getCustomSchemaTestToken(environment: string) {
  const name = `PANGEA_INTEGRATION_CUSTOM_SCHEMA_TOKEN_${environment}`;
  return process.env[name] || "";
}

export function getFileUploadParams(
  file: string | Buffer
): FileScan.ScanFileParams {
  const hash = crypto.createHash("sha256");
  let data: Buffer;
  if (typeof file === "string") {
    data = fs.readFileSync(file);
  } else if (Buffer.isBuffer(file)) {
    data = file;
  } else {
    throw new PangeaErrors.PangeaError("Invalid file type");
  }

  const size = data.length;
  hash.update(data);
  const sha256hex = hash.digest("hex");
  const crcValue = crc32c(data);
  return {
    sha256: sha256hex,
    crc32c: crcValue.toString(16).padStart(8, "0"),
    size,
  };
}

export function getFileSize(file: string | Buffer): number {
  let data: Buffer;
  if (typeof file === "string") {
    data = fs.readFileSync(file);
  } else if (Buffer.isBuffer(file)) {
    data = file;
  } else {
    throw new PangeaErrors.PangeaError("Invalid file type");
  }

  return data.length;
}
