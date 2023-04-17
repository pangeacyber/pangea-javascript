// Copyright 2023 Pangea Cyber Corporation
// Author: Pangea Cyber Corporation

import snakeCase from "lodash/snakeCase";

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export const generateBase58 = (length: number) => {
  let result = "";
  const setLength = BASE58_ALPHABET.length;
  for (let i = 0; i < length; i++) {
    result += BASE58_ALPHABET.charAt(Math.floor(Math.random() * setLength));
  }

  return result;
};

const bytesToHex = (uint8a: any) => {
  let hex = "";
  for (let i = 0; i < uint8a.length; i++) {
    hex += uint8a[i].toString(16).padStart(2, "0");
  }
  return hex;
};

export const encode58 = (source: any) => {
  if (source.length === 0) return "";
  if (typeof source === "string") {
    if (typeof TextEncoder !== "undefined") {
      source = new TextEncoder().encode(source);
    } else {
      source = new Uint8Array(source.split("").map((c) => c.charCodeAt(0)));
    }
  }

  let x = BigInt("0x" + bytesToHex(source));
  const output = [];

  while (x > 0) {
    const mod = Number(x % 58n);
    x = x / 58n;
    output.push(BASE58_ALPHABET[mod]);
  }
  for (let i = 0; source[i] === 0; i++) {
    output.push(BASE58_ALPHABET[0]);
  }
  return output.reverse().join("");
};

export const toUrlEncoded = (obj: { [key: string]: string }): string => {
  return Object.keys(obj)
    .map(
      (k) => encodeURIComponent(snakeCase(k)) + "=" + encodeURIComponent(obj[k])
    )
    .join("&");
};

/**
 * isLocalhost - helper function to determine if a hostname is localhost
 * @param hostname {string}
 * @returns {boolean}
 * @example
 * isLocalhost("pangea.cloud");
 * // false
 *
 * isLocalhost("127.0.0.1");
 * // true
 */
export const isLocalhost = (hostname: string): boolean => {
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return true;
  }

  return false;
};

export const diffInSeconds = (dt1: Date, dt2: Date) => {
  const diff = (dt1.getTime() - dt2.getTime()) / 1000;
  return Math.round(diff);
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
